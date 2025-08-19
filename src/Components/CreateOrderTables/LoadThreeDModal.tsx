// 'use client';
// import React from 'react';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';

// interface PackageBlock {
// 	pkg_ID: string;
// 	color: string;
// 	dimensions: [number, number, number];
// 	position: [number, number, number];
// 	quantity: number;
// }

// interface TruckSceneProps {
// 	vehicleDimensions: {
// 		length: number;
// 		width: number;
// 		height: number;
// 	};
// 	packageBlocks: PackageBlock[];
// 	truckCapacity?: {
// 		allowedLayers: number;
// 		maxLayers: number;
// 		maxM3: number;
// 		oneLayerM3: number;
// 		rawM3: number;
// 		usableM3: number;
// 	};
// }

// const TruckScene: React.FC<TruckSceneProps> = ({ vehicleDimensions, packageBlocks }) => {
// 	console.log('packageBlocks:', packageBlocks)
// 	const { length, width, height } = vehicleDimensions;
// 	const cabinLength = 1.2;
// 	const cabinHeight = height * 0.6;
// 	const wheelRadius = 0.5;
// 	const wheelY = wheelRadius;
// 	const steelPlateY = wheelY + 0.5;
// 	const cabinX = cabinLength / 2;
// 	const cameraDistance = Math.max(length, width, height) * 1.5;

// 	const calculateWheelPositions = () => {
// 		const numberOfAxles = length <= 5 ? 2 : length <= 8 ? 3 : 4;
// 		const insetZ = 0.3;
// 		const leftZ = insetZ;
// 		const rightZ = width - insetZ;
// 		const wheelPositions: [number, number, number][] = [];

// 		wheelPositions.push([cabinX, wheelY, leftZ]);
// 		wheelPositions.push([cabinX, wheelY, rightZ]);

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

// 	return (
// 		<div style={{ display: 'flex', gap: '2rem' }}>
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

// 					{/* Cabin */}
// 					<mesh position={[cabinX, wheelY + cabinHeight / 2 + 0.5, width / 2]}>
// 						<boxGeometry args={[cabinLength, cabinHeight, width]} />
// 						<meshStandardMaterial color="#b87333" />
// 					</mesh>

// 					{/* Transparent Cargo Area */}
// 					<mesh position={[
// 						cabinLength + length / 2,
// 						steelPlateY + (height - steelPlateY) / 2,
// 						width / 2
// 					]}>
// 						<boxGeometry args={[length, height - steelPlateY, width]} />
// 						<meshStandardMaterial color="white" transparent opacity={0.4} />
// 					</mesh>

// 					{/* Steel Floor */}
// 					<mesh position={[cabinLength + length / 2, steelPlateY, width / 2]}>
// 						<boxGeometry args={[length, 0.05, width]} />
// 						<meshStandardMaterial color="#222" metalness={1} roughness={0.3} />
// 					</mesh>

// 					{/* Wheels */}
// 					{wheelPositions.map((pos, idx) => (
// 						<mesh key={idx} position={pos} rotation={[Math.PI / 2, 0, 0]}>
// 							<cylinderGeometry args={[wheelRadius, wheelRadius, 0.3, 32]} />
// 							<meshStandardMaterial color="black" />
// 						</mesh>
// 					))}

// 					{/* Correct Box Placements from Backend */}

// 					{packageBlocks.map((block, index) => (
// 						<mesh
// 							key={index}
// 							position={[
// 								cabinLength + block.position[0] + block.dimensions[0] / 2, // X = length
// 								steelPlateY + block.position[1] + block.dimensions[1] / 2, // Y = height
// 								block.position[2] + block.dimensions[2] / 2                // Z = width
// 							]}

// 						>
// 							<boxGeometry args={block.dimensions} />
// 							<meshStandardMaterial color={block.color} />
// 						</mesh>
// 					))}


// 				</Canvas>
// 			</div>

// 			{/* Truck Info and Color Legend */}
// 			<div style={{ flex: 1 }}>
// 				<h3>Truck Details</h3>
// 				<ul style={{ lineHeight: '1.6' }}>
// 					<li><strong>Length:</strong> {length} m</li>
// 					<li><strong>Width:</strong> {width} m</li>
// 					<li><strong>Height:</strong> {height} m</li>
// 				</ul>

// 				<div style={{ backgroundColor: '#e0f7fa', padding: 12, borderLeft: '5px solid #00796b', borderRadius: 4 }}>
// 					<h4 style={{ margin: 0, color: '#00796b' }}>Truck Capacity</h4>
// 					<p style={{ margin: 0, fontWeight: 'bold' }}>{(length * width * height).toFixed(2)} m³</p>
// 				</div>

// 				<h3 style={{ marginTop: '1.5rem' }}>Package Color Legend</h3>
// 				<ul style={{ paddingLeft: 0, listStyle: 'none' }}>
// 					{Array.from(
// 						new Map(packageBlocks.map(block => [block.pkg_ID, block])).values()
// 					).map((block, idx) => (
// 						<li
// 							key={idx}
// 							style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}
// 						>
// 							<div
// 								style={{ width: 16, height: 16, backgroundColor: block.color, marginRight: 8, border: '1px solid #000' }}
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
	dimensions: [number, number, number]; // [L, H, W]
	position: [number, number, number];   // [x, y, z] origin at back-left floor
	quantity: number;
}

interface TruckSceneProps {
	vehicleDimensions: {
		length: number; // interior cargo length (m)
		width: number;  // interior cargo width (m)
		height: number; // interior interior height (m)
	};
	packageBlocks: PackageBlock[];
	truckCapacity?: {
		allowedLayers: number; // <=1 => no stacking
		maxLayers: number;
		maxM3?: number;
		oneLayerM3: number;
		rawM3: number;
		usableM3: number;
	};
}

const TruckScene: React.FC<TruckSceneProps> = ({
	vehicleDimensions,
	packageBlocks,
	truckCapacity,
}) => {
	const { length, width, height } = vehicleDimensions;

	// Simple truck proportions for render
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

	// ***** KEY FIX: if allowedLayers <= 1, clamp Y to ground *****
	const singleLayer = (truckCapacity?.allowedLayers ?? 1) <= 1;

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
					{/* Allow zoom so users can verify it's a single flat layer */}
					<OrbitControls enableZoom enableRotate enablePan={false} />

					{/* Optional helpers (uncomment when debugging) */}
					{/* <axesHelper args={[2]} /> */}
					{/* <gridHelper
            args={[Math.max(length, width), 20]}
            position={[cabinLength + length / 2, steelPlateY, width / 2]}
          /> */}

					{/* Cabin */}
					<mesh position={[cabinX, wheelY + cabinHeight / 2 + 0.5, width / 2]}>
						<boxGeometry args={[cabinLength, cabinHeight, width]} />
						<meshStandardMaterial color="#b87333" />
					</mesh>

					{/* Transparent Cargo Area */}
					<mesh
						position={[
							cabinLength + length / 2,
							steelPlateY + (height - steelPlateY) / 2,
							width / 2,
						]}
					>
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

					{/* Boxes — render exactly where BE says, but clamp Y for single-layer */}
					{packageBlocks.map((block, index) => {
						const [L, H, W] = block.dimensions;
						const [x, y, z] = block.position;
						const y0 = singleLayer ? 0 : y; // *FIX*

						return (
							<mesh
								key={`${block.pkg_ID}-${index}`}
								position={[
									cabinLength + x + L / 2,       // X (length)
									steelPlateY + y0 + H / 2,      // Y (height), clamped when single layer
									z + W / 2,                     // Z (width)
								]}
								castShadow
								receiveShadow
							>
								<boxGeometry args={[L, H, W]} />
								<meshStandardMaterial color={block.color} />
							</mesh>
						);
					})}
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

				{/* Show interior vs usable (rule-limited) capacity */}
				<div
					style={{
						backgroundColor: '#e0f7fa',
						padding: 12,
						borderLeft: '5px solid #00796b',
						borderRadius: 4,
					}}
				>
					<h4 style={{ margin: 0, color: '#00796b' }}>Truck Capacity</h4>
					<p style={{ margin: 0 }}>
						<b>Interior:</b> {(length * width * height).toFixed(2)} m³
					</p>
					<p style={{ margin: 0 }}>
						<b>Usable (rules):</b>{' '}
						{truckCapacity?.usableM3 != null
							? truckCapacity.usableM3.toFixed(2)
							: '—'}{' '}
						m³
					</p>
					<p style={{ margin: 0 }}>
						<b>Layers allowed:</b> {truckCapacity?.allowedLayers ?? 1}
					</p>
				</div>

				<h3 style={{ marginTop: '1.5rem' }}>Package Color Legend</h3>
				<ul style={{ paddingLeft: 0, listStyle: 'none' }}>
					{Array.from(
						new Map(packageBlocks.map((block) => [block.pkg_ID, block])).values()
					).map((block, idx) => (
						<li
							key={idx}
							style={{
								display: 'flex',
								alignItems: 'center',
								marginBottom: '0.5rem',
							}}
						>
							<div
								style={{
									width: 16,
									height: 16,
									backgroundColor: block.color,
									marginRight: 8,
									border: '1px solid #000',
								}}
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