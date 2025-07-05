
// import React, { useEffect, useMemo, useState } from "react";
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls, Text } from "@react-three/drei";
// import * as THREE from "three";
// import { Truck } from "./TrucksTable";
// import { Package } from "./PackagesTable";
// import { useGetVehicleByIdQuery, useGetAllProductsQuery } from "@/api/apiSlice";
// import { Backdrop, CircularProgress } from "@mui/material";

// interface Truck3DProps {
// 	truckData: Truck[];
// 	selectedPackages: Package[];
// }

// interface PackagePlacement {
// 	position: [number, number, number];
// 	dimensions: [number, number, number];
// 	pack_ID: string;
// 	color: string;
// }

// const parseMeters = (value: string): number =>
// 	parseFloat(value.replace("m", "").trim());

// const TruckScene: React.FC<Truck3DProps> = ({
// 	truckData,
// 	selectedPackages,
// }) => {
// 	console.log("trucData:", truckData) 
// 	const vehicle_ID =truckData[0]?.vehicle_ID
// 	const { data: vehicleById, isLoading: vehicleLoading } =
// 		useGetVehicleByIdQuery({ vehicle_ID });
// 	const { data: productsData  } = useGetAllProductsQuery({});
// 	const allProducts = productsData?.products || [];
// 	if (vehicleLoading) { 
// 		console.log("loadingggg")
// 	}
// 	const truck = truckData[0];
// 	const vehicle = vehicleById?.vehicle;
// console.log("allProducts :", allProducts);

// const [truckInterior, setTruckInterior] = useState({
// 	width: 1,
// 	height: 1,
// 	length: 2,
// });

// useEffect(() => {
// 	if (vehicle) {
// 		const capacity = vehicle?.capacity;
// 		setTruckInterior({
// 			width: parseMeters(capacity?.interior_width),
// 			height: parseMeters(capacity?.interior_height),
// 			length: parseMeters(capacity?.interior_length),
// 		});
// 	}
// }, [vehicle]);

// 	const productMap = useMemo(() => {
// 		const map = new Map<
// 			string,
// 			{ volume: number; weight: number; name: string }
// 		>();
// 		for (const p of allProducts) {
// 			map.set(p.product_ID, {
// 				volume: parseFloat(p.volume),
// 				weight: parseFloat(p.weight),
// 				name: p.product_name,
// 			});
// 		}
// 		return map;
// 	}, [allProducts]);

// 	const packages: PackagePlacement[] = useMemo(() => {
// 		const placedPackages: PackagePlacement[] = [];
// 		const stopOrder = [...truck?.loadArrangement];
// 		const colors = ["#4287f5", "#42f57b", "#f5d142", "#f5427b"];

// 		const cabinLength = 1.5;
// 		const usableLength = truckInterior.length - cabinLength;
// 		const gridLength = Math.floor(usableLength / 0.5);
// 		const gridWidth = Math.floor(truckInterior.width / 0.5);

// 		const stackMap: number[][] = Array.from({ length: gridLength }, () =>
// 			Array(gridWidth).fill(0)
// 		);
// 		const dimensionMap: [number, number][][] = Array.from(
// 			{ length: gridLength },
// 			() => Array(gridWidth).fill([Infinity, Infinity])
// 		);

// 		const totalVolume =
// 			truckInterior.length * truckInterior.width * truckInterior.height;
// 		let filledVolume = 0;

// 		const canPlaceOn = (
// 			x: number,
// 			z: number,
// 			heightLevel: number,
// 			dims: [number, number, number]
// 		) => {
// 			const [existingLength, existingWidth] = dimensionMap[x][z];
// 			return (
// 				stackMap[x][z] === heightLevel &&
// 				dims[0] <= existingLength &&
// 				dims[2] <= existingWidth
// 			);
// 		};

// 		const placeBox = (
// 			x: number,
// 			z: number,
// 			heightLevel: number,
// 			dims: [number, number, number],
// 			color: string,
// 			pack_ID: string
// 		) => {
// 			const xPos = cabinLength + x * 0.5 + dims[0] / 2;
// 			const zPos = z * 0.5 + dims[2] / 2;
// 			const yPos = heightLevel * dims[1] + dims[1] / 2;

// 			placedPackages.push({
// 				position: [xPos, yPos, zPos],
// 				dimensions: dims,
// 				pack_ID,
// 				color,
// 			});
// 			stackMap[x][z]++;
// 			dimensionMap[x][z] = [dims[0], dims[2]];
// 			filledVolume += dims[0] * dims[1] * dims[2];
// 		};

// 		for (let stopIndex = 0; stopIndex < stopOrder.length; stopIndex++) {
// 			const stop = stopOrder[stopOrder.length - 1 - stopIndex];
// 			const color = colors[stopIndex % colors.length];

// 			for (const packId of stop.packages) {
// 				const pkg = selectedPackages.find((p) => p.pack_ID === packId);
// 				if (!pkg || !pkg.product_ID) continue;

// 				let volume = 0;
// 				for (const prod of pkg.product_ID) {
// 					const prodData = productMap.get(prod.prod_ID);
// 					if (prodData) {
// 						volume += prodData.volume * (prod.quantity || 1);
// 					}
// 				}

// 				const baseEdge = Math.cbrt(volume);
// 				const maxDims: [number, number, number] = [
// 					truckInterior.length - cabinLength,
// 					truckInterior.height,
// 					truckInterior.width,
// 				];

// 				let dims: [number, number, number] = [baseEdge, baseEdge, baseEdge];
// 				if (dims[1] > maxDims[1]) dims[1] = maxDims[1];
// 				if (dims[2] > maxDims[2]) dims[2] = maxDims[2];
// 				if (dims[0] > maxDims[0]) dims[0] = maxDims[0];

// 				const adjustedVolume = dims[0] * dims[1] * dims[2];
// 				const volumeRatio = volume / adjustedVolume;
// 				dims = [
// 					dims[0] * Math.cbrt(volumeRatio),
// 					dims[1] * Math.cbrt(volumeRatio),
// 					dims[2] * Math.cbrt(volumeRatio),
// 				];

// 				let placed = false;
// 				for (let h = 0; h < 20 && !placed; h++) {
// 					for (let x = 0; x < gridLength && !placed; x++) {
// 						for (let z = 0; z < gridWidth && !placed; z++) {
// 							if (canPlaceOn(x, z, h, dims)) {
// 								placeBox(x, z, h, dims, color, pkg.pack_ID);
// 								placed = true;
// 							}
// 						}
// 					}
// 				}
// 			}
// 		}

// 		(window as any).truckFillPercentage = (
// 			(filledVolume / totalVolume) *
// 			100
// 		).toFixed(2);
// 		return placedPackages;
// 	}, [truck, selectedPackages, truckInterior, productMap]);

// 	const fillPercentage = (window as any).truckFillPercentage;

// 	return (
// 		<> <Backdrop
// 				sx={{
// 					color: "#ffffff",
// 					zIndex: (theme) => theme.zIndex.drawer + 1,
// 					}}
// 				open={vehicleLoading}
// 			>
// 						<CircularProgress color="inherit" />
// 					</Backdrop>
// 			<div
// 				style={{
// 					position: "absolute",
// 					bottom: 10,
// 					left: 10,
// 					background: "#eee",
// 					padding: "10px",
// 					borderRadius: 8,
// 					width: 200,
// 				}}
// 			>
// 				<div style={{ marginBottom: 4 }}>Truck Fill: {fillPercentage}%</div>
// 				<div style={{ height: 10, background: "#ccc", borderRadius: 5 }}>
// 					<div
// 						style={{
// 							width: `${fillPercentage}%`,
// 							height: "100%",
// 							background: "#4caf50",
// 							borderRadius: 5,
// 						}}
// 					/>
// 				</div>
// 			</div>

// 			<Canvas camera={{ position: [5, 5, 10], fov: 50 }}>
// 				<ambientLight intensity={0.5} />
// 				<pointLight position={[10, 10, 10]} />
// 				<OrbitControls />

// 				<mesh
// 					position={[
// 						truckInterior.length / 2,
// 						truckInterior.height / 2,
// 						truckInterior.width / 2,
// 					]}
// 				>
// 					<boxGeometry
// 						args={[
// 							truckInterior.length,
// 							truckInterior.height,
// 							truckInterior.width,
// 						]}
// 					/>
// 					<meshStandardMaterial
// 						color="gray"
// 						wireframe
// 						transparent
// 						opacity={0.2}
// 					/>
// 				</mesh>

// 				<mesh
// 					position={[
// 						1.5 / 2,
// 						truckInterior.height / 2,
// 						truckInterior.width / 2,
// 					]}
// 				>
// 					<boxGeometry
// 						args={[1.5, truckInterior.height, truckInterior.width]}
// 					/>
// 					<meshStandardMaterial color="black" opacity={0.4} transparent />
// 				</mesh>

// 				{packages.map((pkg, index) => (
// 					<React.Fragment key={index}>
// 						<mesh position={pkg.position}>
// 							<boxGeometry args={pkg.dimensions} />
// 							<meshStandardMaterial color={pkg.color} />
// 						</mesh>
// 						<lineSegments position={pkg.position}>
// 							<edgesGeometry
// 								attach="geometry"
// 								args={[new THREE.BoxGeometry(...pkg.dimensions)]}
// 							/>
// 							<lineBasicMaterial color="black" linewidth={0.1} />
// 						</lineSegments>
// 						<Text
// 							position={[
// 								pkg.position[0],
// 								pkg.position[1] + pkg.dimensions[1] / 2 + 0.1,
// 								pkg.position[2],
// 							]}
// 							fontSize={0.1}
// 							color="black"
// 							anchorX="center"
// 							anchorY="middle"
// 						>
// 							{pkg.pack_ID}
// 						</Text>
// 					</React.Fragment>
// 				))}
// 			</Canvas>

// 			<div
// 				style={{
// 					position: "absolute",
// 					top: 10,
// 					left: 10,
// 					background: "white",
// 					padding: "6px 10px",
// 					borderRadius: 8,
// 				}}
// 			>
// 				Truck Fill: <strong>{fillPercentage}%</strong>
// 			</div>
// 		</>
// 	);
// };

// export default TruckScene;




import React, { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { Truck } from "./TrucksTable";
import { Package } from "./PackagesTable";
import { useGetVehicleByIdQuery, useGetAllProductsQuery, useGetPackageMasterQuery } from "@/api/apiSlice";
import { Backdrop, CircularProgress } from "@mui/material";

interface Truck3DProps {
	truckData: Truck[];
	selectedPackages: Package[];
}

interface ProductBox {
	position: [number, number, number];
	dimensions: [number, number, number];
	color: string;
	label: string;
}

const parseMeters = (value: string): number =>
	parseFloat(value.replace("m", "").trim());

const TruckScene: React.FC<Truck3DProps> = ({
	truckData,
	selectedPackages,
}) => {
	const [stats, setStats] = useState({
		totalVolume: 0,
		filledVolume: 0,
		leftoverVolume: 0,
		fillPercentage: 0,
		productCount: 0,
		productQuantity: 0,
		packageCount: 0,
	});
	
	const vehicle_ID = truckData[0]?.vehicle_ID;
	const { data: vehicleById, isLoading: vehicleLoading } =
		useGetVehicleByIdQuery({ vehicle_ID });
	const { data: productsData } = useGetAllProductsQuery({});
	const { data: allPackageInfo } = useGetPackageMasterQuery({});
 
	const allPackages = allPackageInfo.packages;
	console.log('allpackage:', allPackages)
	const allProducts = productsData?.products || [];

	const truck = truckData[0];
	const vehicle = vehicleById?.vehicle;

	const [truckInterior, setTruckInterior] = useState({
		width: 1,
		height: 1,
		length: 2,
	});

	useEffect(() => {
		if (vehicle) {
			const capacity = vehicle?.capacity;
			setTruckInterior({
				width: parseMeters(capacity?.interior_width),
				height: parseMeters(capacity?.interior_height),
				length: parseMeters(capacity?.interior_length),
			});
		}
	}, [vehicle]);

	const productMap = useMemo(() => {
		const map = new Map<
			string,
			{ volume: number; weight: number; name: string }
		>();
		for (const p of allProducts) {
			console.log("only product is:", p)
			map.set(p.product_ID, {
				volume: parseFloat(p.volume),
				weight: parseFloat(p.weight),
				name: p.product_name,
			});
		}
		
		return map;
	}, [allProducts]);

	// const productMap = useMemo(() => {
	// 	const map = new Map<
	// 		string,
	// 		{
	// 			length: number;
	// 			width: number;
	// 			height: number;
	// 			weight: number;
	// 			name: string;
	// 		}
	// 	>();

	// 	for (const p of allProducts) {
	// 		// Extract the package ID from the product (assume one packaging type for simplicity)
	// 		const pacID = p?.packaging_type?.[0]?.pac_ID;

	// 		// Find matching package from allPackages using pac_ID
	// 		const matchingPackage = allPackages?.find((pkg) => pkg.pac_ID === pacID);

	// 		if (matchingPackage) {
	// 			map.set(p.product_ID, {
	// 				length: parseFloat(matchingPackage.pack_length),
	// 				width: parseFloat(matchingPackage.pack_width),
	// 				height: parseFloat(matchingPackage.pack_height),
	// 				weight: parseFloat(p.weight),
	// 				name: p.product_name,
	// 			});
	// 		} else {
	// 			console.warn(`No matching package found for product: ${p.product_ID}`);
	// 		}
	// 	}

	// 	return map;
	// }, [allProducts, allPackages]);
	
	const products: ProductBox[] = useMemo(() => {
		const placedProducts: ProductBox[] = [];
		const stopOrder = [...truck?.loadArrangement];
		const colors = ["#4287f5", "#42f57b", "#f5d142", "#f5427b", "#9f42f5"];

		const cabinLength = 1.5;
		const usableLength = truckInterior.length - cabinLength; ;

		let cursorX = 0;
		let cursorY = 0;
		let cursorZ = 0;
		let maxRowHeight = 0;

		const totalVolume =
			truckInterior.length * truckInterior.width * truckInterior.height;
		let filledVolume = 0;

		const moveToNextRow = () => {
			cursorZ = 0;
			cursorX += maxRowHeight;
			maxRowHeight = 0;
		};

		const moveToNextLayer = () => {
			cursorX = 0;
			cursorZ = 0;
			cursorY += 0.2;
			maxRowHeight = 0;
		};

		for (let stopIndex = 0; stopIndex < stopOrder.length; stopIndex++) {
			const stop = stopOrder[stopOrder.length - 1 - stopIndex];
			const color = colors[stopIndex % colors.length];

			for (const packId of stop.packages) {
				const pkg = selectedPackages.find((p) => p.pack_ID === packId);
				if (!pkg || !pkg.product_ID) continue;

				for (const prod of pkg.product_ID) {
					const prodData = productMap.get(prod.prod_ID);
					
					if (!prodData) continue;

					const quantity = prod.quantity || 1;
					const volumePerUnit = 
					prodData.volume
						// prodData.length * prodData.width * prodData.height;
					 
					for (let i = 0; i < quantity; i++) {
						const edge = Math.cbrt(volumePerUnit);
						const dims: [number, number, number] = [edge, edge, edge];

						// Check boundaries
						if (cursorZ + dims[2] > truckInterior.width) {
							moveToNextRow();
						}
						if (cursorX + dims[0] > usableLength) {
							moveToNextLayer();
						}
						if (cursorY + dims[1] > truckInterior.height) {
							// console.warn("Truck overflow, skipping remaining products");
// console.log("skipping some")
							continue;
						}

						const posX = cabinLength + cursorX + dims[0] / 2;
						const posY = cursorY + dims[1] / 2;
						const posZ = cursorZ + dims[2] / 2;

						placedProducts.push({
							position: [posX, posY, posZ],
							dimensions: dims,
							color,
							label: prodData.name,
						});

						// cursorX += dims[0];
						// maxRowHeight = Math.max(maxRowHeight, dims[2]);
						cursorZ += dims[2];
						maxRowHeight = Math.max(maxRowHeight, dims[0]); // now height of X row

						filledVolume += dims[0] * dims[1] * dims[2];
					}
				}
			}
		}

		(window as any).truckFillPercentage = (
			(filledVolume / totalVolume) *
			100
		).toFixed(2);
		setStats({
			totalVolume,
			filledVolume,
			leftoverVolume: totalVolume - filledVolume,
			fillPercentage: parseFloat(
				((filledVolume / totalVolume) * 100).toFixed(2)
			),
			productCount: placedProducts.length,
			productQuantity: placedProducts.length,
			packageCount: selectedPackages.length,
		});
		
		return placedProducts;
	}, [truck, selectedPackages, truckInterior, productMap]);

	const fillPercentage = (window as any).truckFillPercentage;

	return (
		<>
			<Backdrop
				sx={{
					color: "#ffffff",
					zIndex: (theme) => theme.zIndex.drawer + 1,
				}}
				open={vehicleLoading}
			>
				<CircularProgress color="inherit" />
			</Backdrop>

	
			<div
				style={{
					position: "absolute",
					top: 60,
					left: 10,
					background: "white",
					padding: "10px",
					borderRadius: 8,
					fontSize: "0.85rem",
					maxWidth: 300,
					boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
				}}
			>
				<h4>Truck Info</h4>
				<div>
					<strong>Dimensions:</strong> {truckInterior.length}m (L) ×{" "}
					{truckInterior.width}m (W) × {truckInterior.height}m (H)
				</div>
				<div>
					<strong>Total Volume:</strong> {stats.totalVolume.toFixed(2)} m³
				</div>
				<div>
					<strong>Filled Volume:</strong> {stats.filledVolume.toFixed(2)} m³
				</div>
				<div>
					<strong>Leftover Volume:</strong> {stats.leftoverVolume.toFixed(2)} m³
				</div>
				<div>
					<strong>Fill %:</strong> {stats.fillPercentage}%
				</div>
				<div>
					<strong>Packages:</strong> {stats.packageCount}
				</div>
				<div>
					<strong>Total Products:</strong> {stats.productCount}
				</div>
			</div>

			<Canvas camera={{ position: [5, 5, 10], fov: 50 }}>
				<ambientLight intensity={0.5} />
				<pointLight position={[10, 10, 10]} />
				<OrbitControls />

				{/* Truck Box */}
				<mesh
					position={[
						truckInterior.length / 2,
						truckInterior.height / 2,
						truckInterior.width / 2,
					]}
				>
					<boxGeometry
						args={[
							truckInterior.length,
							truckInterior.height,
							truckInterior.width,
						]}
					/>
					<meshStandardMaterial
						color="gray"
						wireframe
						transparent
						opacity={0.2}
					/>
				</mesh>

				{/* Driver Cabin */}
				<mesh
					position={[
						1.5 / 2,
						truckInterior.height / 2,
						truckInterior.width / 2,
					]}
				>
					<boxGeometry
						args={[1.5, truckInterior.height, truckInterior.width]}
					/>
					<meshStandardMaterial color="black" opacity={0.4} transparent />
				</mesh>

				{/* Render Products */}
				{products.map((prod, index) => (
					<React.Fragment key={index}>
						<mesh position={prod.position}>
							<boxGeometry args={prod.dimensions} />
							<meshStandardMaterial color={prod.color} />
						</mesh>
						<lineSegments position={prod.position}>
							<edgesGeometry
								attach="geometry"
								args={[new THREE.BoxGeometry(...prod.dimensions)]}
							/>
							<lineBasicMaterial color="black" linewidth={0.1} />
						</lineSegments>
						<Text
							position={[
								prod.position[0],
								prod.position[1] + prod.dimensions[1] / 2 + 0.05,
								prod.position[2],
							]}
							fontSize={0.08}
							color="black"
							anchorX="center"
							anchorY="middle"
						>
							{prod.label}
						</Text>
					</React.Fragment>
				))}
			</Canvas>

			<div
				style={{
					position: "absolute",
					top: 10,
					left: 10,
					background: "white",
					padding: "6px 10px",
					borderRadius: 8,
				}}
			>
				Truck Fill: <strong>{fillPercentage}%</strong>
			</div>
		</>
	);
};

export default TruckScene;
