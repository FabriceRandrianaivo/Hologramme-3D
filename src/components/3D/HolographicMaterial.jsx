// HolographicMaterial Component
import React from 'react';
import * as THREE from "three";
import { holographicVertexShader } from "../../shaders/holographic.vert";
import { holographicFragmentShader } from "../../shaders/holographic.frag";

const HolographicMaterial = ({ color, timeRef }) => {
  return (
    <shaderMaterial
      vertexShader={holographicVertexShader}
      fragmentShader={holographicFragmentShader}
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
