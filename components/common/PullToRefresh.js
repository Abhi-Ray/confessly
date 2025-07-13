"use client"
import React, { useState, useRef, useEffect } from 'react';
import { FiRefreshCw } from 'react-icons/fi';

const PullToRefresh = ({ onRefresh, children, threshold = 80 }) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e) => {
      // Only trigger if we're at the top of the scroll
      if (container.scrollTop <= 0) {
        startY.current = e.touches[0].clientY;
        isDragging.current = true;
        // Add class to prevent text selection
        document.body.classList.add('pull-to-refresh-active');
      }
    };

    const handleTouchMove = (e) => {
      if (!isDragging.current || isRefreshing) return;

      currentY.current = e.touches[0].clientY;
      const deltaY = currentY.current - startY.current;

      // Only allow downward pull
      if (deltaY > 0 && container.scrollTop <= 0) {
        e.preventDefault();
        const distance = Math.min(deltaY * 0.5, threshold * 2); // Dampen the pull
        setPullDistance(distance);
        setIsPulling(distance > 10);
      }
    };

    const handleTouchEnd = async () => {
      if (!isDragging.current || isRefreshing) return;

      if (pullDistance > threshold) {
        setIsRefreshing(true);
        try {
          await onRefresh();
        } catch (error) {
          console.error('Refresh failed:', error);
        } finally {
          setIsRefreshing(false);
        }
      }

      // Reset state
      setPullDistance(0);
      setIsPulling(false);
      isDragging.current = false;
      // Remove class
      document.body.classList.remove('pull-to-refresh-active');
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      document.body.classList.remove('pull-to-refresh-active');
    };
  }, [pullDistance, threshold, isRefreshing, onRefresh]);

  const rotation = Math.min((pullDistance / threshold) * 180, 180);
  const opacity = Math.min(pullDistance / threshold, 1);

  return (
    <div className="relative overflow-hidden">
      {/* Pull to refresh indicator */}
      <div
        className={`absolute top-0 left-0 right-0 z-10 flex items-center justify-center transition-all duration-200 ${
          isPulling || isRefreshing ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          transform: `translateY(${Math.min(pullDistance, threshold)}px)`,
          height: `${threshold}px`,
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <div
            className={`transition-all duration-200 ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            style={{
              transform: `rotate(${isRefreshing ? 0 : rotation}deg)`,
              opacity: opacity,
            }}
          >
            <FiRefreshCw
              size={24}
              className={`${
                isRefreshing
                  ? 'text-rose-400'
                  : pullDistance > threshold
                  ? 'text-rose-300'
                  : 'text-rose-200/60'
              }`}
            />
          </div>
          <div
            className="text-sm font-medium transition-all duration-200"
            style={{ opacity: opacity }}
          >
            <span
              className={`${
                isRefreshing
                  ? 'text-rose-400'
                  : pullDistance > threshold
                  ? 'text-rose-300'
                  : 'text-rose-200/60'
              }`}
            >
              {isRefreshing ? 'Refreshing...' : 'Pull to refresh'}
            </span>
          </div>
        </div>
      </div>

      {/* Content container */}
      <div
        ref={containerRef}
        className="relative"
        style={{
          transform: `translateY(${Math.min(pullDistance, threshold)}px)`,
          transition: isRefreshing ? 'transform 0.3s ease-out' : 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh; 