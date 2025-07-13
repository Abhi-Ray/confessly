"use client"
import React, { useState, useRef, useEffect } from 'react';
import { FiRefreshCw } from 'react-icons/fi';

/**
 * PullToRefresh Component
 * 
 * Instagram-like pull-to-refresh behavior:
 * - Only triggers when user is at the very top of the scroll (scrollTop <= 3px)
 * - Prevents refresh when pulling at the bottom or middle of the page
 * - Uses overscroll-behavior CSS to prevent unwanted bounce effects
 * - Includes visual feedback with rotating refresh icon
 * 
 * @param {Function} onRefresh - Function to call when refresh is triggered
 * @param {React.ReactNode} children - Content to wrap
 * @param {number} threshold - Distance in pixels to trigger refresh (default: 80)
 */
const PullToRefresh = ({ onRefresh, children, threshold = 80 }) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const containerRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);
  const isAtTopRef = useRef(true);
  const lastScrollTop = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const checkScrollPosition = () => {
      const scrollTop = container.scrollTop;
      const atTop = scrollTop <= 3; // Even smaller tolerance for more precision
      
      // Only update if the scroll position actually changed
      if (scrollTop !== lastScrollTop.current) {
        isAtTopRef.current = atTop;
        setIsAtTop(atTop);
        lastScrollTop.current = scrollTop;
        
        // Debug logging
        if (process.env.NODE_ENV === 'development') {
          console.log('Scroll position:', scrollTop, 'At top:', atTop);
        }
        
        // Add/remove CSS class based on position
        if (atTop) {
          container.classList.add('at-top');
          container.classList.remove('prevent-overscroll');
        } else {
          container.classList.remove('at-top');
          container.classList.add('prevent-overscroll');
        }
      }
    };

    const handleTouchStart = (e) => {
      // Only trigger if we're at the very top of the scroll
      if (isAtTopRef.current) {
        startY.current = e.touches[0].clientY;
        isDragging.current = true;
        // Add class to prevent text selection
        document.body.classList.add('pull-to-refresh-active');
        
        // Debug logging
        if (process.env.NODE_ENV === 'development') {
          console.log('Touch start at top:', isAtTopRef.current);
        }
      }
    };

    const handleTouchMove = (e) => {
      if (!isDragging.current || isRefreshing) return;

      currentY.current = e.touches[0].clientY;
      const deltaY = currentY.current - startY.current;

      // Only allow downward pull when at the very top
      if (deltaY > 0 && isAtTopRef.current) {
        e.preventDefault();
        const distance = Math.min(deltaY * 0.5, threshold * 2); // Dampen the pull
        setPullDistance(distance);
        setIsPulling(distance > 10);
        
        // Debug logging
        if (process.env.NODE_ENV === 'development' && distance > 10) {
          console.log('Pulling down:', distance, 'At top:', isAtTopRef.current);
        }
      } else if (deltaY < 0 || !isAtTopRef.current) {
        // Reset if pulling up or not at top
        setPullDistance(0);
        setIsPulling(false);
        isDragging.current = false;
        
        // Debug logging
        if (process.env.NODE_ENV === 'development') {
          console.log('Reset pull - deltaY:', deltaY, 'At top:', isAtTopRef.current);
        }
      }
    };

    const handleTouchEnd = async () => {
      if (!isDragging.current || isRefreshing) return;

      if (pullDistance > threshold && isAtTopRef.current) {
        setIsRefreshing(true);
        
        // Debug logging
        if (process.env.NODE_ENV === 'development') {
          console.log('Triggering refresh - pullDistance:', pullDistance, 'threshold:', threshold);
        }
        
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

    const handleScroll = () => {
      checkScrollPosition();
      // If user scrolls away from top, cancel any ongoing pull
      if (!isAtTopRef.current && isDragging.current) {
        setPullDistance(0);
        setIsPulling(false);
        isDragging.current = false;
        document.body.classList.remove('pull-to-refresh-active');
        
        // Debug logging
        if (process.env.NODE_ENV === 'development') {
          console.log('Cancelled pull due to scroll away from top');
        }
      }
    };

    // Add scroll listener to track position
    container.addEventListener('scroll', handleScroll, { passive: true });
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });

    // Initial check
    checkScrollPosition();

    return () => {
      container.removeEventListener('scroll', handleScroll);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      document.body.classList.remove('pull-to-refresh-active');
      container.classList.remove('at-top', 'prevent-overscroll');
    };
  }, [pullDistance, threshold, isRefreshing, onRefresh]);

  const rotation = Math.min((pullDistance / threshold) * 180, 180);
  const opacity = Math.min(pullDistance / threshold, 1);

  return (
    <div className="relative overflow-hidden pull-to-refresh-container">
      {/* Pull to refresh indicator */}
      <div
        className={`absolute top-0 left-0 right-0 z-10 flex items-center justify-center transition-all duration-200 pull-indicator ${
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