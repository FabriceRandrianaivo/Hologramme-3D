export class AnimationService {
    constructor() {
        this.animations = new Map();
        this.currentAnimation = null;
    }

    // Enregistrer une animation
    registerAnimation(name, animationFn) {
        this.animations.set(name, animationFn);
    }

    // Jouer une animation
    play(name, target, options = {}) {
        const animation = this.animations.get(name);
        if (!animation) {
            console.warn(`Animation "${name}" non trouvée`);
            return;
        }

        this.currentAnimation = name;
        animation(target, options);
    }

    // Arrêter l'animation actuelle
    stop() {
        this.currentAnimation = null;
    }

    // Animations prédéfinies
    static wave(target, options = {}) {
        const duration = options.duration || 2000;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;

            if (progress < 1 && target.current) {
                target.current.rotation.z = Math.sin(progress * Math.PI * 4) * 0.3;
                requestAnimationFrame(animate);
            } else if (target.current) {
                target.current.rotation.z = 0;
            }
        };

        animate();
    }

    static nod(target, options = {}) {
        const duration = options.duration || 1500;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;

            if (progress < 1 && target.current) {
                target.current.rotation.x = Math.sin(progress * Math.PI * 3) * 0.2;
                requestAnimationFrame(animate);
            } else if (target.current) {
                target.current.rotation.x = 0;
            }
        };

        animate();
    }

    static pulse(target, options = {}) {
        const duration = options.duration || 2000;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;

            if (progress < 1 && target.current) {
                const scale = 1 + Math.sin(progress * Math.PI * 4) * 0.1;
                target.current.scale.set(scale, scale, scale);
                requestAnimationFrame(animate);
            } else if (target.current) {
                target.current.scale.set(1, 1, 1);
            }
        };

        animate();
    }
}

// Instance par défaut
export const animationService = new AnimationService();

// Enregistrer les animations prédéfinies
animationService.registerAnimation('wave', AnimationService.wave);
animationService.registerAnimation('nod', AnimationService.nod);
animationService.registerAnimation('pulse', AnimationService.pulse);