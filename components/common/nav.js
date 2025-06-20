"use client";

import { useRouter, usePathname } from 'next/navigation';
import { MdHome, MdAddCircle, MdExplore } from 'react-icons/md';
import { FiHome, FiPlusCircle, FiCompass } from 'react-icons/fi';

const Nav = () => {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Home',
      path: '/home',
      icon: FiHome,
      activeIcon: MdHome,
    },
    {
      name: 'Post',
      path: '/post',
      icon: FiPlusCircle,
      activeIcon: MdAddCircle,
      isCenter: true,
    },
    {
      name: 'Explore',
      path: '/explore',
      icon: FiCompass,
      activeIcon: MdExplore,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-transparent backdrop-blur-md rounded-t-2xl">
      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-around px-2 py-2 pt-6">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const IconComponent = isActive ? item.activeIcon : item.icon;
            
            if (!IconComponent) {
              console.error(`Icon component is undefined for ${item.name}`);
              return null;
            }

            return (
              <button
                key={item.name}
                onClick={() => router.push(item.path)}
                className={`flex flex-col items-center justify-center w-full transition-all duration-200 ${
                  isActive 
                    ? 'text-[#B76E79]' 
                    : 'text-gray-500 hover:text-[#D4A5A5]'
                } ${item.isCenter ? 'transform -translate-y-4' : ''}`}
              >
                <div className={`backdrop-blur-md bg-white/5 border border-white/10 p-2 rounded-full transform hover:scale-110 transition-all duration-200 ${
                  item.isCenter 
                    ? 'p-3 bg-gradient-to-br from-[#B76E79]/20 via-[#D4A5A5]/20 to-[#E6C7C7]/20 rounded-[2rem]' 
                    : 'rounded-[1.5rem]'
                }`}>
                  <IconComponent className={`w-6 h-6 text-white drop-shadow-md`} />
                </div>
                <span className={`text-xs mt-1 ${isActive ? 'text-[#B76E79]' : 'text-gray-500'}`}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
