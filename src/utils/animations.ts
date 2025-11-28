/**
 * Animation utility classes and helpers
 */

export const animations = {
  slideUp: 'animate-slide-up',
  fadeIn: 'animate-fade-in',
  scaleIn: 'animate-scale-in',
  bounce: 'animate-bounce-small',
};

export const completionAnimation = () => {
  // Logic to trigger completion animation (e.g. confetti or specific UI feedback)
  // For now, just return the class name for the element
  return 'animate-scale-in text-success';
};

export const favoriteToggleAnimation = (isFavorite: boolean) => {
  return isFavorite ? 'animate-scale-in text-warning' : 'text-text-muted';
};

export const pointsUpdateAnimation = () => {
  return 'transition-all duration-500 ease-out';
};
