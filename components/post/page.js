'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiAlertCircle, FiSend } from 'react-icons/fi';
import Image from 'next/image'

export default function PostForm() {
  const [content, setContent] = useState('');
  const [anonId, setAnonId] = useState('');
  const [error, setError] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      const res = await fetch('https://ipinfo.io/json?token=e043c7cd988031'); // Get a free token from ipinfo.io
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
      // Fetch geo info before posting
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
    <div>
      <div className="flex justify-center mt-2 mb-4 relative z-20">
        <Image
          src="/head.png"
          alt="Confessly Head"
          width={160}
          height={160}
          className="w-36 h-16 object-contain"
          priority
        />
      </div>
      <div className="fixed inset-0 flex items-center justify-center bg-black overflow-hidden">
        <div className="w-full max-w-2xl relative z-10 px-4">
          <div className="bg-black/40 border border-rose-200/10 rounded-3xl p-8 shadow-2xl shadow-rose-500/5">
            <h1 
              className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-600 mb-8 text-center"
            >
              Your secret is safe here
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative group">
                <textarea
                  value={content}
                  onChange={handleContentChange}
                  placeholder="What's on your mind?"
                  className="w-full h-40 bg-black/30 border border-rose-200/10 rounded-2xl p-4 text-white placeholder-rose-400/30 focus:outline-none focus:ring-2 focus:ring-rose-500/30 transition-all duration-300 resize-none group-hover:border-rose-200/20"
                />
                <div className="absolute bottom-4 right-4 text-rose-400/50 text-sm font-medium">
                  {wordCount}/100
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-rose-400 text-sm bg-rose-500/10 p-3 rounded-xl">
                  <FiAlertCircle className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="text-sm text-rose-200/50 font-medium">
                Posting as {anonId || 'Anonymous'}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-4 rounded-2xl font-semibold hover:from-rose-600 hover:to-rose-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <span>{isSubmitting ? 'Posting...' : 'Post Confession'}</span>
                <FiSend />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
