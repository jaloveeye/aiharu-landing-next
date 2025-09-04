"use client";

import Link from "next/link";
import Image from "next/image";
import { Title, Body } from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { createClient } from "@/app/utils/supabase/client";
import { useEffect, useState } from "react";

export default function HomeContent() {
  const { t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // iHaru 시작: 로그인 시 대시보드로, 아니면 로그인 페이지로
  const handleStartIharu = () => {
    if (user) {
      router.push("/iharu");
    } else {
      router.push("/login");
    }
  };

  // AI 식단 분석 시작: hanip 새창 (기존 동작 유지)
  const handleStartMeal = () => {
    try {
      const newWindow = window.open("https://hanip.aiharu.net", "_blank");
      if (newWindow && user) {
        setTimeout(() => {
          newWindow.postMessage(
            {
              type: "AUTH_DATA",
              user: {
                id: user.id,
                email: user.email,
                name: user.user_metadata?.full_name || user.user_metadata?.name,
                avatar: user.user_metadata?.avatar_url,
              },
            },
            "https://hanip.aiharu.net"
          );
        }, 1000);
      }
    } catch (error) {
      console.error("Meal start error:", error);
      window.open("https://hanip.aiharu.net", "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-screen px-4 py-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <main className="flex flex-col items-center gap-8 max-w-4xl relative z-10">
          <div className="animate-fade-in-scale">
            <Image
              src="/happy-family.png"
              alt="행복한 가족 일러스트"
              width={400}
              height={280}
              className="mb-4 rounded-2xl shadow-strong hover-lift"
              priority
              aria-label="행복한 가족 일러스트"
            />
          </div>

          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <Title className="text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent whitespace-pre-line">
              {t("hero.subtitle")}
            </Title>
          </div>

          <div
            className="flex flex-col gap-4 text-center max-w-2xl animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <Body className="font-medium text-lg text-neutral-700">
              {t("features.ai.title")}는 매일 하나의{" "}
              <span className="text-primary font-semibold">AI</span>를 배웁니다.
            </Body>
            <Body className="font-medium text-lg text-neutral-700">
              {t("features.child.title")}는 매일 하나의{" "}
              <span className="text-secondary font-semibold">습관</span>을
              만듭니다.
            </Body>
          </div>

          <Body
            className="text-center text-neutral-600 max-w-2xl animate-fade-in-up whitespace-pre-line"
            style={{ animationDelay: "0.6s" }}
          >
            {t("hero.description")}
          </Body>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 mt-8 animate-fade-in-up"
            style={{ animationDelay: "0.8s" }}
          >
            <Button
              onClick={handleStartIharu}
              size="lg"
              className="bg-primary-gradient"
              disabled={loading}
            >
              {loading ? "로딩 중..." : t("hero.cta")}
            </Button>
          </div>
        </main>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-neutral-900 mb-16 animate-fade-in-up">
            {t("features.title")}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {/* AI하루 */}
            <div
              className="group animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="bg-white rounded-2xl shadow-soft p-8 text-center hover-lift border border-neutral-200/50 h-full flex flex-col">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  🤖
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">
                  {t("features.ai.title")}
                </h3>
                <p className="text-neutral-600 mb-8 leading-relaxed">
                  {t("features.ai.description")}
                </p>
                <Button
                  as="a"
                  href="/ai"
                  variant="primary"
                  size="md"
                  className="mt-auto"
                >
                  {t("features.ai.title")} 시작하기
                </Button>
              </div>
            </div>

            {/* 아이하루 */}
            <div
              className="group animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="bg-white rounded-2xl shadow-soft p-8 text-center hover-lift border border-neutral-200/50 h-full flex flex-col">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  👨‍👩‍👧‍👦
                </div>
                <h3 className="text-2xl font-bold text-secondary mb-4">
                  {t("features.child.title")}
                </h3>
                <p className="text-neutral-600 mb-8 leading-relaxed">
                  {t("features.child.description")}
                </p>
                <Button
                  as="a"
                  href="/iharu"
                  variant="secondary"
                  size="md"
                  className="mt-auto cursor-pointer"
                >
                  {t("features.child.title")} 시작하기
                </Button>
              </div>
            </div>

            {/* AI 식단 분석 */}
            <div
              className="group animate-fade-in-up"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="bg-white rounded-2xl shadow-soft p-8 text-center hover-lift border border-neutral-200/50 h-full flex flex-col">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  🍽️
                </div>
                <h3 className="text-2xl font-bold text-accent mb-4">
                  {t("features.meal.title")}
                </h3>
                <p className="text-neutral-600 mb-8 leading-relaxed">
                  {t("features.meal.description")}
                </p>
                <Button
                  onClick={handleStartMeal}
                  variant="accent"
                  size="md"
                  disabled={loading}
                  className="mt-auto cursor-pointer !important"
                  style={{ cursor: "pointer !important" }}
                >
                  {loading
                    ? "로딩 중..."
                    : `${t("features.meal.title")} 시작하기`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-12 animate-fade-in-up">
            <h2 className="text-4xl font-bold mb-6 text-neutral-900">
              {t("cta.title")}
            </h2>
            <p className="text-xl mb-10 text-neutral-700 leading-relaxed">
              {t("hero.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button as="a" href="/about" variant="primary" size="lg">
                {t("nav.services")}
              </Button>
              <Button as="a" href="/creator" variant="outline" size="lg">
                {t("nav.creator")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 text-center border-t border-neutral-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center gap-4 text-neutral-600">
            <span className="text-lg">{t("footer.made")}</span>
            <div className="flex gap-6 mt-2">
              <Link
                href="/privacy"
                className="text-neutral-500 hover:text-neutral-700 transition-colors duration-200"
              >
                개인정보 취급방침
              </Link>
              <span className="text-neutral-400">|</span>
              <Link
                href="/withdraw"
                className="text-neutral-500 hover:text-neutral-700 transition-colors duration-200"
              >
                회원 탈퇴
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
