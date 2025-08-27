'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'ko' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 번역 데이터
const translations = {
  ko: {
    // 헤더
    'nav.services': '서비스 소개',
    'nav.creator': '제작자 소개',
    'nav.login': '로그인',
    'nav.signup': '회원가입',
    'nav.logout': '로그아웃',
    'nav.history': '분석 내역',
    
    // 메인 페이지
    'hero.title': '아이하루',
    'hero.subtitle': 'AI와 아이의 하루를 더 똑똑하고 따뜻하게',
    'hero.description': '아이하루는 AI와 아이의 하루를 모두 담아, 기술과 감성이 어우러진 특별한 일상을 선물합니다.',
    'hero.cta': '지금 시작하기',
    'features.title': '아이하루의 특별한 기능들',
    'features.ai.title': 'AI하루',
    'features.ai.description': '매일 하나씩, 쉽게 배우는 AI',
    'features.child.title': '아이하루',
    'features.child.description': '부모와 아이가 함께 만드는 습관',
    'features.meal.title': 'AI 식단 분석',
    'features.meal.description': 'AI가 분석하는 맞춤형 영양 정보',
    'cta.title': '더 똑똑하고 따뜻한 하루를 만들어가요',
    'footer.made': 'Made with ❤️ by 아이하루',
    
    // 서비스 소개 페이지
    'about.title': '아이하루 서비스 소개',
    'about.description': '아이하루는 AI와 아이의 하루를 모두 담아, 기술과 감성이 어우러진 특별한 일상을 선물하는 서비스입니다.',
    'about.ai.title': 'AI하루',
    'about.ai.subtitle': '매일 하나씩, 쉽게 배우는 AI',
    'about.ai.description': 'AI하루는 복잡한 AI 기술을 매일 한 문장으로 쉽게 배울 수 있도록 도와줍니다. 프롬프트 작성법, AI 도구 활용법, 실생활 적용 팁까지!',
    'about.ai.features': '주요 기능',
    'about.ai.feature1': '매일 업데이트되는 AI 지식 콘텐츠',
    'about.ai.feature2': '실용적인 프롬프트 예제 모음',
    'about.ai.feature3': 'AI 도구 추천 및 활용 가이드',
    'about.ai.feature4': '일상생활에 적용할 수 있는 AI 팁',
    'about.ai.cta': 'AI하루 시작하기',
    'about.ai.emoji': 'AI와 함께하는 똑똑한 하루',
    
    'about.child.title': '아이하루',
    'about.child.subtitle': '부모와 아이가 함께 만드는 습관',
    'about.child.description': '아이하루는 부모와 아이가 함께 목표를 세우고, 매일의 습관을 체크하며 성장하는 과정을 지원합니다.',
    'about.child.features': '주요 기능',
    'about.child.feature1': '부모-아이 함께하는 목표 설정',
    'about.child.feature2': '매일 습관 체크 및 달성률 확인',
    'about.child.feature3': '부모의 피드백과 칭찬 시스템',
    'about.child.feature4': '포인트 기반 보상 시스템',
    'about.child.feature5': '주간/월간 성장 리포트',
    'about.child.cta': '아이하루 시작하기',
    'about.child.emoji': '가족과 함께하는 따뜻한 하루',
    
    'about.meal.title': 'AI 식단 분석',
    'about.meal.subtitle': 'AI가 분석하는 맞춤형 영양 정보',
    'about.meal.description': '식단 사진을 업로드하면 AI가 자동으로 분석하여 영양 정보와 건강한 식단을 추천해드립니다.',
    'about.meal.features': '주요 기능',
    'about.meal.feature1': '사진 기반 자동 식단 분석',
    'about.meal.feature2': '11가지 영양소 상세 분석',
    'about.meal.feature3': '개인 맞춤형 식단 추천',
    'about.meal.feature4': '영양소 섭취 트렌드 분석',
    'about.meal.feature5': '건강한 식습관 가이드',
    'about.meal.cta': '식단 분석 시작하기',
    'about.meal.emoji': 'AI가 분석하는 건강한 식단',
    
    'about.characteristics.title': '아이하루만의 특별한 특징',
    'about.characteristic1.title': '목적 지향적',
    'about.characteristic1.description': 'AI 학습과 습관 형성이라는 명확한 목표를 가지고 체계적으로 설계된 서비스입니다.',
    'about.characteristic2.title': '가족 중심',
    'about.characteristic2.description': '부모와 아이가 함께 성장할 수 있도록 가족 중심의 서비스로 설계되었습니다.',
    'about.characteristic3.title': 'AI 기반',
    'about.characteristic3.description': '최신 AI 기술을 활용하여 개인화된 경험을 제공합니다.',
    'about.characteristic4.title': '데이터 기반',
    'about.characteristic4.description': '사용자의 데이터를 분석하여 더 나은 서비스를 제공합니다.',
    'about.characteristic5.title': '안전한',
    'about.characteristic5.description': '개인정보 보호를 최우선으로 하며 안전한 서비스를 제공합니다.',
    'about.characteristic6.title': '무료 서비스',
    'about.characteristic6.description': '모든 기능을 무료로 제공하여 누구나 쉽게 이용할 수 있습니다.',
    
    'about.cta.title': '지금 바로 시작해보세요!',
    'about.cta.description': '아이하루와 함께 더 똑똑하고 따뜻한 하루를 만들어가요.',
    'about.cta.signup': '무료 회원가입',
    'about.cta.login': '로그인하기',
    
    // 제작자 소개 페이지
    'creator.title': '제작자 소개',
    'creator.description': '아이하루를 만든 개발자 김형진의 이야기를 들어보세요.',
    'creator.intro': '안녕하세요! 아이하루의 제작자 김형진입니다. 17년간의 소프트웨어 개발 경험을 바탕으로, AI 기술과 가족의 성장을 결합한 의미 있는 서비스를 만들고 싶어서 아이하루 프로젝트를 시작하게 되었습니다.',
    'creator.title.text': '개발을 좋아하는 컴퓨터 과학자',
    'creator.motivation.title': '아이하루를 만든 이유',
    'creator.motivation.description': '컴퓨터 비전을 전공했던 저는 AI 기술의 발전을 지켜보며, 이를 일상생활에 어떻게 적용할 수 있을지 항상 고민해왔습니다. 특히 육아 휴직 중에 아이와 함께 성장하는 과정에서, AI 기술이 가족의 일상에 어떤 도움을 줄 수 있을지 생각하게 되었습니다.',
    'creator.contact.title': '함께 성장해요!',
    'creator.contact.description': '여러분의 피드백과 제안은 아이하루를 더 나은 서비스로 만들어갑니다.',
    'creator.contact.cta': '언제든지 연락주세요!',
    
    // 공통
    'back.home': '← 홈으로 돌아가기',
    'language.ko': '한국어',
    'language.en': 'English',
  },
  en: {
    // Header
    'nav.services': 'Services',
    'nav.creator': 'Creator',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    'nav.logout': 'Logout',
    'nav.history': 'History',
    
    // Main page
    'hero.title': 'AIHARU',
    'hero.subtitle': 'Making AI and children\'s daily lives smarter and warmer',
    'hero.description': 'AIHARU embraces both AI and children\'s daily lives, offering a special daily experience where technology and emotion come together.',
    'hero.cta': 'Get Started',
    'features.title': 'AIHARU\'s Special Features',
    'features.ai.title': 'AI Daily',
    'features.ai.description': 'Learn AI easily, one thing a day',
    'features.child.title': 'Child Daily',
    'features.child.description': 'Habits made together by parents and children',
    'features.meal.title': 'AI Meal Analysis',
    'features.meal.description': 'AI-powered personalized nutrition information',
    'cta.title': 'Create a smarter and warmer day together',
    'footer.made': 'Made with ❤️ by AIHARU',
    
    // About page
    'about.title': 'AIHARU Service Introduction',
    'about.description': 'AIHARU is a service that embraces both AI and children\'s daily lives, offering a special daily experience where technology and emotion come together.',
    'about.ai.title': 'AI Daily',
    'about.ai.subtitle': 'Learn AI easily, one thing a day',
    'about.ai.description': 'AI Daily helps you learn complex AI technology easily with one sentence a day. From prompt writing to AI tool utilization and practical application tips!',
    'about.ai.features': 'Key Features',
    'about.ai.feature1': 'Daily updated AI knowledge content',
    'about.ai.feature2': 'Practical prompt examples collection',
    'about.ai.feature3': 'AI tool recommendations and usage guides',
    'about.ai.feature4': 'AI tips applicable to daily life',
    'about.ai.cta': 'Start AI Daily',
    'about.ai.emoji': 'Smart day with AI',
    
    'about.child.title': 'Child Daily',
    'about.child.subtitle': 'Habits made together by parents and children',
    'about.child.description': 'Child Daily supports the process of parents and children setting goals together, checking daily habits, and growing together.',
    'about.child.features': 'Key Features',
    'about.child.feature1': 'Parent-child goal setting together',
    'about.child.feature2': 'Daily habit check and achievement rate',
    'about.child.feature3': 'Parent feedback and praise system',
    'about.child.feature4': 'Point-based reward system',
    'about.child.feature5': 'Weekly/monthly growth reports',
    'about.child.cta': 'Start Child Daily',
    'about.child.emoji': 'Warm day with family',
    
    'about.meal.title': 'AI Meal Analysis',
    'about.meal.subtitle': 'AI-powered personalized nutrition information',
    'about.meal.description': 'Upload a meal photo and AI automatically analyzes it to provide nutrition information and healthy meal recommendations.',
    'about.meal.features': 'Key Features',
    'about.meal.feature1': 'Photo-based automatic meal analysis',
    'about.meal.feature2': 'Detailed analysis of 11 nutrients',
    'about.meal.feature3': 'Personalized meal recommendations',
    'about.meal.feature4': 'Nutrient intake trend analysis',
    'about.meal.feature5': 'Healthy eating habit guides',
    'about.meal.cta': 'Start Meal Analysis',
    'about.meal.emoji': 'Healthy meals analyzed by AI',
    
    'about.characteristics.title': 'AIHARU\'s Special Characteristics',
    'about.characteristic1.title': 'Goal-Oriented',
    'about.characteristic1.description': 'A service systematically designed with clear goals of AI learning and habit formation.',
    'about.characteristic2.title': 'Family-Centered',
    'about.characteristic2.description': 'Designed as a family-centered service so parents and children can grow together.',
    'about.characteristic3.title': 'AI-Based',
    'about.characteristic3.description': 'Provides personalized experiences using the latest AI technology.',
    'about.characteristic4.title': 'Data-Driven',
    'about.characteristic4.description': 'Analyzes user data to provide better services.',
    'about.characteristic5.title': 'Safe',
    'about.characteristic5.description': 'Prioritizes personal information protection and provides safe services.',
    'about.characteristic6.title': 'Free Service',
    'about.characteristic6.description': 'All features are provided free of charge so anyone can easily use them.',
    
    'about.cta.title': 'Start Now!',
    'about.cta.description': 'Create a smarter and warmer day with AIHARU.',
    'about.cta.signup': 'Free Sign Up',
    'about.cta.login': 'Login',
    
    // Creator page
    'creator.title': 'Creator Introduction',
    'creator.description': 'Meet Kim Hyung Jin, the developer who created AIHARU.',
    'creator.intro': 'Hello! I\'m Kim Hyung Jin, the creator of AIHARU. Based on 17 years of software development experience, I wanted to create a meaningful service that combines AI technology with family growth, which led me to start the AIHARU project.',
    'creator.title.text': 'Computer Scientist who loves development',
    'creator.motivation.title': 'Why I Created AIHARU',
    'creator.motivation.description': 'As someone who majored in Computer Vision, I have always contemplated how AI technology could be applied to daily life while watching its development. Especially during parental leave, while growing together with my child, I began to think about how AI technology could help in family daily life.',
    'creator.contact.title': 'Let\'s Grow Together!',
    'creator.contact.description': 'Your feedback and suggestions help make AIHARU a better service.',
    'creator.contact.cta': 'Feel free to contact us anytime!',
    
    // Common
    'back.home': '← Back to Home',
    'language.ko': '한국어',
    'language.en': 'English',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ko');

  const t = (key: string): string => {
    return (translations[language] as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
