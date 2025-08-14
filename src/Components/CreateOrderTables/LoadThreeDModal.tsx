// 'use client';

// import React from 'react';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';

// interface PackageBlock {
// 	pkg_ID: string;
// 	color: string;
// 	dimensions: [number, number, number];
// 	position: [number, number, number]; // starting position (ignored for quantity placement)
// 	quantity: number;
// }

// interface TruckSceneProps {
// 	vehicleDimensions: {
// 		length: number;
// 		width: number;
// 		height: number;
// 	};
// 	packageBlocks: PackageBlock[];
// 	boxPlacements?: Record<
// 		string,
// 		{
// 			boxes: {
// 				position: [number, number, number];
// 				dimensions: [number, number, number];
// 			}[];
// 		}
// 	>;
// 	truckCapacity?: {   // ✅ Added here
// 		allowedLayers: number;
// 		maxLayers: number;
// 		maxM3: number;
// 		oneLayerM3: number;
// 		rawM3: number;
// 		usableM3: number;
// 	};
// }

// const TruckScene: React.FC<TruckSceneProps> = ({ vehicleDimensions, packageBlocks }) => {
// 	const { length, width, height } = vehicleDimensions;
// 	const cabinLength = 1.2;
// 	const cabinHeight = height * 0.6;
// 	const wheelRadius = 0.5;
// 	const wheelThickness = 0.3;
// 	const wheelY = wheelRadius;
// 	const steelPlateY = wheelY + 0.5;
// 	const cabinX = cabinLength / 2;
// 	const cameraDistance = Math.max(length, width, height) * 1.5;

// 	// Generate multiple instances based on quantity
// 	const generatePackageInstances = (): {
// 		position: [number, number, number];
// 		dimensions: [number, number, number];
// 		color: string;
// 		pkg_ID: string;
// 	}[] => {
// 		const spacing = 0.05;
// 		const allBlocks: {
// 			position: [number, number, number];
// 			dimensions: [number, number, number];
// 			color: string;
// 			pkg_ID: string;
// 		}[] = [];

// 		let currentX = 0;
// 		let currentZ = 0;
// 		let currentY = 0;

// 		const maxWidth = length;
// 		const maxDepth = width;
// 		const maxHeight = height;

// 		for (const block of packageBlocks) {
// 			const [dx, dy, dz] = block.dimensions;
// 			const total = block.quantity || 1;

// 			for (let i = 0; i < total; i++) {
// 				if (currentX + dx > maxWidth) {
// 					currentX = 0;
// 					currentZ += dz + spacing;
// 				}
// 				if (currentZ + dz > maxDepth) {
// 					currentZ = 0;
// 					currentY += dy + spacing;
// 				}
// 				if (currentY + dy > maxHeight) break;

// 				allBlocks.push({
// 					position: [currentX, currentY, currentZ],
// 					dimensions: [dx, dy, dz],
// 					color: block.color,
// 					pkg_ID: block.pkg_ID,
// 				});

// 				currentX += dx + spacing;
// 			}
// 		}

// 		return allBlocks;
// 	};

// 	const calculateWheelPositions = () => {
// 		const numberOfAxles = length <= 5 ? 2 : length <= 8 ? 3 : 4;
// 		const insetZ = 0.3;
// 		const leftZ = insetZ;
// 		const rightZ = width - insetZ;
// 		const wheelPositions: [number, number, number][] = [];

// 		// Front axle under cabin
// 		wheelPositions.push([cabinX, wheelY, leftZ]);
// 		wheelPositions.push([cabinX, wheelY, rightZ]);

// 		// Rear axles (start from ~25% into cargo)
// 		const axleStart = cabinLength + length * 0.25;
// 		const axleEnd = cabinLength + length - 0.8;
// 		const axleSpacing = (axleEnd - axleStart) / (numberOfAxles - 1);

// 		for (let i = 0; i < numberOfAxles; i++) {
// 			const axleX = axleStart + i * axleSpacing;
// 			wheelPositions.push([axleX, wheelY, leftZ]);
// 			wheelPositions.push([axleX, wheelY, rightZ]);
// 		}

// 		return wheelPositions;
// 	};

// 	const wheelPositions = calculateWheelPositions();
// 	const packageInstances = generatePackageInstances();

// 	return (
// 		<div style={{ display: 'flex', gap: '2rem' }}>
// 			{/* Truck 3D View */}
// 			<div style={{ flex: 2 }}>
// 				<Canvas
// 					camera={{
// 						position: [cameraDistance, cameraDistance * 0.6, cameraDistance],
// 						fov: 45,
// 					}}
// 					style={{ height: 600, width: '100%' }}
// 				>
// 					<ambientLight intensity={0.8} />
// 					<directionalLight position={[10, 10, 5]} intensity={1.2} />
// 					<OrbitControls enableZoom={false} enableRotate enablePan={false} />

// 					{/* Driver Cabin */}
// 					<mesh position={[cabinX, wheelY + cabinHeight / 2 + 0.5, width / 2]}>
// 						<boxGeometry args={[cabinLength, cabinHeight, width]} />
// 						<meshStandardMaterial color="#b87333" />
// 					</mesh>

// 					{/* Cargo area */}
// 					<mesh position={[cabinLength + length / 2, steelPlateY + (height - steelPlateY) / 2, width / 2]}>
// 						<boxGeometry args={[length, height - steelPlateY, width]} />
// 						<meshStandardMaterial color="white" transparent opacity={0.4} />
// 					</mesh>

// 					{/* Steel floor */}
// 					<mesh position={[cabinLength + length / 2, steelPlateY, width / 2]}>
// 						<boxGeometry args={[length, 0.05, width]} />
// 						<meshStandardMaterial color="#222" metalness={1} roughness={0.3} />
// 					</mesh>

// 					{/* Wheels */}
// 					{wheelPositions.map((pos, idx) => (
// 						<mesh key={idx} position={pos} rotation={[Math.PI / 2, 0, 0]}>
// 							<cylinderGeometry args={[wheelRadius, wheelRadius, wheelThickness, 32]} />
// 							<meshStandardMaterial color="black" />
// 						</mesh>
// 					))}

// 					{/* Package Instances */}
// 					{packageInstances.map((block, index) => (
// 						<mesh
// 	key={index}
// 	position={[
// 		cabinLength + block.position[0] + block.dimensions[0] / 2,
// 		steelPlateY + block.position[1] + block.dimensions[1] / 2,
// 		block.position[2] + block.dimensions[2] / 2,
// 	]}

// >
// 							<boxGeometry args={block.dimensions} />
// 							<meshStandardMaterial color={block.color} />
// 						</mesh>
// 					))}
// 				</Canvas>
// 			</div>

// 			{/* Legend and Details */}
// 			<div style={{ flex: 1 }}>
// 				<h3>Truck Details</h3>
// 				<ul style={{ lineHeight: '1.6' }}>
// 					<li><strong>Length:</strong> {length} m</li>
// 					<li><strong>Width:</strong> {width} m</li>
// 					<li><strong>Height:</strong> {height} m</li>
// 				</ul>

// 				{/* Highlighted Truck Capacity */}
// 				<div
// 					style={{
// 						backgroundColor: '#e0f7fa',
// 						padding: '12px 16px',
// 						marginTop: '1.5rem',
// 						borderLeft: '5px solid #00796b',
// 						borderRadius: 4,
// 						boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
// 					}}
// 				>
// 					<h4 style={{ margin: 0, color: '#00796b' }}>Truck Capacity</h4>
// 					<p style={{ margin: '4px 0 0 0', fontWeight: 'bold' }}>
// 						{(length * width * height).toFixed(2)} m³
// 					</p>
// 				</div>

// 				{/* Package Color Legend */}
// 				{/* Package Color Legend */}
// 				<h3 style={{ marginTop: '1.5rem' }}>Package Color Legend</h3>
// 				<ul style={{ paddingLeft: 0, listStyle: 'none' }}>
// 					{Array.from(
// 						new Map(packageBlocks.map(block => [block.pkg_ID, block])).values()
// 					).map((block, idx) => (
// 						<li
// 							key={idx}
// 							style={{
// 								display: 'flex',
// 								alignItems: 'center',
// 								marginBottom: '0.5rem',
// 								borderBottom: '1px solid #ddd',
// 								paddingBottom: 4,
// 							}}
// 						>
// 							<div
// 								style={{
// 									width: 16,
// 									height: 16,
// 									backgroundColor: block.color,
// 									marginRight: 8,
// 									border: '1px solid #000',
// 								}}
// 							/>
// 							<span>{block.pkg_ID}</span>
// 						</li>
// 					))}
// 				</ul>

// 			</div>
// 		</div>
// 	);
// };

// export default TruckScene;



'use client';
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

interface PackageBlock {
	pkg_ID: string;
	color: string;
	dimensions: [number, number, number];
	position: [number, number, number];
	quantity: number;
}

interface TruckSceneProps {
	vehicleDimensions: {
		length: number;
		width: number;
		height: number;
	};
	packageBlocks: PackageBlock[];
	truckCapacity?: {
		allowedLayers: number;
		maxLayers: number;
		maxM3: number;
		oneLayerM3: number;
		rawM3: number;
		usableM3: number;
	};
}

const TruckScene: React.FC<TruckSceneProps> = ({ vehicleDimensions, packageBlocks }) => {
	const { length, width, height } = vehicleDimensions;
	const cabinLength = 1.2;
	const cabinHeight = height * 0.6;
	const wheelRadius = 0.5;
	const wheelY = wheelRadius;
	const steelPlateY = wheelY + 0.5;
	const cabinX = cabinLength / 2;
	const cameraDistance = Math.max(length, width, height) * 1.5;

	const calculateWheelPositions = () => {
		const numberOfAxles = length <= 5 ? 2 : length <= 8 ? 3 : 4;
		const insetZ = 0.3;
		const leftZ = insetZ;
		const rightZ = width - insetZ;
		const wheelPositions: [number, number, number][] = [];

		wheelPositions.push([cabinX, wheelY, leftZ]);
		wheelPositions.push([cabinX, wheelY, rightZ]);

		const axleStart = cabinLength + length * 0.25;
		const axleEnd = cabinLength + length - 0.8;
		const axleSpacing = (axleEnd - axleStart) / (numberOfAxles - 1);

		for (let i = 0; i < numberOfAxles; i++) {
			const axleX = axleStart + i * axleSpacing;
			wheelPositions.push([axleX, wheelY, leftZ]);
			wheelPositions.push([axleX, wheelY, rightZ]);
		}

		return wheelPositions;
	};

	const wheelPositions = calculateWheelPositions();

	return (
		<div style={{ display: 'flex', gap: '2rem' }}>
			<div style={{ flex: 2 }}>
				<Canvas
					camera={{
						position: [cameraDistance, cameraDistance * 0.6, cameraDistance],
						fov: 45,
					}}
					style={{ height: 600, width: '100%' }}
				>
					<ambientLight intensity={0.8} />
					<directionalLight position={[10, 10, 5]} intensity={1.2} />
					<OrbitControls enableZoom={false} enableRotate enablePan={false} />

					{/* Cabin */}
					<mesh position={[cabinX, wheelY + cabinHeight / 2 + 0.5, width / 2]}>
						<boxGeometry args={[cabinLength, cabinHeight, width]} />
						<meshStandardMaterial color="#b87333" />
					</mesh>

					{/* Transparent Cargo Area */}
					{/* <mesh position={[cabinLength + length / 2, steelPlateY + (height - steelPlateY) / 2, width / 2]}>
						<boxGeometry args={[length, height - steelPlateY, width]} />
						<meshStandardMaterial color="white" transparent opacity={0.4} />
					</mesh> */}

					<mesh position={[
						cabinLength + length / 2,
						steelPlateY + (height - steelPlateY) / 2,
						width / 2
					]}>
						<boxGeometry args={[length, height - steelPlateY, width]} />
						<meshStandardMaterial color="white" transparent opacity={0.4} />
					</mesh>

					{/* Steel Floor */}
					<mesh position={[cabinLength + length / 2, steelPlateY, width / 2]}>
						<boxGeometry args={[length, 0.05, width]} />
						<meshStandardMaterial color="#222" metalness={1} roughness={0.3} />
					</mesh>

					{/* Wheels */}
					{wheelPositions.map((pos, idx) => (
						<mesh key={idx} position={pos} rotation={[Math.PI / 2, 0, 0]}>
							<cylinderGeometry args={[wheelRadius, wheelRadius, 0.3, 32]} />
							<meshStandardMaterial color="black" />
						</mesh>
					))}

					{/* Correct Box Placements from Backend */}
					{/* {packageBlocks.map((block, index) => (
						<mesh
							key={index}
							position={[
								cabinLength + block.position[0] + block.dimensions[0] / 2,
								steelPlateY + block.position[1] + block.dimensions[1] / 2,
								block.position[2] + block.dimensions[2] / 2,
							]}
						>

							<boxGeometry args={block.dimensions} />
							<meshStandardMaterial color={block.color} />
						</mesh>
					))} */}


					{packageBlocks.map((block, index) => (
						<mesh
							key={index}
							position={[
								// X: start at cabinLength, then move by block.position
								cabinLength + block.position[0] + block.dimensions[2] / 2,
								// Y: start directly above steel plate
								steelPlateY + block.position[1] + block.dimensions[2] / 2,
								// Z: no change (width direction)
								block.position[2] + block.dimensions[2] / 2,
							]}
						>
							<boxGeometry args={block.dimensions} />
							<meshStandardMaterial color={block.color} />
						</mesh>
					))}


				</Canvas>
			</div>

			{/* Truck Info and Color Legend */}
			<div style={{ flex: 1 }}>
				<h3>Truck Details</h3>
				<ul style={{ lineHeight: '1.6' }}>
					<li><strong>Length:</strong> {length} m</li>
					<li><strong>Width:</strong> {width} m</li>
					<li><strong>Height:</strong> {height} m</li>
				</ul>

				<div style={{ backgroundColor: '#e0f7fa', padding: 12, borderLeft: '5px solid #00796b', borderRadius: 4 }}>
					<h4 style={{ margin: 0, color: '#00796b' }}>Truck Capacity</h4>
					<p style={{ margin: 0, fontWeight: 'bold' }}>{(length * width * height).toFixed(2)} m³</p>
				</div>

				<h3 style={{ marginTop: '1.5rem' }}>Package Color Legend</h3>
				<ul style={{ paddingLeft: 0, listStyle: 'none' }}>
					{Array.from(
						new Map(packageBlocks.map(block => [block.pkg_ID, block])).values()
					).map((block, idx) => (
						<li
							key={idx}
							style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}
						>
							<div
								style={{ width: 16, height: 16, backgroundColor: block.color, marginRight: 8, border: '1px solid #000' }}
							/>
							<span>{block.pkg_ID}</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default TruckScene;
