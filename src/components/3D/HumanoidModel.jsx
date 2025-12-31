import React from 'react';
import { useHoloStore } from "../../store/holoStore";
import { ANIMATION } from "../../utils/constants";
import HolographicMaterial from "./HolographicMaterial";

const HumanoidModel = () => {
  const groupRef = React.useRef();
  const timeRef = React.useRef(0);
  const [hovered, setHovered] = React.useState(false);
  const { color } = useHoloStore();

  React.useEffect(() => {
    let animationId;
    const animate = () => {
      timeRef.current += 0.016;
      if (groupRef.current) {
        groupRef.current.rotation.y = Math.sin(timeRef.current * 0.3) * 0.2;
        groupRef.current.position.y = Math.sin(timeRef.current * 0.5) * 0.1;
      }
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? ANIMATION.HOVER_SCALE : 1}
    >
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.3, 1, 16, 32]} />
        <HolographicMaterial color={color} timeRef={timeRef} />
      </mesh>

      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <HolographicMaterial color={color} timeRef={timeRef} />
      </mesh>

      <mesh position={[-0.5, 0.3, 0]} rotation={[0, 0, 0.3]}>
        <capsuleGeometry args={[0.12, 0.8, 8, 16]} />
        <HolographicMaterial color={color} timeRef={timeRef} />
      </mesh>

      <mesh position={[0.5, 0.3, 0]} rotation={[0, 0, -0.3]}>
        <capsuleGeometry args={[0.12, 0.8, 8, 16]} />
        <HolographicMaterial color={color} timeRef={timeRef} />
      </mesh>

      <mesh position={[-0.2, -1, 0]}>
        <capsuleGeometry args={[0.15, 0.9, 8, 16]} />
        <HolographicMaterial color={color} timeRef={timeRef} />
      </mesh>

      <mesh position={[0.2, -1, 0]}>
        <capsuleGeometry args={[0.15, 0.9, 8, 16]} />
        <HolographicMaterial color={color} timeRef={timeRef} />
      </mesh>
    </group>
  );
};

export default HumanoidModel;