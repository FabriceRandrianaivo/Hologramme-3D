import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useHoloStore } from "../../store/holoStore";

const HumanoidModel = () => {
  const groupRef = useRef();
  const timeRef = useRef(0);
  const [hovered, setHovered] = useState(false);
  const { color, isSpeaking, faceRotation, faceTrackingActive } = useHoloStore();

  // Charger le modèle 3D complet
  const { scene, nodes } = useGLTF('/models/rpm_avatar.glb');

  // Cloner et forcer les propriétés
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse(child => {
      if (child.isMesh) {
        child.frustumCulled = false; // Évite que le visage disparaisse
        if (child.morphTargetDictionary && child.morphTargetInfluences) {
          child.morphTargetInfluences.fill(0);
        }
      }
    });
    return clone;
  }, [scene]);

  // Référence spécifique pour le mesh pour manipuler les morphTargets
  const meshRef = useRef();

  // Material Holographique ultra-résilient
  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.8,
      emissive: new THREE.Color(color),
      emissiveIntensity: 0.6,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      morphTargets: true,
      skinning: true,
    });

    mat.onBeforeCompile = (shader) => {
      shader.uniforms.time = { value: 0 };
      shader.fragmentShader = `
          uniform float time;
          ${shader.fragmentShader}
        `.replace(
        '#include <dithering_fragment>',
        `#include <dithering_fragment>
             float scan = sin(gl_FragCoord.y * 0.3 + time * 6.0) * 0.15 + 0.85;
             gl_FragColor.rgb *= scan;
            `
      );
      mat.userData.shader = shader;
    };
    return mat;
  }, [color]);

  // Temps de test au démarrage (5sec)
  const [testPulseActive, setTestPulseActive] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setTestPulseActive(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // SCAN TOTAL EXHAUSTIF (Optimisé pour RPM)
  const allMouthMeshes = useMemo(() => {
    const found = [];
    console.log("🔍 [HologramAI] Scan des muscles RPM...");

    clonedScene.traverse(child => {
      if (child.morphTargetDictionary) {
        const dict = child.morphTargetDictionary;
        const targets = [];
        const keywords = ['jaw', 'mouth', 'open', 'viseme', 'aa', 'oh', 'o', 'lips'];

        Object.keys(dict).forEach(key => {
          if (keywords.some(word => key.toLowerCase().includes(word))) {
            targets.push({ name: key, index: dict[key] });
          }
        });

        if (targets.length > 0) {
          found.push({ mesh: child, targets });
          console.log(`✅ [HologramAI] Muscle trouvé sur : "${child.name}"`);
        }
      }

      if (child.isMesh) {
        child.material = material;
      }
    });

    if (found.length === 0) {
      console.warn("❌ [HologramAI] Modèle non articulé.");
    }
    return found;
  }, [clonedScene, material]);

  // Animation Loop
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (material.userData.shader) material.userData.shader.uniforms.time.value = time;

    if (groupRef.current) {
      // 1. Dérive Organique (Idle) & Suivi
      const driftX = Math.sin(time * 0.15) * 0.02 + Math.cos(time * 0.08) * 0.01;
      const driftY = Math.sin(time * 0.12) * 0.04 + Math.cos(time * 0.07) * 0.02;

      const lookX = faceTrackingActive ? faceRotation.x : driftX;
      const lookY = faceTrackingActive ? faceRotation.y : driftY;

      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, lookX, 0.08);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, lookY, 0.08);

      // 2. LIP-SYNC CHIRURGICAL 👄
      // Pulse test force l'ouverture au début, LifePulse donne un peu de vie
      const lifePulse = Math.max(0, Math.sin(time * 0.5) - 0.98) * 5;
      const pulseVal = testPulseActive ? 0.8 : lifePulse;
      const speechIntensity = isSpeaking ? (0.4 + Math.sin(time * 26) * 0.45) : 0;
      const finalIntensity = Math.min(1.0, Math.max(pulseVal, speechIntensity));

      allMouthMeshes.forEach(item => {
        const influences = item.mesh.morphTargetInfluences;
        const dict = item.mesh.morphTargetDictionary;

        // Priorité RPM : jawOpen est le plus fiable pour l'ouverture
        const priorityList = ['jawOpen', 'mouthOpen', 'viseme_aa', 'viseme_O'];
        let bestTarget = null;

        for (const name of priorityList) {
          if (dict[name] !== undefined) {
            bestTarget = dict[name];
            break;
          }
        }

        if (bestTarget !== null) {
          influences[bestTarget] = THREE.MathUtils.lerp(influences[bestTarget], finalIntensity, 0.4);

          // Mise à zéro des autres morphs de parole pour éviter les conflits
          item.targets.forEach(t => {
            if (t.index !== bestTarget && t.name.includes('viseme')) {
              influences[t.index] = THREE.MathUtils.lerp(influences[t.index], 0, 0.2);
            }
          });
        }
      });

      // 3. Nodding subtil pendant la parole
      if (isSpeaking) {
        groupRef.current.rotation.x += Math.sin(time * 12) * 0.01;
      }

      // 4. Zoom au survol
      const baseScale = hovered ? 1.1 : 1;
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, baseScale, 0.1));
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <primitive object={clonedScene} />
    </group>
  );
};

// Précharger le modèle
useGLTF.preload('/models/rpm_avatar.glb');

export default HumanoidModel;