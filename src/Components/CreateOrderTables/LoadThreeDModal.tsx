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
	// Simple truck proportions for render only
	const cabinLength = 1.6;
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

	// Find how far boxes extend along Z
	const maxZ = Math.max(...packageBlocks.map(b => b.position[2] + b.dimensions[2]));
	const cargoWidth = Math.max(width + 0.35, maxZ); // ensure cargo at least covers boxes

	const calculateWheelPositions = () => {
		const numberOfAxles = length <= 5 ? 2 : length <= 8 ? 3 : 4;
		const insetZ = 0.5;
		const leftZ = insetZ;
		const rightZ = cargoWidth - insetZ;  // use cargoWidth instead of width
		const wheelPositions: [number, number, number][] = [];

		// Cabin wheels
		wheelPositions.push([cabinX, wheelY, leftZ], [cabinX, wheelY, rightZ]);

		const axleStart = cabinLength + length * 0.25;
		const axleEnd = cabinLength + length - 0.8;
		const axleSpacing =
			numberOfAxles > 1 ? (axleEnd - axleStart) / (numberOfAxles - 1) : 0;

		for (let i = 0; i < numberOfAxles; i++) {
			const axleX = axleStart + i * axleSpacing;
			wheelPositions.push([axleX, wheelY, leftZ], [axleX, wheelY, rightZ]);
		}

		return wheelPositions;
	};

	const wheelPositions = calculateWheelPositions();


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
							cargoWidth / 2,
						]}
					>
						<boxGeometry args={[length, height - steelPlateY, cargoWidth]} />
						<meshStandardMaterial color="white" transparent opacity={0.35} />
					</mesh>

					{/* Steel floor */}
					<mesh position={[cabinLength + length / 2, steelPlateY, cargoWidth / 2]}>
						<boxGeometry args={[length, 0.05, cargoWidth]} />
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
		</div>
	);
};

export default TruckScene;