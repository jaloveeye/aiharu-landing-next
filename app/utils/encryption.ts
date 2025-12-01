import * as crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;

// 환경 변수에서 암호화 키 가져오기 (없으면 생성)
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error("ENCRYPTION_KEY 환경 변수가 설정되지 않았습니다.");
  }
  // 키가 32바이트가 되도록 해시
  return crypto.createHash("sha256").update(key).digest();
}

export function encrypt(text: string): string {
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    const tag = cipher.getAuthTag();

    // iv + tag + encrypted 데이터를 결합
    return iv.toString("hex") + ":" + tag.toString("hex") + ":" + encrypted;
  } catch (error) {
    console.error("암호화 오류:", error);
    throw new Error("데이터 암호화에 실패했습니다.");
  }
}

export function decrypt(encryptedData: string, throwOnError: boolean = true): string {
  try {
    // 데이터가 없거나 빈 문자열인 경우
    if (!encryptedData || typeof encryptedData !== 'string') {
      if (throwOnError) {
        throw new Error("암호화된 데이터가 없습니다.");
      }
      return encryptedData || '';
    }

    const key = getEncryptionKey();
    const parts = encryptedData.split(":");
    
    // 암호화 형식이 아닌 경우 (평문 데이터일 수 있음)
    if (parts.length !== 3) {
      if (throwOnError) {
        throw new Error("잘못된 암호화 데이터 형식입니다.");
      }
      // 평문 데이터로 간주하고 그대로 반환
      return encryptedData;
    }

    const iv = Buffer.from(parts[0], "hex");
    const tag = Buffer.from(parts[1], "hex");
    const encrypted = parts[2];

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("복호화 오류:", error);
    if (throwOnError) {
      throw new Error("데이터 복호화에 실패했습니다.");
    }
    // 복호화 실패 시 원본 데이터 반환 (평문일 수 있음)
    return encryptedData;
  }
}

