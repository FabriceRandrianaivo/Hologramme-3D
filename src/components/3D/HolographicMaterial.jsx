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
        color: { value: new THREE.Color(color) },
        opacity: { value: 0.8 },
        scanlineSpeed: { value: 1.0 },
        fresnelPower: { value: 2.0 }
      }}
      transparent
      depthWrite={false} // Empêche l'occlusion "invisible"
      blending={THREE.AdditiveBlending} // Effet lumineux plus joli
      side={THREE.DoubleSide}
    />
  );
};

export default HolographicMaterial;
