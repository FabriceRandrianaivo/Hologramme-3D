import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import HolographicMaterial from './HolographicMaterial';
import { useHoloStore } from '../../store/holoStore';

const HoloSphere = () => {
    const meshRef = useRef();
    const timeRef = useRef(0);
    const { color, isSpeaking } = useHoloStore();

    useFrame((state, delta) => {
        timeRef.current += delta;
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.2;
            meshRef.current.rotation.x += delta * 0.1;

            // Animation de parole (battement)
            if (isSpeaking) {
                const scale = 1 + Math.sin(timeRef.current * 10) * 0.1;
                meshRef.current.scale.set(scale, scale, scale);
            } else {
                meshRef.current.scale.lerp({ x: 1, y: 1, z: 1 }, 0.1);
            }
        }
    });

    return (
        <mesh ref={meshRef} position={[0, 0, 0]} scale={1.5}>
            <icosahedronGeometry args={[1, 4]} />
            <HolographicMaterial color={color} timeRef={timeRef} />
        </mesh>
    );
};

export default HoloSphere;
