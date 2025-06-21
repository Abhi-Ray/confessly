"use client"
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { FiHeart, FiMessageCircle, FiFlag, FiSend } from 'react-icons/fi';
import { AiFillHeart } from 'react-icons/ai';
import { FaFlag } from 'react-icons/fa';
import Image from 'next/image'
import Navigation from '@/components/common/nav'

function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

const ConfessionCard = ({ confession, onLike, onReport, liked, reported, onComment }) => (
  <div className="bg-gradient-to-br from-zinc-900/90 to-black/95 backdrop-blur-sm border border-rose-300/10 rounded-2xl p-5 mb-4 shadow-lg hover:shadow-xl hover:shadow-rose-400/10 transition-all duration-300 hover:border-rose-300/20 relative group">
    <button
      className={`absolute top-4 right-4 p-1.5 rounded-full transition-all duration-200 ${
        reported 
          ? 'text-red-400 bg-red-500/20' 
          : 'text-rose-300/60 hover:text-red-400 hover:bg-red-500/10'
      }`}
      title="Report"
      onClick={() => onReport(confession.id)}
      aria-label="Report"
    >
      {reported ? <FaFlag size={16} /> : <FiFlag size={16} />}
    </button>
    
    <div className="text-rose-50 text-base mb-3 whitespace-pre-line break-words leading-relaxed pr-8">
      {confession.content}
    </div>
    
    <div className="flex items-center justify-between text-sm text-rose-200/70 mt-3 mb-4">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-rose-400 via-rose-300 to-amber-300 flex items-center justify-center">
          <span className="text-black text-xs font-bold">
            {(confession.anon_id || 'A')[0].toUpperCase()}
          </span>
        </div>
        <span className="font-medium">@{confession.anon_id || 'Anonymous'}</span>
      </div>
      <span className="text-rose-200/50">{timeAgo(confession.created_at)}</span>
    </div>
    
    <div className="flex items-center gap-6">
      <button
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 ${
          liked 
            ? 'text-red-400 bg-red-500/15 shadow-md shadow-red-500/20' 
            : 'text-rose-200/70 hover:text-red-400 hover:bg-red-500/10'
        }`}
        onClick={() => onLike(confession.id)}
        aria-label="Like"
      >
        {liked ? <AiFillHeart size={18} /> : <FiHeart size={18} />}
        <span className="text-sm font-medium">{confession.likes_count}</span>
      </button>
      
      <button 
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-rose-200/70 hover:text-rose-300 hover:bg-rose-400/10 transition-all duration-200"
        onClick={() => onComment(confession.id)}
      >
        <FiMessageCircle size={18} />
        <span className="text-sm font-medium">{confession.comments_count}</span>
      </button>
    </div>
  </div>
);

const PAGE_SIZE = 30;

const Home = () => {
  const [confessions, setConfessions] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [likedIds, setLikedIds] = useState([]);
  const [reportedIds, setReportedIds] = useState([]);
  const loader = useRef();
  const [openCommentId, setOpenCommentId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [isClosing, setIsClosing] = useState(false);
  const scrollPositionRef = useRef(0);

  // Improved body scroll management
  useEffect(() => {
    if (openCommentId) {
      // Store current scroll position
      scrollPositionRef.current = window.pageYOffset || document.documentElement.scrollTop;
      
      // Prevent body scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore body scroll
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        
        // Restore scroll position without animation
        window.scrollTo(0, scrollPositionRef.current);
      };
    }
  }, [openCommentId]);

  const fetchConfessions = useCallback(async (pageNum) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/post`);
      const data = await res.json();
      if (data && data.data) {
        const filtered = data.data.filter((c) => c.status === true);
        const start = (pageNum - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        const nextPageData = filtered.slice(start, end);
        setConfessions((prev) => (pageNum === 1 ? nextPageData : [...prev, ...nextPageData]));
        setHasMore(end < filtered.length);
      }
    } catch (e) {
      // handle error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfessions(page);
  }, [page, fetchConfessions]);

  // Infinite scroll observer
  useEffect(() => {
    if (!hasMore || loading) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );
    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [hasMore, loading]);

  // Like handler (calls API and refreshes list)
  const handleLike = async (id) => {
    if (likedIds.includes(id)) return; // Prevent multiple likes per session
    setLikedIds((prev) => [...prev, id]);
    try {
      const anon_id = typeof window !== 'undefined' ? localStorage.getItem('anon_id') : null;
      await fetch('/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confession_id: id, anon_id }),
      });
      // Refresh confessions list
      setConfessions((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, likes_count: c.likes_count + 1 } : c
        )
      );
    } catch (e) {
      // handle error
    }
  };

  // Report handler (calls API and marks as reported)
  const handleReport = async (id) => {
    if (reportedIds.includes(id)) return; // Prevent multiple reports per session
    setReportedIds((prev) => [...prev, id]);
    try {
      const anon_id = typeof window !== 'undefined' ? localStorage.getItem('anon_id') : null;
      await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confession_id: id, anon_id }),
      });
      // No refresh needed
    } catch (e) {
      // handle error
    }
  };

  const openComments = async (confessionId) => {
    setOpenCommentId(confessionId);
    setIsClosing(false);
    // Fetch comments for this confession from new API
    const res = await fetch(`/api/comment?confession_id=${confessionId}`);
    const data = await res.json();
    setComments(data.comments.reverse() || []);
  };

  const closeComments = () => {
    setIsClosing(true);
    setTimeout(() => {
      setOpenCommentId(null);
      setCommentText('');
      setComments([]);
      setIsClosing(false);
    }, 300); // Match the animation duration
  };

  const handleSendComment = async () => {
    if (!commentText.trim()) return;
    const anon_id = typeof window !== 'undefined' ? localStorage.getItem('anon_id') : null;
    await fetch('/api/comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ confession_id: openCommentId, content: commentText, anon_id }),
    });
    // Refetch comments
    openComments(openCommentId);
    // Refresh confessions list to update comments_count
    fetchConfessions(page);
    setCommentText('');
  };

  return (
    <> 
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black text-white flex flex-col items-center pt-2 pb-20">
      <main className="w-full max-w-md px-2">
        <div className="flex justify-center mb-4">
          <Image
            src="/head.png"
            alt="Confessly Head"
            width={160}
            height={160}
            className="w-36 h-16 object-contain"
            priority
          />
        </div>
       
        {confessions.map((confession, idx) => (
          <ConfessionCard
            key={`${confession.id}-${idx}`}
            confession={confession}
            onLike={handleLike}
            onReport={handleReport}
            liked={likedIds.includes(confession.id)}
            reported={reportedIds.includes(confession.id)}
            onComment={openComments}
          />
        ))}
       
       {loading && (
  <div className="text-center py-8">
    <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4">
      {/* Rotating outer ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-400 via-rose-300 to-amber-300 animate-spin" style={{ animationDuration: '2s' }}></div>
      <div className="absolute inset-1 rounded-full bg-black"></div>
      
      {/* Anonymous face */}
      <div className="relative z-10 flex items-center justify-center w-16 h-16">
        {/* Face outline with subtle pulse */}
        <div className="absolute w-14 h-14 rounded-full border-2 border-rose-300/70 animate-pulse"></div>
        
        {/* Eyes - blinking animation */}
        <div className="absolute top-4 left-3.5 w-1.5 h-1.5 bg-rose-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s', animationDuration: '1.5s' }}></div>
        <div className="absolute top-4 right-3.5 w-1.5 h-1.5 bg-rose-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s', animationDuration: '1.5s' }}></div>
        
        {/* Nose - simple dot */}
        <div className="absolute top-6 w-0.5 h-0.5 bg-rose-300/60 rounded-full"></div>
        
        {/* Mouth - curved line using border */}
        <div className="absolute top-7 w-4 h-2 border-b-2 border-rose-300/70 rounded-full animate-pulse" style={{ animationDelay: '0.8s', animationDuration: '2s' }}></div>
        
        {/* Question mark overlay for anonymity */}
        <div className="absolute bottom-1 text-amber-300 text-xs font-bold animate-bounce opacity-80" style={{ animationDelay: '1s', animationDuration: '1.8s' }}>
          ?
        </div>
        
        {/* Floating mystery dots */}
        <div className="absolute -top-1 -left-1 w-0.5 h-0.5 bg-amber-300 rounded-full animate-ping" style={{ animationDelay: '0s', animationDuration: '2s' }}></div>
        <div className="absolute -top-1 -right-1 w-0.5 h-0.5 bg-rose-400 rounded-full animate-ping" style={{ animationDelay: '0.5s', animationDuration: '2s' }}></div>
        <div className="absolute -bottom-1 -left-1 w-0.5 h-0.5 bg-rose-300 rounded-full animate-ping" style={{ animationDelay: '1s', animationDuration: '2s' }}></div>
        <div className="absolute -bottom-1 -right-1 w-0.5 h-0.5 bg-amber-400 rounded-full animate-ping" style={{ animationDelay: '1.5s', animationDuration: '2s' }}></div>
        
        {/* Mysterious aura effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-400/10 via-transparent to-amber-300/10 animate-pulse" style={{ animationDuration: '3s' }}></div>
      </div>
    </div>
    
    {/* Loading text with gradient and mystery theme */}
    <div className="bg-gradient-to-r from-rose-400 via-rose-300 to-amber-300 bg-clip-text">
      <p className="text-transparent text-sm font-bold animate-pulse" style={{ animationDuration: '2s' }}>
        Reading anonymous minds...
      </p>
    </div>
  </div>
)}

        <div ref={loader} />
        {!hasMore && confessions.length > 0 && (
          <div className="text-center text-rose-200/40 py-4">No more confessions.</div>
        )}
      </main>
      
      {openCommentId && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm"
          onClick={closeComments}
          style={{ zIndex: 50 }}
        >
          <div
            className={`w-full max-w-md h-[75vh] bg-gradient-to-b from-zinc-900/95 to-black/95 backdrop-blur-xl border border-rose-300/20 rounded-t-3xl p-5 flex flex-col shadow-2xl ${
              isClosing ? 'animate-slideDown' : 'animate-slideUp'
            }`}
            style={{ marginBottom: 0 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-rose-300/20">
              <h3 className="text-lg font-semibold text-rose-100">Comments</h3>
              <div className="flex items-center gap-3">
                <div className="w-8 h-1 bg-gradient-to-r from-rose-400 to-amber-300 rounded-full"></div>
                <button
                  onClick={closeComments}
                  className="p-1.5 rounded-full text-rose-200/70 hover:text-rose-100 hover:bg-rose-400/10 transition-all duration-200"
                  aria-label="Close comments"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Comments area */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-3">
              {comments.length === 0 ? (
                <div className="text-center text-rose-200/60 py-8">
                  <FiMessageCircle size={48} className="mx-auto mb-3 text-rose-300/50" />
                  <p className="text-lg font-medium text-rose-100">No comments yet</p>
                  <p className="text-sm text-rose-200/60">Be the first to share your thoughts</p>
                </div>
              ) : (
                comments.map((c, idx) => (
                  <div key={`${c.anon_id}-${c.created_at}-${idx}`} className="bg-zinc-900/50 backdrop-blur-sm border border-rose-300/10 rounded-xl p-4 transition-all duration-200 hover:bg-zinc-900/70 hover:border-rose-300/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-r from-rose-400 via-rose-300 to-amber-300 flex items-center justify-center">
                          <span className="text-black text-xs font-bold">
                            {(c.anon_id || 'A')[0].toUpperCase()}
                          </span>
                        </div>
                        <span className="font-semibold text-rose-100 text-sm">@{c.anon_id || 'Anon'}</span>
                      </div>
                      <span className="text-rose-200/50 text-xs">{timeAgo(c.created_at)}</span>
                    </div>
                    <div className="text-rose-50 text-sm leading-relaxed whitespace-pre-line break-words ml-9">
                      {c.content}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Comment input */}
            <div className="flex items-center gap-3 p-3 bg-zinc-900/50 backdrop-blur-sm border border-rose-300/20 rounded-2xl">
              <input
                className="flex-1 bg-transparent text-rose-100 px-3 py-2 placeholder-rose-200/50 focus:outline-none focus:ring-0 border-none text-sm"
                style={{ boxShadow: 'none', outline: 'none' }}
                placeholder="Share your thoughts..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                autoFocus
                onKeyPress={e => e.key === 'Enter' && handleSendComment()}
              />
              <button 
                className="p-2 rounded-full bg-gradient-to-r from-rose-400 via-rose-300 to-amber-300 text-black hover:from-rose-500 hover:to-amber-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-rose-400/20" 
                onClick={handleSendComment}
                disabled={!commentText.trim()}
              >
                <FiSend size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    <div style={{ zIndex: 10, position: 'relative' }}>
      <Navigation />
    </div>
    </>
  );
};

export default Home;