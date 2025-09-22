'use client';
import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useGetAllProductsQuery } from '@/api/apiSlice';

interface ProductLegendItem {
	prod_ID: string;
	color: string;
	totalQty: number;
	byPackage: { pack_ID: string; qty: number; color?: string }[]; // color per package
	byStop: { stop: number; qty: number }[];
}

interface TruckCapacity {
	allowedLayers: number;
	maxLayersByHeight?: number;
	maxM3?: number;
	oneLayerM3: number;
	rawM3: number;
	usableM3: number;
	perLineLayers?: { prod_ID: string; pac_ID: string; allowedLayers: number }[];
}

export interface PackageBlock {
	pkg_ID: string;
	prod_ID?: string;
	color: string;
	dimensions: [number, number, number];   // [L, H, W]
	position: [number, number, number];     // [xFront, y, z]
	quantity?: number;
}

export interface TruckSceneProps {
	vehicleDimensions: { length: number; width: number; height: number };
	packageBlocks: PackageBlock[];
	truckCapacity?: TruckCapacity;
	productLegend?: ProductLegendItem[];
}

const TruckScene: React.FC<TruckSceneProps> = ({
	vehicleDimensions,
	packageBlocks,
	truckCapacity,
	// productLegend,
}) => {
	const { length, width, height } = vehicleDimensions;
	const { data: productsData } = useGetAllProductsQuery({});
	const allProductsData = productsData?.products || [];
	console.log("all prods:", allProductsData)
	// Simple truck proportions for render only
	const cabinLength = 1.2;
	const cabinHeight = height * 0.6;
	const wheelRadius = 0.5;
	const wheelY = wheelRadius;
	const steelPlateY = wheelY + 0.5;
	const cabinX = cabinLength / 2;
	const cameraDistance = Math.max(length, width, height) * 1.5;

	// Clamp visually to single layer if caps say so
	const singleLayer = (truckCapacity?.allowedLayers ?? 1) <= 1;

	// Visual z-row gutter
	const ROW_GUTTER = 0.02;
	const zIndexByValue = useMemo(() => {
		const zs = Array.from(new Set(packageBlocks.map(b => +b.position[2]))).sort((a, b) => a - b);
		return new Map(zs.map((z, i) => [z, i]));
	}, [packageBlocks]);


	const calculateWheelPositions = () => {
		const numberOfAxles = length <= 5 ? 2 : length <= 8 ? 3 : 4;
		const insetZ = 0.3;
		const leftZ = insetZ;
		const rightZ = width - insetZ;
		const wheelPositions: [number, number, number][] = [];
		wheelPositions.push([cabinX, wheelY, leftZ], [cabinX, wheelY, rightZ]);
		const axleStart = cabinLength + length * 0.25;
		const axleEnd = cabinLength + length - 0.8;
		const axleSpacing = numberOfAxles > 1 ? (axleEnd - axleStart) / (numberOfAxles - 1) : 0;
		for (let i = 0; i < numberOfAxles; i++) {
			const axleX = axleStart + i * axleSpacing;
			wheelPositions.push([axleX, wheelY, leftZ], [axleX, wheelY, rightZ]);
		}
		return wheelPositions;
	};

	const wheelPositions = calculateWheelPositions();

	// Fallback legend (by product) if BE didn't send productLegend
	// const fallbackLegend = useMemo(() => {
	// 	const map = new Map<string, { color: string; count: number }>();
	// 	for (const b of packageBlocks) {
	// 		const key = b.prod_ID || b.pkg_ID;
	// 		const entry = map.get(key);
	// 		map.set(key, { color: b.color, count: (entry?.count || 0) + 1 });
	// 	}
	// 	return Array.from(map.entries()).map(([prod_ID, v]) => ({
	// 		prod_ID, color: v.color, totalQty: v.count, byPackage: [], byStop: []
	// 	})) as ProductLegendItem[];
	// }, [packageBlocks]);

	// const legend = productLegend?.length ? productLegend : fallbackLegend;

	return (
		<div style={{ display: "flex", gap: "2rem" }}>
			<div style={{ flex: 2 }}>
				<Canvas
					camera={{
						position: [cameraDistance, cameraDistance * 0.6, cameraDistance],
						fov: 45,
					}}
					style={{ height: 600, width: "100%" }}
				>
					<ambientLight intensity={0.8} />
					<directionalLight position={[10, 10, 5]} intensity={1.2} />
					<OrbitControls enableZoom enableRotate enablePan={false} />

					{/* Cabin */}
					<mesh position={[cabinX, wheelY + cabinHeight / 2 + 0.5, width / 2]}>
						<boxGeometry args={[cabinLength, cabinHeight, width]} />
						<meshStandardMaterial color="#b87333" />
					</mesh>

					{/* Transparent cargo volume */}
					<mesh
						position={[
							cabinLength + length / 2,
							steelPlateY + (height - steelPlateY) / 2,
							width / 2,
						]}
					>
						<boxGeometry args={[length, height - steelPlateY, width]} />
						<meshStandardMaterial color="white" transparent opacity={0.35} />
					</mesh>

					{/* Steel floor */}
					<mesh position={[cabinLength + length / 2, steelPlateY, width / 2]}>
						<boxGeometry args={[length, 0.05, width]} />
						<meshStandardMaterial color="#222" metalness={1} roughness={0.3} />
					</mesh>

					{/* Wheels */}
					{wheelPositions.map((pos, idx) => (
						<mesh key={idx} position={pos} rotation={[Math.PI / 2, 0, 0]}>
							<cylinderGeometry args={[0.5, 0.5, 0.3, 32]} />
							<meshStandardMaterial color="black" />
						</mesh>
					))}

					{/* Boxes (colors by product+package from BE) */}
					{packageBlocks.map((block, i) => {
						const [L, H, W] = block.dimensions;
						const [xFront, yBE, zBE] = block.position;
						const y0 = singleLayer ? 0 : yBE;
						const zRowIndex = zIndexByValue.get(zBE) ?? 0;
						const zWithGutter = zBE + zRowIndex * ROW_GUTTER;
						return (
							<mesh
								key={`${block.pkg_ID}-${block.prod_ID ?? "prod"}-${i}`}
								position={[
									cabinLength + xFront + L / 2,
									steelPlateY + y0 + H / 2,
									zWithGutter + W / 2,
								]}
								castShadow
								receiveShadow
							>
								<boxGeometry args={[L, H, W]} />
								<meshStandardMaterial
									color={block.color}
									polygonOffset
									polygonOffsetFactor={1}
								/>
							</mesh>
						);
					})}
				</Canvas>
			</div>

			{/* Side panel */}
			{/* <div style={{ flex: 1 }}>
				<h3>Truck Details</h3>
				<ul style={{ lineHeight: "1.6" }}>
					<li>
						<strong>Length:</strong> {length} m
					</li>
					<li>
						<strong>Width:</strong> {width} m
					</li>
					<li>
						<strong>Height:</strong> {height} m
					</li>
				</ul>

				<div
					style={{
						backgroundColor: "#e0f7fa",
						padding: 12,
						borderLeft: "5px solid #00796b",
						borderRadius: 4,
					}}
				>
					<h4 style={{ margin: 0, color: "#00796b" }}>Truck Capacity</h4>
					<p style={{ margin: 0 }}>
						<b>Interior (raw):</b> {truckCapacity?.rawM3?.toFixed(2) ?? "—"} m³
					</p>
					<p style={{ margin: 0 }}>
						<b>One layer (est.):</b>{" "}
						{truckCapacity?.oneLayerM3?.toFixed(2) ?? "—"} m³
					</p>
					<p style={{ margin: 0 }}>
						<b>Usable by rules:</b>{" "}
						{truckCapacity?.usableM3 != null
							? truckCapacity.usableM3.toFixed(2)
							: "—"}{" "}
						m³
					</p>
					<p style={{ margin: 0 }}>
						<b>Layers allowed:</b> {truckCapacity?.allowedLayers ?? 1}
						{truckCapacity?.maxLayersByHeight != null && (
							<>
								{" "}
								<small>(height limit: {truckCapacity.maxLayersByHeight})</small>
							</>
						)}
					</p>
				</div>

				<h3 style={{ marginTop: "1.5rem" }}>Product Color Legend</h3>
				<ul style={{ paddingLeft: 0, listStyle: "none" }}>
					{legend.map((it, idx) => (
						<li key={idx} style={{ marginBottom: "0.75rem" }}>
							<div style={{ display: "flex", alignItems: "center" }}>
								<div
									style={{
										width: 16,
										height: 16,
										backgroundColor: it.color,
										marginRight: 8,
										border: "1px solid #000",
									}}
								/>
								<span>
									{" "}
									<b>
										{allProductsData.find(
											(singleProd: {
												product_ID: string;
												product_name: string;
											}) => singleProd.product_ID === it.prod_ID
										)?.product_name ?? it.prod_ID}
									</b>{" "}
									({it.prod_ID})— qty {it.totalQty}
								</span>
							</div>
							{!!it.byPackage?.length && (
								<ul style={{ marginTop: 4, marginBottom: 0 }}>
									{it.byPackage.map((p) => (
										<li
											key={`${it.prod_ID}- ${p.pack_ID}`}
											style={{
												fontSize: 12,
												display: "flex",
												alignItems: "center",
												gap: 6,
											}}
										>
											<span
												style={{
													width: 12,
													height: 12,
													background: p.color || it.color,
													border: "1px solid #000",
												}}
											/>
											in <code>{p.pack_ID}</code>: {p.qty}
										</li>
									))}
								</ul>
							)}
						</li>
					))}
				</ul>
			</div> */}
		</div>
	);
};

export default TruckScene;