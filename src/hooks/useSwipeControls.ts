import { useRef, useCallback } from 'react';

interface SwipeControlsOptions {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  threshold?: number;
  disabled?: boolean;
}

export const useSwipeControls = ({
  onSwipeLeft,
  onSwipeRight,
  threshold = 30,
  disabled = false,
}: SwipeControlsOptions) => {
  const startXRef = useRef(0);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (disabled) return;
      if ('preventDefault' in e) e.preventDefault();
      const touch = 'touches' in e ? e.touches[0] : e;
      startXRef.current = 'clientX' in touch ? touch.clientX : 0;
    },
    [disabled]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (disabled) return;
      if ('preventDefault' in e) e.preventDefault();

      const touch = 'changedTouches' in e ? e.changedTouches[0] : e;
      const endX = 'clientX' in touch ? touch.clientX : 0;
      const diff = endX - startXRef.current;

      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          onSwipeRight();
        } else {
          onSwipeLeft();
        }
      }
    },
    [disabled, threshold, onSwipeLeft, onSwipeRight]
  );

  return { handleTouchStart, handleTouchEnd };
};
