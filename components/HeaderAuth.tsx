"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import Link from "next/link";

export default function HeaderAuth() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    // 최초 유저 정보
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data?.user?.email ?? null);
    });
    // 인증 상태 변경 감지
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUserEmail(session?.user?.email ?? null);
      }
    );
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUserEmail(null);
    window.location.reload();
  };

  return (
    <header className="w-full bg-white border-b min-h-[64px] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-green-600">aiharu</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsServicesDropdownOpen(true)}
              onMouseLeave={() => setIsServicesDropdownOpen(false)}
            >
              <button
                onClick={() =>
                  setIsServicesDropdownOpen(!isServicesDropdownOpen)
                }
                className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1"
              >
                서비스 소개
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isServicesDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isServicesDropdownOpen && (
                <div className="absolute top-full left-0 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  {/* Invisible bridge to prevent gap */}
                  <div className="h-2 bg-transparent"></div>
                  <div className="py-1">
                    <Link
                      href="/ai"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                    >
                      <span className="text-green-500">🤖</span>
                      AI하루
                    </Link>
                    <Link
                      href="https://hanip.aiharu.net"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-colors"
                    >
                      <span className="text-yellow-500">👨‍👩‍👧‍👦</span>
                      아이하루
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <Link
                      href="/about"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                      <span>📋</span>
                      전체 서비스 소개
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/creator"
              className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              제작자 소개
            </Link>
          </nav>

          {/* User Menu / Login */}
          <div className="flex items-center space-x-4">
            {userEmail ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 hidden sm:block">
                  {userEmail}
                </span>
                <Link
                  href="/history"
                  className="px-3 py-1 text-xs font-bold text-yellow-700 bg-yellow-50 border border-yellow-300 rounded hover:bg-yellow-100 transition-colors"
                >
                  분석 내역
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-300 rounded hover:bg-blue-100 transition-colors"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-bold !text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
                >
                  회원가입
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              {/* Services Section */}
              <div className="px-3 py-2">
                <div className="text-sm font-medium text-gray-500 mb-2">
                  서비스 소개
                </div>
                <div className="space-y-1 ml-2">
                  <Link
                    href="/ai"
                    className="flex items-center gap-2 text-gray-700 hover:text-green-600 block px-3 py-2 text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-green-500">🤖</span>
                    AI하루
                  </Link>
                  <Link
                    href="https://hanip.aiharu.net"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-700 hover:text-yellow-600 block px-3 py-2 text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-yellow-500">👨‍👩‍👧‍👦</span>
                    아이하루
                  </Link>
                  <Link
                    href="/about"
                    className="flex items-center gap-2 text-gray-700 hover:text-green-600 block px-3 py-2 text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>📋</span>
                    전체 서비스 소개
                  </Link>
                </div>
              </div>

              <div className="border-t border-gray-200 my-2"></div>

              <Link
                href="/creator"
                className="text-gray-700 hover:text-green-600 block px-3 py-2 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                제작자 소개
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
