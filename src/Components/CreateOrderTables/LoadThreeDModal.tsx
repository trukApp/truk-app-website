// import React, { useEffect, useMemo, useState } from "react";
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls, Edges, Stage, Environment } from "@react-three/drei";
// import {
// 	useGetVehicleByIdQuery,
// 	useGetAllProductsQuery,
// 	useGetPackageMasterQuery
// } from "@/api/apiSlice";
// import { Package } from "./PackagesTable";
// import { Backdrop, CircularProgress } from "@mui/material";
// import { Truck } from "./TrucksTable";

// interface Truck3DProps {
// 	truckData: Truck[];
// 	selectedPackages: Package[];
// }

// interface ProductBox {
// 	position: [number, number, number];
// 	dimensions: [number, number, number];
// 	color: string;
// 	label: string;
// 	stop: number;
// }

// const parseMeters = (value: string): number =>
// 	parseFloat(value?.replace("m", "").trim() || "0");

// const TruckScene: React.FC<Truck3DProps> = ({ truckData, selectedPackages }) => {
// 	const [stats, setStats] = useState({
// 		totalVolume: 0,
// 		filledVolume: 0,
// 		leftoverVolume: 0,
// 		fillPercentage: 0,
// 		productCount: 0,
// 		productQuantity: 0,
// 		packageCount: 0
// 	});

// 	const vehicle_ID = truckData[0]?.vehicle_ID;
// 	const { data: vehicleById, isLoading: vehicleLoading } = useGetVehicleByIdQuery({ vehicle_ID });
// 	const { data: productsData } = useGetAllProductsQuery({});
// 	const { data: allPackageInfo } = useGetPackageMasterQuery({});

// 	const allPackages = allPackageInfo?.packages || [];
// 	const allProducts = productsData?.products || [];
// 	const truck = truckData[0];
// 	const vehicle = vehicleById?.vehicle;

// 	console.log("allProducts: ", allProducts)

// 	const [truckInterior, setTruckInterior] = useState({
// 		width: 1,
// 		height: 1,
// 		length: 2
// 	});

// 	useEffect(() => {
// 		if (vehicle) {
// 			const capacity = vehicle?.capacity;
// 			setTruckInterior({
// 				width: parseMeters(capacity?.interior_width) * 0.85,
// 				height: parseMeters(capacity?.interior_height),
// 				length: parseMeters(capacity?.interior_length) * 0.9
// 			});
// 		}
// 	}, [vehicle]);

// 	const productMap = useMemo(() => {
// 		const map = new Map<string, { volume: number; weight: number; name: string }>();
// 		for (const p of allProducts) {
// 			map.set(p.product_ID, {
// 				volume: parseFloat(p.volume || "0"),
// 				weight: parseFloat(p.weight || "0"),
// 				name: p.product_name
// 			});
// 		}
// 		return map;
// 	}, [allProducts]);

// 	const stopColors = [
// 		"#4287f5", "#42f57b", "#f5d142", "#f5427b",
// 		"#9f42f5", "#f58b42", "#42f5e6", "#a1f542"
// 	];

// 	// Parameters for wheels
// 	const wheelRadius = 0.25;
// 	const wheelWidth = 0.15;
// 	const axleInset = 0.15;      // distance from side of truck
// 	const wheelClearance = 0.05; // space between bottom of container and top of wheel

// 	const products: ProductBox[] = useMemo(() => {
// 		if (!truck?.loadArrangement) return [];

// 		const placedProducts: ProductBox[] = [];
// 		const stopOrder = [...truck.loadArrangement].reverse();

// 		const cabinLength = 1.3;
// 		const usableLength = truckInterior.length - cabinLength;

// 		let cursorX = 0;
// 		let cursorY = 0;
// 		let cursorZ = 0;
// 		let maxRowHeight = 0;

// 		const totalVolume = truckInterior.length * truckInterior.width * truckInterior.height;
// 		let filledVolume = 0;

// 		const moveToNextRow = () => {
// 			cursorZ = 0;
// 			cursorX += maxRowHeight;
// 			maxRowHeight = 0;
// 		};

// 		const moveToNextLayer = () => {
// 			cursorX = 0;
// 			cursorZ = 0;
// 			cursorY += 0.2;
// 			maxRowHeight = 0;
// 		};

// 		for (let stopIndex = 0; stopIndex < stopOrder.length; stopIndex++) {
// 			const stop = stopOrder[stopIndex];
// 			const color = stopColors[stopIndex % stopColors.length];

// 			for (const packId of stop.packages) {
// 				const pkg = selectedPackages.find((p) => p.pack_ID === packId);
// 				if (!pkg || !pkg.product_ID) continue;

// 				for (const prod of pkg.product_ID) {
// 					const prodData = productMap.get(prod.prod_ID);
// 					if (!prodData) continue;

// 					const quantity = prod.quantity || 1;
// 					const volumePerUnit = prodData.volume;

// 					for (let i = 0; i < quantity; i++) {
// 						const edge = Math.cbrt(volumePerUnit);
// 						const dims: [number, number, number] = [edge, edge, edge];

// 						if (cursorZ + dims[2] > truckInterior.width) moveToNextRow();
// 						if (cursorX + dims[0] > usableLength) moveToNextLayer();
// 						if (cursorY + dims[1] > truckInterior.height) continue;

// 						const posX = cabinLength + cursorX + dims[0] / 2;
// 						const posY = wheelRadius + wheelClearance + cursorY + dims[1] / 2;
// 						const posZ = cursorZ + dims[2] / 2;

// 						placedProducts.push({
// 							position: [posX, posY, posZ],
// 							dimensions: dims,
// 							color,
// 							label: prodData.name,
// 							stop: stop.stop
// 						});

// 						cursorZ += dims[2];
// 						maxRowHeight = Math.max(maxRowHeight, dims[0]);
// 						filledVolume += dims[0] * dims[1] * dims[2];
// 					}
// 				}
// 			}
// 		}

// 		const fillPct = ((filledVolume / totalVolume) * 100).toFixed(2);
// 		(window as any).truckFillPercentage = fillPct;

// 		setStats({
// 			totalVolume,
// 			filledVolume,
// 			leftoverVolume: totalVolume - filledVolume,
// 			fillPercentage: parseFloat(fillPct),
// 			productCount: placedProducts.length,
// 			productQuantity: placedProducts.length,
// 			packageCount: selectedPackages.length
// 		});

// 		return placedProducts;
// 	}, [truck, selectedPackages, truckInterior, productMap, wheelRadius, wheelClearance]);

// 	const fillPercentage = (window as any).truckFillPercentage;


// 	// Corrected axle X positions
// 	const cabinLength = 1.3;
// 	const frontAxleX = cabinLength + 1.0;
// 	const middleAxleX = cabinLength + (truckInterior.length - cabinLength) * 0.5;
// 	const rearAxleX = cabinLength + (truckInterior.length - cabinLength) - 1.0;

// 	const wheelY = wheelRadius;

// 	const leftZ = axleInset;
// 	const rightZ = truckInterior.width - axleInset;

// 	const wheelPositions = [
// 		[frontAxleX, wheelY, leftZ],
// 		[frontAxleX, wheelY, rightZ],
// 		[middleAxleX, wheelY, leftZ],
// 		[middleAxleX, wheelY, rightZ],
// 		[rearAxleX, wheelY, leftZ],
// 		[rearAxleX, wheelY, rightZ]
// 	];

// 	// In JSX



// 	return (
// 		<>
// 			<Backdrop
// 				sx={{ color: "#ffffff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
// 				open={vehicleLoading}
// 			>
// 				<CircularProgress color="inherit" />
// 			</Backdrop>

// 			<Canvas camera={{ position: [5, 5, 10], fov: 50 }}>
// 				<ambientLight intensity={0.4} />
// 				<directionalLight position={[10, 10, 5]} intensity={1} />
// 				<hemisphereLight intensity={0.3} />
// 				<OrbitControls enableZoom={false} />
// 				<Environment preset="warehouse" />

// 				<Stage adjustCamera={false} intensity={0.6}>
// 					{/* Truck container */}
// 					<mesh
// 						position={[
// 							1.3 + truckInterior.length / 2,
// 							wheelRadius + wheelClearance + truckInterior.height / 2,
// 							truckInterior.width / 2
// 						]}
// 					>
// 						<boxGeometry args={[truckInterior.length, truckInterior.height, truckInterior.width]} />
// 						<meshStandardMaterial color="silver" metalness={0.7} roughness={0.2} transparent opacity={0.15} />
// 					</mesh>

// 					{/* Cabin */}
// 					<mesh
// 						position={[
// 							0.65,
// 							wheelRadius + wheelClearance + truckInterior.height * 0.4,
// 							truckInterior.width / 2
// 						]}
// 					>
// 						<boxGeometry args={[1.0, truckInterior.height * 0.8, truckInterior.width * 0.85]} />
// 						<meshStandardMaterial color="orange" metalness={0.5} roughness={0.6} opacity={0.85} transparent />
// 					</mesh>

// 					{/* Wheels */}

// 					{
// 						wheelPositions.map((pos, i) => (
// 							<mesh key={i} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
// 								<cylinderGeometry args={[wheelRadius, wheelRadius, wheelWidth, 32]} />
// 								<meshStandardMaterial color="black" />
// 							</mesh>
// 						))
// 					}

// 					{/* Products */}
// 					{products.map((prod, index) => (
// 						<mesh key={index} position={prod.position}>
// 							<boxGeometry args={prod.dimensions} />
// 							<meshStandardMaterial color={prod.color} metalness={0.2} roughness={0.8} />
// 							<Edges color="black" />
// 						</mesh>
// 					))}
// 				</Stage>
// 			</Canvas>

// 			{/* UI Overlays */}
// 			<div
// 				style={{
// 					position: "absolute",
// 					top: 10,
// 					left: 10,
// 					background: "white",
// 					padding: "6px 10px",
// 					borderRadius: 8
// 				}}
// 			>
// 				Truck Fill: <strong>{fillPercentage}%</strong>
// 			</div>

// 			<div
// 				style={{
// 					position: "absolute",
// 					top: 60,
// 					left: 10,
// 					background: "white",
// 					padding: "10px",
// 					borderRadius: 8,
// 					fontSize: "0.85rem",
// 					maxWidth: 300,
// 					boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
// 				}}
// 			>
// 				<h4>Truck Info</h4>
// 				<div><strong>Dimensions:</strong> {truckInterior.length.toFixed(2)}m × {truckInterior.width.toFixed(2)}m × {truckInterior.height.toFixed(2)}m</div>
// 				<div><strong>Total Volume:</strong> {stats.totalVolume.toFixed(2)} m³</div>
// 				<div><strong>Filled Volume:</strong> {stats.filledVolume.toFixed(2)} m³</div>
// 				<div><strong>Leftover Volume:</strong> {stats.leftoverVolume.toFixed(2)} m³</div>
// 				<div><strong>Fill %:</strong> {stats.fillPercentage}%</div>
// 				<div><strong>Packages:</strong> {stats.packageCount}</div>
// 				<div><strong>Total Products:</strong> {stats.productCount}</div>
// 				<hr />
// 				<div><strong>Stops Legend:</strong>
// 					<ul style={{ paddingLeft: 18 }}>
// 						{truck?.loadArrangement?.map((stop, idx) => (
// 							<li key={stop.stop} style={{ color: stopColors[idx % stopColors.length] }}>
// 								Stop {stop.stop}: {stop.location}
// 							</li>
// 						))}
// 					</ul>
// 				</div>
// 			</div>
// 		</>
// 	);
// };

// export default TruckScene;



import React, { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Edges, Stage, Environment } from "@react-three/drei";
import {
	useGetVehicleByIdQuery,
	useGetAllProductsQuery,
	useGetPackageMasterQuery
} from "@/api/apiSlice";
import { Package } from "./PackagesTable";
import { Backdrop, CircularProgress } from "@mui/material";
import { Truck } from "./TrucksTable";

interface Truck3DProps {
	truckData: Truck[];
	selectedPackages: Package[];
}

interface ProductBox {
	position: [number, number, number];
	dimensions: [number, number, number];
	color: string;
	label: string;
	stop: number;
}

const parseMeters = (value: string): number =>
	parseFloat(value?.replace("m", "").trim() || "0");

const TruckScene: React.FC<Truck3DProps> = ({ truckData, selectedPackages }) => {
	const [stats, setStats] = useState({
		totalVolume: 0,
		filledVolume: 0,
		leftoverVolume: 0,
		fillPercentage: 0,
		productCount: 0,
		productQuantity: 0,
		packageCount: 0
	});

	const vehicle_ID = truckData[0]?.vehicle_ID;
	const { data: vehicleById, isLoading: vehicleLoading } = useGetVehicleByIdQuery({ vehicle_ID });
	const { data: productsData } = useGetAllProductsQuery({});
	const { data: allPackageInfo } = useGetPackageMasterQuery({});

	const allPackages = allPackageInfo?.packages || [];
	const allProducts = productsData?.products || [];
	const truck = truckData[0];
	const vehicle = vehicleById?.vehicle;

	const [truckInterior, setTruckInterior] = useState({
		width: 1,
		height: 1,
		length: 2
	});

	useEffect(() => {
		if (vehicle) {
			const capacity = vehicle?.capacity;
			// setTruckInterior({
			// 	width: parseMeters(capacity?.interior_width) * 0.85,
			// 	height: parseMeters(capacity?.interior_height),
			// 	length: parseMeters(capacity?.interior_length) * 0.9
			// });
			setTruckInterior({
				width: parseMeters(capacity?.interior_width) * 0.75,
				height: parseMeters(capacity?.interior_height) * 0.85,
				length: parseMeters(capacity?.interior_length) * 0.9
			});

		}
	}, [vehicle]);

	const productMap = useMemo(() => {
		const map = new Map<string, { volume: number; weight: number; name: string }>();
		for (const p of allProducts) {
			map.set(p.product_ID, {
				volume: parseFloat(p.volume || "0"),
				weight: parseFloat(p.weight || "0"),
				name: p.product_name
			});
		}
		return map;
	}, [allProducts]);

	const stopColors = [
		"#4287f5", "#42f57b", "#f5d142", "#f5427b",
		"#9f42f5", "#f58b42", "#42f5e6", "#a1f542"
	];

	// Updated wheel size
	const wheelRadius = 0.4;
	const wheelWidth = 0.25;
	const axleInset = 0.15;
	const wheelClearance = 0.05;

	const products: ProductBox[] = useMemo(() => {
		if (!truck?.loadArrangement) return [];

		const placedProducts: ProductBox[] = [];
		const stopOrder = [...truck.loadArrangement].reverse();

		const cabinLength = 1.3;
		const usableLength = truckInterior.length - cabinLength;

		let cursorX = 0;
		let cursorY = 0;
		let cursorZ = 0;
		let maxRowHeight = 0;

		const totalVolume = truckInterior.length * truckInterior.width * truckInterior.height;
		let filledVolume = 0;

		const floorLevel = wheelRadius + wheelClearance;

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
			const stop = stopOrder[stopIndex];
			const color = stopColors[stopIndex % stopColors.length];

			for (const packId of stop.packages) {
				const pkg = selectedPackages.find((p) => p.pack_ID === packId);
				if (!pkg || !pkg.product_ID) continue;

				for (const prod of pkg.product_ID) {
					const prodData = productMap.get(prod.prod_ID);
					if (!prodData) continue;

					const quantity = prod.quantity || 1;
					const volumePerUnit = prodData.volume;

					for (let i = 0; i < quantity; i++) {
						const edge = Math.cbrt(volumePerUnit);
						const dims: [number, number, number] = [edge, edge, edge];

						if (cursorZ + dims[2] > truckInterior.width) moveToNextRow();
						if (cursorX + dims[0] > usableLength) moveToNextLayer();
						if (cursorY + dims[1] > truckInterior.height) continue;

						const posX = cabinLength + cursorX + dims[0] / 2;
						const posY = floorLevel + cursorY + dims[1] / 2;
						const posZ = cursorZ + dims[2] / 2;

						// Ensure products never go below the wheel floor
						if (posY - dims[1] / 2 < floorLevel) continue;

						placedProducts.push({
							position: [posX, posY, posZ],
							dimensions: dims,
							color,
							label: prodData.name,
							stop: stop.stop
						});

						cursorZ += dims[2];
						maxRowHeight = Math.max(maxRowHeight, dims[0]);
						filledVolume += dims[0] * dims[1] * dims[2];
					}
				}
			}
		}

		const fillPct = ((filledVolume / totalVolume) * 100).toFixed(2);
		(window as any).truckFillPercentage = fillPct;

		setStats({
			totalVolume,
			filledVolume,
			leftoverVolume: totalVolume - filledVolume,
			fillPercentage: parseFloat(fillPct),
			productCount: placedProducts.length,
			productQuantity: placedProducts.length,
			packageCount: selectedPackages.length
		});

		return placedProducts;
	}, [truck, selectedPackages, truckInterior, productMap, wheelRadius, wheelClearance]);

	const fillPercentage = (window as any).truckFillPercentage;

	// Truck wheel layout
	const cabinLength = 1.3;
	const frontAxleX = cabinLength * 0.5; // under the driver cabin itself
	const midAxleX = cabinLength + (truckInterior.length - cabinLength) * 0.4;
	const rearAxleX = cabinLength + (truckInterior.length - cabinLength) - 0.8;

	const wheelY = wheelRadius;
	const leftZ = axleInset;
	const rightZ = truckInterior.width - axleInset;

	const wheelPositions = [
		// Under driver cabin
		[frontAxleX, wheelY, leftZ],
		[frontAxleX, wheelY, rightZ],

		// Mid and rear axles
		[midAxleX, wheelY, leftZ],
		[midAxleX, wheelY, rightZ],
		[rearAxleX, wheelY, leftZ],
		[rearAxleX, wheelY, rightZ]
	];

	return (
		<>
			<Backdrop
				sx={{ color: "#ffffff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
				open={vehicleLoading}
			>
				<CircularProgress color="inherit" />
			</Backdrop>

			<Canvas camera={{ position: [5, 5, 10], fov: 50 }}>
				<ambientLight intensity={0.4} />
				<directionalLight position={[10, 10, 5]} intensity={1} />
				<hemisphereLight intensity={0.3} />
				<OrbitControls enableZoom={false} />
				<Environment preset="warehouse" />

				<Stage adjustCamera={false} intensity={0.6}>
					{/* Truck container */}
					<mesh
						position={[
							1.3 + truckInterior.length / 2,
							wheelRadius + wheelClearance + truckInterior.height / 2,
							truckInterior.width / 2
						]}
					>
						<boxGeometry args={[truckInterior.length, truckInterior.height, truckInterior.width]} />
						<meshStandardMaterial color="silver" metalness={0.7} roughness={0.2} transparent opacity={0.15} />
					</mesh>

					{/* Cabin */}
					<mesh
						position={[
							0.65,
							wheelRadius + wheelClearance + truckInterior.height * 0.4,
							truckInterior.width / 2
						]}
					>
						<boxGeometry args={[1.0, truckInterior.height * 0.8, truckInterior.width * 0.85]} />
						<meshStandardMaterial color="orange" metalness={0.5} roughness={0.6} opacity={0.85} transparent />
					</mesh>

					{/* Wheels */}
					{wheelPositions.map((pos, i) => (
						<mesh key={i} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
							<cylinderGeometry args={[wheelRadius, wheelRadius, wheelWidth, 32]} />
							<meshStandardMaterial color="black" />
						</mesh>
					))}

					{/* Products */}
					{products.map((prod, index) => (
						<mesh key={index} position={prod.position}>
							<boxGeometry args={prod.dimensions} />
							<meshStandardMaterial color={prod.color} metalness={0.2} roughness={0.8} />
							<Edges color="black" />
						</mesh>
					))}
				</Stage>
			</Canvas>

			{/* UI Overlays */}
			<div
				style={{
					position: "absolute",
					top: 10,
					left: 10,
					background: "white",
					padding: "6px 10px",
					borderRadius: 8
				}}
			>
				Truck Fill: <strong>{fillPercentage}%</strong>
			</div>

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
					boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
				}}
			>
				<h4>Truck Info</h4>
				<div><strong>Dimensions:</strong> {truckInterior.length.toFixed(2)}m × {truckInterior.width.toFixed(2)}m × {truckInterior.height.toFixed(2)}m</div>
				<div><strong>Total Volume:</strong> {stats.totalVolume.toFixed(2)} m³</div>
				<div><strong>Filled Volume:</strong> {stats.filledVolume.toFixed(2)} m³</div>
				<div><strong>Leftover Volume:</strong> {stats.leftoverVolume.toFixed(2)} m³</div>
				<div><strong>Fill %:</strong> {stats.fillPercentage}%</div>
				<div><strong>Packages:</strong> {stats.packageCount}</div>
				<div><strong>Total Products:</strong> {stats.productCount}</div>
				<hr />
				<div><strong>Stops Legend:</strong>
					<ul style={{ paddingLeft: 18 }}>
						{truck?.loadArrangement?.map((stop, idx) => (
							<li key={stop.stop} style={{ color: stopColors[idx % stopColors.length] }}>
								Stop {stop.stop}: {stop.location}
							</li>
						))}
					</ul>
				</div>
			</div>
		</>
	);
};

export default TruckScene;
