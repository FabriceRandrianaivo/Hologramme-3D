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
      <PerspectiveCamera makeDefault position={[0, 2, 6]} fov={50} />
      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={10}
        autoRotate={rotation}
        autoRotateSpeed={ANIMATION.ROTATION_SPEED}
      />

      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#00ffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ff00ff" />
      <spotLight position={[0, 5, 0]} angle={0.3} penumbra={1} intensity={2} color="#00ffff" />

      <Suspense fallback={null}>
        {avatarType === 'face' ? <HumanoidModel /> : <HoloSphere />}
      </Suspense>

      {/* <HoloPlatform /> */}
    </>
  );
};

export default Scene;