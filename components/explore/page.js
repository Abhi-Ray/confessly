"use client"
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { FiHeart, FiMessageCircle, FiFlag, FiSend, FiTrendingUp, FiMapPin, FiShuffle } from 'react-icons/fi';
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
  <div className="bg-black border border-rose-200/10 rounded-2xl p-4 mb-4 shadow-sm relative">
    <button
      className={`absolute top-3 right-3 transition ${reported ? 'text-red-500' : 'text-rose-400/60 hover:text-rose-500'}`}
      title="Report"
      onClick={() => onReport(confession.id)}
      aria-label="Report"
    >
      {reported ? <FaFlag size={18} /> : <FiFlag size={18} />}
    </button>
    <div className="text-base mb-2 whitespace-pre-line break-words">{confession.content}</div>
    <div className="flex items-center justify-between text-xs text-rose-200/60 mt-2">
      <span>@{confession.anon_id || 'Anonymous'}</span>
      <span>{timeAgo(confession.created_at)}</span>
    </div>
    <div className="flex items-center gap-6 mt-3">
      <button
        className={`flex items-center gap-1 transition ${liked ? 'text-red-500' : 'text-rose-400/80 hover:text-rose-500'}`}
        onClick={() => onLike(confession.id)}
        aria-label="Like"
      >
        {liked ? <AiFillHeart /> : <FiHeart />}
        <span className="text-sm">{confession.likes_count}</span>
      </button>
      <div className="flex items-center gap-1 text-rose-400/60 cursor-pointer" onClick={() => onComment(confession.id)}>
        <FiMessageCircle />
        <span className="text-sm">{confession.comments_count}</span>
      </div>
    </div>
  </div>
);

const PAGE_SIZE = 30;

const Explore = () => {
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
  const [tab, setTab] = useState('trending'); // 'trending' | 'near' | 'random'

  const getApiEndpoint = (tab) => {
    if (tab === 'trending') return '/api/trending';
    if (tab === 'near') {
      if (typeof window !== 'undefined') {
        const city = localStorage.getItem('city');
        if (city) return `/api/near?city=${encodeURIComponent(city)}`;
      }
      return '/api/near';
    }
    if (tab === 'random') return '/api/random';
    return '/api/post';
  };

  const fetchConfessions = useCallback(async (pageNum, currentTab = tab) => {
    setLoading(true);
    try {
      const endpoint = getApiEndpoint(currentTab);
      const res = await fetch(endpoint);
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
  }, [tab]);

  useEffect(() => {
    setPage(1);
    setConfessions([]);
    setHasMore(true);
    fetchConfessions(1, tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  useEffect(() => {
    if (page === 1) return; // Already fetched in tab effect
    fetchConfessions(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

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
    // Fetch comments for this confession from new API
    const res = await fetch(`/api/comment?confession_id=${confessionId}`);
    const data = await res.json();
    setComments(data.comments.reverse() || []);
  };

  const closeComments = () => {
    setOpenCommentId(null);
    setCommentText('');
    setComments([]);
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
    fetchConfessions(1, tab);
    setPage(1);
    setCommentText('');
  };

  return (
    <> 
    <div className="min-h-screen bg-black text-white flex flex-col items-center pt-2 pb-20">
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
        {/* Tabs */}
        <div className="flex justify-center mb-4 gap-2">
          {['trending', 'near', 'random'].map((t) => {
            let Icon;
            if (t === 'trending') Icon = FiTrendingUp;
            else if (t === 'near') Icon = FiMapPin;
            else if (t === 'random') Icon = FiShuffle;
            return (
              <button
                key={t}
                className={`px-4 py-1 rounded-full text-sm font-semibold transition border border-rose-400/30 focus:outline-none ${tab === t ? 'bg-rose-500 text-white' : 'bg-black text-rose-300 hover:bg-rose-900/30'}`}
                onClick={() => {
                  if (tab !== t) {
                    setTab(t);
                    setPage(1);
                    setConfessions([]);
                    setHasMore(true);
                  }
                }}
              >
                <span className="inline-flex items-center gap-1">
                  <Icon size={16} />
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </span>
              </button>
            );
          })}
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
        {loading && <div className="text-center text-rose-400/60 py-4">Loading...</div>}
        <div ref={loader} />
        {!hasMore && confessions.length > 0 && (
          <div className="text-center text-rose-400/40 py-4">No more confessions.</div>
        )}
      </main>
      {openCommentId && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black bg-opacity-40"
          onClick={closeComments}
        >
          <div
            className="w-full max-w-md h-[90vh] bg-white/10 backdrop-blur-lg rounded-t-2xl p-4 animate-slideUp flex flex-col shadow-xl"
            style={{ marginBottom: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex-1 overflow-y-auto mb-3">
              {comments.length === 0 ? (
                <div className="text-center text-rose-400/60 py-4">No comments yet.</div>
              ) : (
                <div className="flex flex-col gap-3">
                  {comments.map((c, idx) => (
                    <div key={`${c.anon_id}-${c.created_at}-${idx}`} className="px-1 py-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-rose-200 text-xs">@{c.anon_id || 'Anon'}</span>
                        <span className="text-rose-200/40 text-xs">{timeAgo(c.created_at)}</span>
                      </div>
                      <div className="text-rose-100 text-xs whitespace-pre-line break-words">{c.content}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center py-1 bg-white/10 rounded-lg px-2">
              <input
                className="flex-1 bg-transparent text-white px-3 py-2 rounded-lg placeholder-rose-200/60 focus:outline-none focus:ring-0 border-none shadow-none"
                style={{ boxShadow: 'none', outline: 'none' }}
                placeholder="Add a comment..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                autoFocus
              />
              <button className="ml-2 text-rose-400 hover:text-rose-300 transition flex items-center justify-center" onClick={handleSendComment}>
                <FiSend size={22} />
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

export default Explore;


