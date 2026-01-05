import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useHoloStore } from "../../store/holoStore";
import { COLORS } from '../../utils/constants';

const HumanoidModel = () => {
  const groupRef = useRef();
  const timeRef = useRef(0);
  const [hovered, setHovered] = useState(false);
  const { color, isSpeaking, faceRotation, faceTrackingActive, avatarDisplayMode, visualMode, setMessage } = useHoloStore();

  // Charger le modèle 3D complet
  const { scene, nodes } = useGLTF('/models/rpm_avatar.glb');

  // Material Holographique ultra-résilient (Déplacé avant pour éviter ReferenceError)
  const material = useMemo(() => {
    const isSkinTone = [COLORS.SKIN_LIGHT, COLORS.SKIN_MEDIUM, COLORS.SKIN_DARK].includes(color);

    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: isSkinTone ? 0.9 : 0.4,
      emissive: new THREE.Color(color),
      emissiveIntensity: isSkinTone ? 0.2 : 0.8,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: isSkinTone ? THREE.NormalBlending : THREE.AdditiveBlending,
      wireframe: !isSkinTone,
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

  // Cloner et forcer les propriétés
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    console.log(`🛠️ [HologramAI] Mode d'affichage : ${avatarDisplayMode}`);

    clone.traverse(child => {
      if (child.isMesh) {
        child.frustumCulled = false;

        // Filtrage dynamique des parties
        const name = child.name.toLowerCase();
        const headKeywords = ['head', 'neck', 'eye', 'hair', 'teeth', 'tongue', 'face'];
        const bustKeywords = [...headKeywords, 'body', 'shirt', 'top', 'tshirt'];

        let isPartVisible = true;
        if (avatarDisplayMode === 'head') {
          isPartVisible = headKeywords.some(k => name.includes(k));
        } else if (avatarDisplayMode === 'bust') {
          isPartVisible = bustKeywords.some(k => name.includes(k));
        }
        // En mode 'full', on laisse tout visible

        child.visible = isPartVisible;

        // Gestion du matériel
        if (visualMode === 'hologram') {
          child.material = material;
        }

        if (child.morphTargetDictionary && child.morphTargetInfluences) {
          child.morphTargetInfluences.fill(0);
        }
      }
    });

    // Recentrage dynamique
    clone.rotation.y = Math.PI;

    // Ajustement de la hauteur selon le mode
    if (avatarDisplayMode === 'head' || avatarDisplayMode === 'bust') {
      clone.position.y = -1.65; // Centre la tête ou aligne le buste à la plateforme
    } else {
      // Mode FULL : On veut les pieds sur la plateforme (y=-0.6)
      // Les RPM models ont souvent leur origine au centre du corps ou entre les pieds.
      // On va tester 0 pour commencer, puis ajuster si besoin.
      clone.position.y = -0.6;
    }
    clone.position.z = 0;

    return clone;
  }, [scene, avatarDisplayMode, visualMode, material]);

  // Référence spécifique pour le mesh pour manipuler les morphTargets
  const meshRef = useRef();

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

      // ON NE RÉASSIGNE PAS LE MATÉRIEL ICI !
      // Cela écraserait les textures originales en mode réaliste.
    });

    if (found.length === 0) {
      console.warn("❌ [HologramAI] Modèle non articulé.");
      setMessage("⚠️ Modèle non articulé (Lip-sync OFF)");
    } else {
      setMessage(`✅ Lip-sync actif (${found.length} muscles)`);
    }
    return found;
  }, [clonedScene, setMessage]);

  // Animation Loop
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (material.userData.shader) material.userData.shader.uniforms.time.value = time;

    if (groupRef.current) {
      // 1. Dérive Organique (Idle) & Suivi
      const driftX = Math.sin(time * 0.1) * 0.01;
      const driftY = Math.sin(time * 0.08) * 0.02;

      const lookX = faceTrackingActive ? faceRotation.x : driftX;
      const lookY = faceTrackingActive ? faceRotation.y : driftY;

      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, lookX, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, lookY, 0.05);

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