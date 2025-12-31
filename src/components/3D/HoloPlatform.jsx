// HoloPlatform Component
import React, { useRef } from "react";
import * as THREE from "three";

const HoloPlatform = () => {
  const meshRef = useRef();

  React.useEffect(() => {
    let time = 0;
    let animationId;
    const animate = () => {
      time += 0.016;
      if (meshRef.current) {
        meshRef.current.rotation.z = time * 0.1;
      }
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <mesh ref={meshRef} position={[0, -1.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[1.5, 2, 64]} />
      <meshBasicMaterial color="#00ffff" transparent opacity={0.2} side={THREE.DoubleSide} />
    </mesh>
  );
};

export default HoloPlatform;