export function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `[환경변수 누락] ${key}가 설정되어 있지 않습니다. .env 파일을 확인하세요.`
    );
  }
  return value;
}
