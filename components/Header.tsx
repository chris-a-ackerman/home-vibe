'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { UserIcon, LogoutIcon } from './icons';
import { supabase } from '@/lib/supabase';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setShowDropdown(false);
    router.push('/signup');
  };

  const handleSignIn = () => {
    router.push('/signup');
  };

  return (
    <header className="bg-white border-b border-neutral-200 w-full">
      <div className="flex items-center justify-between h-[60px] px-[91px]">
        <div className="flex items-center">
          <h1 className="font-['Inter'] font-normal text-[30px] leading-[36px] text-neutral-950 tracking-[0.3955px]">
            HomeVibe
          </h1>
        </div>

        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-[36px] h-[36px] flex items-center justify-center rounded-[8px] hover:bg-neutral-50 transition-colors"
            >
              <UserIcon />
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-[44px] w-[256px] bg-white border border-[rgba(0,0,0,0.1)] rounded-[14px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] p-4 flex flex-col gap-9 z-50">
                {/* User Info */}
                <div className="border-b border-[rgba(0,0,0,0.1)] pb-4">
                  <p className="font-['Inter'] font-normal text-[14px] leading-[20px] text-neutral-950 tracking-[-0.1504px] mb-1">
                    Signed in as
                  </p>
                  <p className="font-['Inter'] font-normal text-[16px] leading-[24px] text-neutral-950 tracking-[-0.3125px] truncate">
                    {user.email}
                  </p>
                </div>

                {/* Sign Out Button */}
                <button
                  onClick={handleSignOut}
                  className="h-[36px] rounded-[8px] flex items-center gap-3 px-3 hover:bg-neutral-50 transition-colors"
                >
                  <LogoutIcon />
                  <span className="font-['Inter'] font-medium text-[14px] leading-[20px] text-neutral-950 tracking-[-0.1504px]">
                    Sign Out
                  </span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={handleSignIn}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <UserIcon />
            <span className="font-['Inter'] font-medium text-[14px] leading-[20px] text-neutral-950 tracking-[-0.1504px]">
              Sign In
            </span>
          </button>
        )}
      </div>
    </header>
  );
}
