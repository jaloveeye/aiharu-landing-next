"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/app/contexts/LanguageContext";
import Button from "@/components/ui/Button";

export default function HeaderAuth() {
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <header className="w-full bg-white dark:bg-gray-950 border-b min-h-[64px] sticky top-0 z-50 backdrop-blur-sm bg-opacity-95" style={{ borderColor: 'var(--color-outline)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold" style={{ color: '#000000' }}>
                {t("hero.title")}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/about"
              className={`relative px-2 py-2 text-sm font-medium transition-colors ${
                pathname === "/about"
                  ? "font-semibold"
                  : ""
              }`}
              style={pathname === "/about" 
                ? { 
                    color: '#000000',
                    fontWeight: '600',
                  }
                : { color: '#000000' }
              }
              onMouseEnter={(e) => {
                if (pathname !== "/about") {
                  e.currentTarget.style.color = '#000000';
                }
              }}
              onMouseLeave={(e) => {
                if (pathname !== "/about") {
                  e.currentTarget.style.color = '#000000';
                }
              }}
            >
              {t("nav.services")}
              {pathname === "/about" && (
                <span 
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full pointer-events-none"
                  style={{ backgroundColor: '#000000' }}
                />
              )}
            </Link>
            <Link
              href="/creator"
              className={`relative px-2 py-2 text-sm font-medium transition-colors ${
                pathname === "/creator"
                  ? "font-semibold"
                  : ""
              }`}
              style={pathname === "/creator" 
                ? { color: '#000000', fontWeight: '600' }
                : { color: '#000000' }
              }
              onMouseEnter={(e) => {
                if (pathname !== "/creator") {
                  e.currentTarget.style.color = '#000000';
                }
              }}
              onMouseLeave={(e) => {
                if (pathname !== "/creator") {
                  e.currentTarget.style.color = '#000000';
                }
              }}
            >
              {t("nav.creator")}
              {pathname === "/creator" && (
                <span 
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full pointer-events-none"
                  style={{ backgroundColor: '#000000' }}
                />
              )}
            </Link>
          </nav>

          {/* User Menu / Login - UI 제거됨, 기능은 유지 */}
          <div className="flex items-center space-x-4">
            {/* 로그인 관련 UI는 제거했지만 기능은 그대로 유지 */}
            {/* {userEmail ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 hidden sm:block">
                  {userEmail}
                </span>
                <Link
                  href="/history"
                  className="px-3 py-1 text-xs font-bold text-yellow-700 bg-yellow-50 border border-yellow-300 rounded hover:bg-yellow-100 transition-colors"
                >
                  {t("nav.history")}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-300 rounded hover:bg-blue-100 transition-colors"
                >
                  {t("nav.logout")}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button as="a" href="/signup" variant="primary" size="md">
                  구글로 시작하기
                </Button>
              </div>
            )} */}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md focus:outline-none transition-colors"
              style={{ 
                color: 'var(--color-on-surface-variant)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-on-surface)';
                e.currentTarget.style.backgroundColor = 'var(--color-surface)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-on-surface-variant)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
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
          <div className="md:hidden border-t" style={{ borderColor: 'var(--color-outline)' }}>
            <div className="px-4 py-3 space-y-1">
              <Link
                href="/about"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  pathname === "/about" ? "font-semibold" : ""
                }`}
                style={pathname === "/about"
                  ? {
                      color: '#FFFFFF',
                      fontWeight: '600',
                      backgroundColor: '#000000'
                    }
                  : {
                      color: '#000000',
                    }
                }
                onMouseEnter={(e) => {
                  if (pathname !== "/about") {
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.backgroundColor = '#000000';
                  }
                }}
                onMouseLeave={(e) => {
                  if (pathname !== "/about") {
                    e.currentTarget.style.color = '#000000';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                {t("nav.services")}
              </Link>
              <Link
                href="/creator"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  pathname === "/creator" ? "font-semibold" : ""
                }`}
                style={pathname === "/creator"
                  ? {
                      color: '#FFFFFF',
                      fontWeight: '600',
                      backgroundColor: '#000000'
                    }
                  : {
                      color: '#000000',
                    }
                }
                onMouseEnter={(e) => {
                  if (pathname !== "/creator") {
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.backgroundColor = '#000000';
                  }
                }}
                onMouseLeave={(e) => {
                  if (pathname !== "/creator") {
                    e.currentTarget.style.color = '#000000';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                {t("nav.creator")}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
