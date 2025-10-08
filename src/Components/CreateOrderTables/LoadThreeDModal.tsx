'use client';
import React, { useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export interface PackageBlock {
	pkg_ID: string;
	prod_ID?: string;
	color: string;
	dimensions: [number, number, number];
	position: [number, number, number];
}

export interface TruckSceneProps {
	vehicleDimensions: { length: number; width: number; height: number };
	packageBlocks: PackageBlock[];
}

const CameraUpdater: React.FC<{ zoom: number }> = ({ zoom }) => {
	const { camera } = useThree();

	useEffect(() => {
		camera.position.set(zoom, zoom * 0.6, zoom);
		camera.lookAt(0, 0, 0);
	}, [zoom, camera]);

	return null;
};

const TruckScene: React.FC<TruckSceneProps> = ({ vehicleDimensions, packageBlocks }) => {
	const { length, width, height } = vehicleDimensions;

	const cabinLength = 1.6;
	const cabinHeight = Math.max(0.6 * height, 1.2);
	const wheelRadius = 0.5;
	const extraWheelDrop = 0.45;
	const wheelY = wheelRadius - extraWheelDrop;
	const bodyLiftY = wheelRadius;

	const cargoBaseY = bodyLiftY;
	const steelThickness = 0.2;
	const steelTopY = cargoBaseY + steelThickness;

	const baseDistance = Math.max(length, width, height) * 1.6;
	const [zoom, setZoom] = useState(baseDistance);

	const calculateWheelPositions = () => {
		const numberOfAxles = length <= 5 ? 2 : length <= 8 ? 3 : 4;
		const insetZ = 0.5;
		const leftZ = insetZ;
		const rightZ = width - insetZ;
		const wheelPositions: [number, number, number][] = [];

		const cabinX = cabinLength / 2;
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

	const clampPackageBottom = (yBE: number) => {
		const requestedBottom = cargoBaseY + yBE;
		return Math.max(requestedBottom, steelTopY);
	};

	return (
		<div style={{ position: 'relative', width: '100%', height: 640 }}>
			{/* Zoom Buttons in top-right */}
			<div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', flexDirection: 'row', gap: '0.5rem', zIndex: 10 }}>
				<button onClick={() => setZoom(z => z * 0.9)} style={{ padding: '0.5rem', borderRadius: 6, cursor: 'pointer' }}>🔍 +</button>
				<button onClick={() => setZoom(z => z * 1.1)} style={{ padding: '0.5rem', borderRadius: 6, cursor: 'pointer' }}>🔍 -</button>
			</div>

			<Canvas
				shadows={false}
				gl={{ antialias: true, powerPreference: 'high-performance' }}
				dpr={[1, typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1]}
				camera={{ position: [zoom, zoom * 0.6, zoom], fov: 45, near: 0.01, far: 2000 }}
				style={{ width: '100%', height: '100%', background: '#f6f7f8' }}
			>
				<CameraUpdater zoom={zoom} />

				<color attach="background" args={['#f6f7f8']} />
				<ambientLight intensity={0.8} />
				<directionalLight position={[10, 12, 8]} intensity={0.6} />

				<OrbitControls enableZoom={false} enableRotate enablePan={false} />

				{/* Cabin */}
				<mesh position={[cabinLength / 2, bodyLiftY + cabinHeight / 2, width / 2]}>
					<boxGeometry args={[cabinLength, cabinHeight, width]} />
					<meshStandardMaterial color="#b87333" metalness={0.2} roughness={0.45} />
				</mesh>

				{/* Cargo shell */}
				<mesh position={[cabinLength + length / 2, steelTopY + (height - steelThickness) / 2, width / 2]} renderOrder={999}>
					<boxGeometry args={[length, height - steelThickness, width]} />
					<meshStandardMaterial color="#a0c4ff" transparent opacity={0.25} depthWrite={true} />
				</mesh>

				{/* Floor */}
				<mesh position={[cabinLength + length / 2, cargoBaseY + steelThickness / 2, width / 2]}>
					<boxGeometry args={[length, steelThickness, width]} />
					<meshStandardMaterial color="#222" metalness={1} roughness={0.28} side={THREE.DoubleSide} />
				</mesh>

				{/* Wheels */}
				{wheelPositions.map((pos, idx) => (
					<mesh key={idx} position={pos} rotation={[Math.PI / 2, 0, 0]}>
						<cylinderGeometry args={[wheelRadius, wheelRadius, 0.34, 32]} />
						<meshStandardMaterial color="#111" metalness={0.1} roughness={0.6} />
					</mesh>
				))}

				{/* Packages */}
				{packageBlocks.map((block, i) => {
					const [L, H, W] = block.dimensions;
					const [xFront, yBE, zBE] = block.position;

					const GAP = 0.01;

					const packageBottomY = clampPackageBottom(yBE) - cargoBaseY;
					const posX = cabinLength + xFront + L / 2;
					const posY = cargoBaseY + packageBottomY + H / 2;
					const posZ = zBE + W / 2;

					const finalL = L - GAP;
					const finalH = H - GAP;
					const finalW = W - GAP;

					return (
						<mesh key={`${block.pkg_ID}-${i}`} position={[posX, posY, posZ]}>
							<boxGeometry args={[finalL, finalH, finalW]} />
							<meshStandardMaterial color={block.color} metalness={0.02} roughness={0.6} side={THREE.FrontSide} />
						</mesh>
					);
				})}
			</Canvas>
		</div>
	);
};

export default TruckScene;
