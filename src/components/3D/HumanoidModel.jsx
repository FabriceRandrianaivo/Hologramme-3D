import React, { useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useHoloStore } from "../../store/holoStore";
import { ANIMATION } from "../../utils/constants";
import HolographicMaterial from "./HolographicMaterial";

const HumanoidModel = () => {
  const groupRef = useRef();
  const timeRef = useRef(0);
  const [hovered, setHovered] = useState(false);
  const { color } = useHoloStore();

  // Charger le modèle 3D
  const { nodes } = useGLTF('/models/face2.glb');

  useEffect(() => {
    // Debug: Voir les noms des nodes disponibles
    console.log("🤖 Nodes disponibles:", nodes ? Object.keys(nodes) : 'aucun');
  }, [nodes]);

  useEffect(() => {
    let animationId;
    const animate = () => {
      timeRef.current += 0.016;
      if (groupRef.current) {
        // Rotation douce pour donner vie
        groupRef.current.rotation.y = Math.sin(timeRef.current * 0.2) * 0.1;
        // Léger flottement
        groupRef.current.position.y = Math.sin(timeRef.current * 0.5) * 0.1;
      }
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Trouver le premier mesh disponible automatiquement
  const meshNode = React.useMemo(() => {
    if (!nodes) return null;
    return Object.values(nodes).find(n => n.isMesh);
  }, [nodes]);

  // Loader si pas de mesh trouvé
  if (!meshNode) {
    return null;
  }

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 15.5 : 15}
    >
      <mesh
        geometry={meshNode.geometry}
        rotation={[0, 0, 0]}
        position={[0, 0, 0]}
      >
        <HolographicMaterial color={color} timeRef={timeRef} />
      </mesh>
    </group>
  );
};

// Précharger le modèle
useGLTF.preload('/models/face2.glb');

export default HumanoidModel;