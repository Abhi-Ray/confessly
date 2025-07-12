'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiAlertCircle, FiSend, FiFeather } from 'react-icons/fi';
import Image from 'next/image'

export default function PostForm() {
  const [content, setContent] = useState('');
  const [anonId, setAnonId] = useState('');
  const [error, setError] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedAnonId = localStorage.getItem('anon_id');
    if (storedAnonId) {
      setAnonId(storedAnonId);
    }
  }, []);

  const handleContentChange = (e) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/);
    setWordCount(words.length);
    
    if (words.length <= 100) {
      setContent(text);
      setError('');
    } else {
      setError('Content cannot exceed 100 words');
    }
  };

  const getGeoInfo = async () => {
    try {
      const res = await fetch('https://ipinfo.io/json?token=e043c7cd988031');
      if (!res.ok) return {};
      const data = await res.json();
      return {
        ip: data.ip,
        city: data.city,
      };
    } catch {
      return {};
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Please enter some content');
      return;
    }

    setIsSubmitting(true);
    try {
      const geo = await getGeoInfo();
      const response = await fetch('/api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          anon_id: anonId,
          ip: geo.ip || '',
          city: geo.city || '',
        }),
      });

      if (response.ok) {
        router.push('/home');
      } else {
        setError('Failed to create confession');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center pt-2 pb-20">
      {/* Header */}
      <div className="flex justify-center mb-6">
        <Image
          src="/head.png"
          alt="Confessly Head"
          width={160}
          height={160}
          className="w-36 h-16 object-contain"
          priority
        />
      </div>

      {/* Main content */}
      <main className="w-full max-w-md px-2">
        <div className="bg-black backdrop-blur-sm border border-rose-300/10 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:shadow-rose-400/10 transition-all duration-300 hover:border-rose-300/20 relative group">
          
          {/* Title section */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-rose-300 via-rose-200 to-amber-200 flex items-center justify-center">
                <FiFeather className="w-5 h-5 text-black" />
              </div>
            </div>
            <h1 className="text-2xl font-semibold text-rose-100 mb-2">
              Share Your Secret
            </h1>
            <p className="text-rose-200/70 text-sm">
              Your thoughts are safe here
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Textarea */}
            <div className="relative">
              <textarea
                value={content}
                onChange={handleContentChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="What's weighing on your mind?"
                className={`w-full h-32 bg-zinc-900/50 backdrop-blur-sm border border-rose-300/10 rounded-xl p-4 text-rose-50 placeholder-rose-200/50 focus:outline-none focus:ring-0 focus:border-rose-300/30 transition-all duration-300 resize-none text-base leading-relaxed ${
                  isFocused ? 'border-rose-300/30 bg-zinc-900/70' : 'hover:border-rose-300/20'
                }`}
                style={{ boxShadow: 'none', outline: 'none' }}
              />
              
              {/* Word count */}
              <div className="absolute bottom-3 right-3">
                <div className={`text-xs font-medium px-2 py-1 rounded-full transition-colors ${
                  wordCount > 80 ? 'bg-red-500/20 text-red-400' : 
                  wordCount > 50 ? 'bg-amber-400/20 text-amber-300' : 
                  'bg-rose-300/20 text-rose-200/70'
                }`}>
                  {wordCount}/100
                </div>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center space-x-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                <FiAlertCircle className="flex-shrink-0 w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            {/* Anonymous ID display */}
            <div className="flex items-center justify-between text-sm text-rose-200/70">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-rose-300 via-rose-200 to-amber-200 flex items-center justify-center">
                  <span className="text-black text-xs font-bold">
                    {(anonId || 'A')[0].toUpperCase()}
                  </span>
                </div>
                <span className="font-medium">@{anonId || 'Anonymous'}</span>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-gradient-to-r from-rose-300 via-rose-200 to-amber-200 text-black font-semibold hover:from-rose-400 hover:to-amber-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-rose-300/20 text-base"
            >
              <span>{isSubmitting ? 'Sharing...' : 'Share Confession'}</span>
              <FiSend className={`w-4 h-4 ${isSubmitting ? 'opacity-50' : ''}`} />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}