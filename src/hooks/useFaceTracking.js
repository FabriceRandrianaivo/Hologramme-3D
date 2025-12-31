import { useEffect, useRef, useCallback } from 'react';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { useHoloStore } from '../store/holoStore';

export const useFaceTracking = () => {
    const { faceTrackingActive, setFaceRotation } = useHoloStore();
    const faceLandmarkerRef = useRef(null);
    const videoRef = useRef(null);
    const requestRef = useRef(null);
    const lastVideoTimeRef = useRef(-1);

    // Initialisation de Mediapipe
    const initFaceLandmarker = useCallback(async () => {
        const filesetResolver = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(filesetResolver, {
            baseOptions: {
                modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                delegate: "GPU"
            },
            outputFaceBlendshapes: true,
            runningMode: "VIDEO",
            numFaces: 1
        });
        console.log("✅ Face Landmarker initialized");
    }, []);

    // Boucle de détection
    const predictWebcam = useCallback(() => {
        if (!faceLandmarkerRef.current || !videoRef.current || !faceTrackingActive) return;

        let startTimeMs = performance.now();
        if (lastVideoTimeRef.current !== videoRef.current.currentTime) {
            lastVideoTimeRef.current = videoRef.current.currentTime;

            const results = faceLandmarkerRef.current.detectForVideo(videoRef.current, startTimeMs);

            if (results.faceLandmarks && results.faceLandmarks.length > 0) {
                const landmarks = results.faceLandmarks[0];

                // Calcul de la rotation simplifiée basée sur des points clés
                // Index 4: Nez, Index 1: Menton, Index 33: Oeil gauche, Index 263: Oeil droit
                const nose = landmarks[4];
                const chin = landmarks[152];
                const leftEye = landmarks[33];
                const rightEye = landmarks[263];

                // Calcul simplifié du Yaw (Rotation Y) - Gauche/Droite
                // On regade le décalage du nez par rapport au milieu des yeux
                const eyeCenterX = (leftEye.x + rightEye.x) / 2;
                const yaw = (nose.x - eyeCenterX) * 2; // -1 à 1 environ

                // Calcul simplifié du Pitch (Rotation X) - Haut/Bas
                const eyeCenterY = (leftEye.y + rightEye.y) / 2;
                const noseHeight = chin.y - eyeCenterY;
                const pitch = ((nose.y - eyeCenterY) / noseHeight - 0.5) * 2;

                setFaceRotation({
                    x: pitch * 0.5,
                    y: -yaw * 0.8, // Inversé pour le miroir
                    z: 0
                });
            }
        }

        requestRef.current = requestAnimationFrame(predictWebcam);
    }, [faceTrackingActive, setFaceRotation]);

    useEffect(() => {
        if (faceTrackingActive) {
            // Activer la Webcam
            const startWebcam = async () => {
                if (!faceLandmarkerRef.current) await initFaceLandmarker();

                const constraints = { video: { width: 640, height: 480 } };
                const stream = await navigator.mediaDevices.getUserMedia(constraints);

                videoRef.current = document.createElement('video');
                videoRef.current.srcObject = stream;
                videoRef.current.autoplay = true;

                videoRef.current.addEventListener('loadeddata', () => {
                    predictWebcam();
                });
            };

            startWebcam().catch(err => {
                console.error("❌ Webcam Error:", err);
            });
        } else {
            // Arrêter tout
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        }

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, [faceTrackingActive, initFaceLandmarker, predictWebcam]);

    return null;
};
