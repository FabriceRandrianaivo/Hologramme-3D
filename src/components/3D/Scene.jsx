// Scene Component
import { Suspense } from 'react';
import { useHoloStore } from "../../store/holoStore";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { ANIMATION } from "../../utils/constants";
import HumanoidModel from "./HumanoidModel";
import HoloPlatform from "./HoloPlatform";
import HoloSphere from "./HoloSphere";

const Scene = () => {
  const { rotation, avatarType } = useHoloStore();

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 1.2]} fov={40} />
      <OrbitControls
        enablePan={false}
        minDistance={1}
        maxDistance={8}
        autoRotate={rotation}
        autoRotateSpeed={ANIMATION.ROTATION_SPEED}
        target={[0, 0, 0]}
      />

      <ambientLight intensity={0.5} />
      <pointLight position={[2, 2, 2]} intensity={2} color="#00ffff" />
      <pointLight position={[-2, 2, 2]} intensity={1.5} color="#00ffff" />
      <spotLight position={[0, 2, 1]} angle={0.4} penumbra={1} intensity={5} color="#00ffff" />
      <pointLight position={[0, 0, -2]} intensity={3} color="#00ffff" /> {/* Rim Light */}

      <Suspense fallback={null}>
        {avatarType === 'face' ? <HumanoidModel /> : <HoloSphere />}
      </Suspense>

      <HoloPlatform />
    </>
  );
};

export default Scene;