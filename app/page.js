'use client';

import { useEffect, useRef } from 'react';
import { motion, animate } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

export default function SplashScreen() {
  const logoRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    document.body.classList.add('overflow-hidden');
    
    // Get geo info and store in localStorage
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

    // Generate and store anonymous ID if not exists
    const generateAndStoreAnonId = async () => {
      const existingAnonId = localStorage.getItem('anon_id');
      let anonId = existingAnonId;
      if (!existingAnonId) {
        anonId = uniqueNamesGenerator({
          dictionaries: [adjectives, colors, animals],
          separator: '-',
          length: 3
        });
        // Store in localStorage without expiry
        localStorage.setItem('anon_id', anonId);
      }
      // Always set geo info with anon_id
      const geo = await getGeoInfo();
      if (geo.ip) localStorage.setItem('ip', geo.ip);
      if (geo.city) localStorage.setItem('city', geo.city);
    };

    generateAndStoreAnonId();
    
    // Animate logo
    let logoAnimation;
    if (logoRef.current) {
      logoAnimation = animate(
        logoRef.current,
        { 
          opacity: [0, 1],
          scale: [0.95, 1.05, 1],
        },
        {
          duration: 1.2,
          ease: [0.16, 1, 0.3, 1],
        }
      );
    }

    // Redirect to home after 1500ms
    const redirectTimer = setTimeout(() => {
      router.push('/home');
    }, 1000);

    return () => {
      document.body.classList.remove('overflow-hidden');
      if (logoAnimation) {
        logoAnimation.stop();
      }
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#000000] overflow-hidden">
      <div className="relative z-10">
        <div className="relative">
          <Image
            src="/logo.png"
            alt="Confessly Logo"
            width={300}
            height={300}
            className="relative z-10 mx-auto drop-shadow-lg w-auto h-auto"
            priority
          />
        </div>
      </div>
    </div>
  );
}
