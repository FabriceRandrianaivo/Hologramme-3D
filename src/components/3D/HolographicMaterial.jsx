// HolographicMaterial Component
const HolographicMaterial = ({ color, timeRef }) => {
  return (
    <shaderMaterial
      vertexShader={shaders.vertex}
      fragmentShader={shaders.fragment}
      uniforms={{
        time: { value: timeRef?.current || 0 },
        color: { value: new THREE.Color(color) }
      }}
      transparent
      side={THREE.DoubleSide}
    />
  );
};

export default HolographicMaterial;
