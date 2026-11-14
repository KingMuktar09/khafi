import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

interface ActionMenuPortalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
  className?: string;
}

export const ActionMenuPortal: React.FC<ActionMenuPortalProps> = ({
  isOpen,
  onClose,
  triggerRef,
  children,
  className = '',
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: -9999, left: -9999 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = () => {
    if (!triggerRef.current || !menuRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const SAFE_MARGIN = 10;

    // Check if trigger button is completely outside visible viewport
    if (
      triggerRect.bottom < 0 ||
      triggerRect.top > viewportHeight ||
      triggerRect.right < 0 ||
      triggerRect.left > viewportWidth
    ) {
      onClose();
      return;
    }

    const spaceBelow = viewportHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;

    let top: number;
    // Determine whether to open downward or upward
    if (spaceBelow >= menuRect.height + SAFE_MARGIN || spaceBelow >= spaceAbove) {
      top = triggerRect.bottom + 4;
    } else {
      top = triggerRect.top - menuRect.height - 4;
    }

    // Clamp vertical position inside viewport bounds
    top = Math.max(SAFE_MARGIN, Math.min(top, viewportHeight - menuRect.height - SAFE_MARGIN));

    // Align right edge of menu with right edge of trigger button by default
    let left = triggerRect.right - menuRect.width;

    // Clamp horizontal position inside viewport bounds
    if (left < SAFE_MARGIN) {
      left = Math.max(SAFE_MARGIN, Math.min(triggerRect.left, viewportWidth - menuRect.width - SAFE_MARGIN));
    }
    if (left + menuRect.width > viewportWidth - SAFE_MARGIN) {
      left = viewportWidth - menuRect.width - SAFE_MARGIN;
    }

    setCoords({ top, left });
  };

  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    // Recalculate position on layout shifts, scroll or window resize
    const handleScrollOrResize = () => {
      updatePosition();
    };

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    // Initial position measurement
    const rafId = requestAnimationFrame(updatePosition);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        zIndex: 9999,
      }}
      onClick={(e) => e.stopPropagation()}
      className={`bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-md shadow-2xl py-1 text-xs text-left text-[var(--text-main)] animate-fade-in ${className}`}
    >
      {children}
    </div>,
    document.body
  );
};
