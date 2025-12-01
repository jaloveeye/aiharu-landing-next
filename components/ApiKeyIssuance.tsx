"use client";

import { useState, useEffect } from "react";
import { getOrCreateAnonymousId } from "@/app/utils/anonymous-id";

const API_BASE_URL = "https://connect-agent.aiharu.net";

interface ApiKey {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  expiresAt: string;
  rateLimitPerHour: number;
}

interface ApiKeyHistory {
  email: string;
  name: string;
  description: string;
  apiKey: string;
  createdAt: string;
}

export default function ApiKeyIssuance() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [apiKeyHistory, setApiKeyHistory] = useState<ApiKeyHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingKeys, setLoadingKeys] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // 히스토리만 불러오기 (API 키는 새로고침 시 표시하지 않음)
  useEffect(() => {
    loadApiKeys();
    loadApiKeyHistory();
  }, []);

  const loadApiKeyHistory = async () => {
    // 먼저 로컬 스토리지에서 로드
    try {
      const history = localStorage.getItem("apiKeyHistory");
      if (history) {
        setApiKeyHistory(JSON.parse(history));
      }
    } catch (err) {
      console.error("로컬 스토리지 히스토리 로드 실패:", err);
    }

    // Supabase에서도 조회 시도 (인증 여부와 관계없이, 익명 ID 포함)
    try {
      const anonymousId = getOrCreateAnonymousId();
      const response = await fetch(`/api/api-history/keys?anonymousId=${anonymousId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data && data.data.length > 0) {
          // Supabase 데이터를 로컬 형식으로 변환
          const supabaseHistory: ApiKeyHistory[] = data.data.map((item: any) => ({
            email: item.email,
            name: item.name,
            description: item.description || "",
            apiKey: item.api_key_preview || "***",
            createdAt: item.created_at,
          }));
          // Supabase 데이터와 로컬 데이터 병합 (중복 제거)
          const localHistory = localStorage.getItem("apiKeyHistory");
          const local: ApiKeyHistory[] = localHistory ? JSON.parse(localHistory) : [];
          const merged = [...supabaseHistory, ...local];
          // 중복 제거 (email + name 기준)
          const unique = merged.filter((item, index, self) =>
            index === self.findIndex((t) => t.email === item.email && t.name === item.name)
          );
          setApiKeyHistory(unique);
        }
      }
    } catch (err) {
      // 네트워크 오류 시 무시
      console.log("Supabase 히스토리 로드 실패 (로컬 스토리지만 사용)");
    }
  };

  const saveApiKeyHistory = async (historyItem: ApiKeyHistory) => {
    // 로컬 스토리지에 먼저 저장 (인증 여부와 관계없이)
    try {
      const existingHistory = localStorage.getItem("apiKeyHistory");
      const history: ApiKeyHistory[] = existingHistory ? JSON.parse(existingHistory) : [];
      history.unshift(historyItem);
      const limitedHistory = history.slice(0, 50);
      localStorage.setItem("apiKeyHistory", JSON.stringify(limitedHistory));
      setApiKeyHistory(limitedHistory);
    } catch (err) {
      console.error("로컬 스토리지 저장 실패:", err);
    }

    // Supabase에 저장 시도 (인증 여부와 관계없이, 익명 ID 포함)
    try {
      const anonymousId = getOrCreateAnonymousId();
      const response = await fetch("/api/api-history/keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...historyItem,
          anonymousId: anonymousId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log("Supabase에 히스토리 저장 완료");
        }
      } else {
        console.log("Supabase 저장 실패 (로컬 스토리지에만 저장됨)");
      }
    } catch (err) {
      // 네트워크 오류 시 무시 (로컬 스토리지에만 저장됨)
      console.log("Supabase 저장 시도 실패 (로컬 스토리지에만 저장됨)");
    }
  };

  const loadApiKeys = async () => {
    setLoadingKeys(true);
    try {
      const storedKey = localStorage.getItem("apiKey");
      if (!storedKey) return;

      const response = await fetch(`${API_BASE_URL}/api/v1/auth/keys`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": storedKey,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setApiKeys(data.data);
        }
      }
    } catch (err) {
      console.error("API 키 목록 로드 실패:", err);
    } finally {
      setLoadingKeys(false);
    }
  };

  const handleIssue = async () => {
    if (!email || !name) {
      setError("이메일과 API 키 이름을 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          description: description || undefined,
        }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        const newApiKey = data.data.apiKey;
        setApiKey(newApiKey);
        // 로컬 스토리지에 저장하지 않음 (새로고침 시 표시되지 않도록)
        
        // 외부 API(connect-agent.aiharu.net)에서 이미 히스토리를 저장하므로
        // 클라이언트에서는 저장하지 않음 (중복 방지)
        // 로컬 스토리지만 저장 (UI 표시용)
        const historyItem: ApiKeyHistory = {
          email,
          name,
          description: description || "",
          apiKey: newApiKey,
          createdAt: new Date().toISOString(),
        };
        
        // 로컬 스토리지만 저장 (Supabase 저장은 외부 API에서 처리)
        try {
          const existingHistory = localStorage.getItem("apiKeyHistory");
          const history: ApiKeyHistory[] = existingHistory ? JSON.parse(existingHistory) : [];
          history.unshift(historyItem);
          const limitedHistory = history.slice(0, 50);
          localStorage.setItem("apiKeyHistory", JSON.stringify(limitedHistory));
          setApiKeyHistory(limitedHistory);
        } catch (err) {
          console.error("로컬 스토리지 저장 실패:", err);
        }
        
        setEmail("");
        setName("");
        setDescription("");
        await loadApiKeys();
      } else {
        setError(data.message || "API 키 발급 실패");
      }
    } catch (err) {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("ko-KR");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* API 키 발급 폼 */}
      <div className="border p-6" style={{ 
        backgroundColor: 'var(--color-background)', 
        borderColor: 'var(--color-outline)',
        borderRadius: 'var(--border-radius-medium)'
      }}>
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-on-background)' }}>
          API 키 발급
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-on-background)' }}>
              이메일 <span style={{ color: 'var(--color-error)' }}>*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              style={{ 
                backgroundColor: 'var(--color-background)', 
                borderColor: 'var(--color-outline)',
                color: 'var(--color-on-background)',
                borderRadius: 'var(--border-radius-small)'
              }}
              placeholder="your-email@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-on-background)' }}>
              API 키 이름 <span style={{ color: 'var(--color-error)' }}>*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              style={{ 
                backgroundColor: 'var(--color-background)', 
                borderColor: 'var(--color-outline)',
                color: 'var(--color-on-background)',
                borderRadius: 'var(--border-radius-small)'
              }}
              placeholder="My API Key"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-on-background)' }}>
              설명 (선택사항)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              style={{ 
                backgroundColor: 'var(--color-background)', 
                borderColor: 'var(--color-outline)',
                color: 'var(--color-on-background)',
                borderRadius: 'var(--border-radius-small)'
              }}
              placeholder="Production API key for my application"
            />
          </div>
          <button
            onClick={handleIssue}
            disabled={loading}
            className="px-6 py-2 font-medium rounded-lg transition-colors"
            style={{ 
              backgroundColor: loading ? 'var(--color-outline)' : 'var(--color-primary)',
              color: '#000000',
              borderRadius: 'var(--border-radius-medium)',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? "발급 중..." : "API 키 발급"}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg" style={{ 
            backgroundColor: 'var(--color-error)', 
            color: '#FFFFFF',
            borderRadius: 'var(--border-radius-small)'
          }}>
            {error}
          </div>
        )}

        {apiKey && (
          <div className="mt-4 p-4 border rounded-lg" style={{ 
            backgroundColor: 'var(--color-surface)', 
            borderColor: 'var(--color-primary)',
            borderRadius: 'var(--border-radius-medium)'
          }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium" style={{ color: 'var(--color-on-background)' }}>
                발급된 API 키:
              </p>
              <button
                onClick={handleCopy}
                className="px-3 py-1 text-sm font-medium rounded"
                style={{ 
                  backgroundColor: 'var(--color-primary)', 
                  color: '#000000',
                  borderRadius: 'var(--border-radius-small)'
                }}
              >
                {copied ? "복사됨!" : "복사"}
              </button>
            </div>
            <code className="block p-2 text-sm break-all rounded" style={{ 
              backgroundColor: 'var(--color-background)', 
              color: 'var(--color-on-background)',
              borderRadius: 'var(--border-radius-small)'
            }}>
              {apiKey}
            </code>
            <p className="mt-2 text-xs" style={{ color: 'var(--color-error)' }}>
              ⚠️ API 키는 한 번만 표시됩니다. 안전하게 보관하세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

