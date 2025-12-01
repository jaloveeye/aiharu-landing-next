// 익명 사용자 ID 생성 및 관리

export function getOrCreateAnonymousId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  const STORAGE_KEY = "anonymous_user_id";
  const COOKIE_KEY = "anonymous_user_id";
  const EXPIRY_DAYS = 365; // 1년

  // 쿠키에서 확인
  const cookieId = getCookie(COOKIE_KEY);
  if (cookieId) {
    // 로컬 스토리지에도 저장 (동기화)
    localStorage.setItem(STORAGE_KEY, cookieId);
    return cookieId;
  }

  // 로컬 스토리지에서 확인
  const storedId = localStorage.getItem(STORAGE_KEY);
  if (storedId) {
    // 쿠키에도 저장 (동기화)
    setCookie(COOKIE_KEY, storedId, EXPIRY_DAYS);
    return storedId;
  }

  // 새 ID 생성
  const newId = generateAnonymousId();
  localStorage.setItem(STORAGE_KEY, newId);
  setCookie(COOKIE_KEY, newId, EXPIRY_DAYS);
  return newId;
}

function generateAnonymousId(): string {
  // 타임스탬프 + 랜덤 문자열
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  return `anon_${timestamp}_${random}`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}

function setCookie(name: string, value: string, days: number): void {
  if (typeof document === "undefined") return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

