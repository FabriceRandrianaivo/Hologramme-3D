import { useHoloStore } from '../store/holoStore';

export const useHologram = () => {
  const {
    rotation,
    color,
    message,
    setRotation,
    setColor,
    setMessage
  } = useHoloStore();

  // Toggle rotation
  const toggleRotation = () => {
    setRotation(!rotation);
    setMessage(rotation ? 'Rotation désactivée' : 'Rotation activée');
  };

  // Changer la couleur
  const changeColor = (newColor) => {
    setColor(newColor);
    setMessage(`Couleur changée: ${newColor}`);
  };

  // Animer l'hologramme
  const animate = (animationType) => {
    switch (animationType) {
      case 'wave':
        setMessage('👋 Animation: Salut !');
        break;
      case 'nod':
        setMessage('Animation: Hochement de tête');
        break;
      case 'dance':
        setMessage('💃 Animation: Danse !');
        break;
      default:
        setMessage('Animation inconnue');
    }
  };

  // Réinitialiser
  const reset = () => {
    setRotation(true);
    setColor('#00ffff');
    setMessage('Hologramme réinitialisé');
  };

  return {
    rotation,
    color,
    message,
    toggleRotation,
    changeColor,
    animate,
    reset
  };
};