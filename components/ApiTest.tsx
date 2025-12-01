"use client";

import React, { useState, useEffect } from "react";
import { getOrCreateAnonymousId } from "@/app/utils/anonymous-id";
import { createClient } from "@/app/utils/supabase/client";

const API_BASE_URL = "https://connect-agent.aiharu.net";

interface ApiGenerationHistory {
  type: "adventure" | "riddle";
  request: any;
  response: any;
  timestamp: string;
  success: boolean;
  error?: string;
}

export default function ApiTest() {
  const [apiKey, setApiKey] = useState("");
  const [openaiApiKey, setOpenaiApiKey] = useState("");
  const [activeTab, setActiveTab] = useState<"adventure" | "riddle">(
    "adventure"
  );

  // 모험 생성 상태
  const [adventureTheme, setAdventureTheme] = useState("우주 탐험");
  const [adventureChildAge, setAdventureChildAge] = useState(7);
  const [adventureDuration, setAdventureDuration] = useState(5);
  const [adventurePreferences, setAdventurePreferences] =
    useState("과학, 탐험");
  const [adventureRequest, setAdventureRequest] = useState<any>(null);
  const [adventureResponse, setAdventureResponse] = useState<any>(null);
  const [adventureLoading, setAdventureLoading] = useState(false);
  const [adventureError, setAdventureError] = useState<string | null>(null);

  // 퀴즈 생성 상태
  const [riddleTheme, setRiddleTheme] = useState("우주 탐험");
  const [riddleChildAge, setRiddleChildAge] = useState(7);
  const [riddleType, setRiddleType] = useState("riddle");
  const [riddleAnswerHint, setRiddleAnswerHint] = useState("");
  const [riddleRequest, setRiddleRequest] = useState<any>(null);
  const [riddleResponse, setRiddleResponse] = useState<any>(null);
  const [riddleLoading, setRiddleLoading] = useState(false);
  const [riddleError, setRiddleError] = useState<string | null>(null);
  const [generationHistory, setGenerationHistory] = useState<
    ApiGenerationHistory[]
  >([]);
  const [showHistory, setShowHistory] = useState(false);

  // 로컬 스토리지에서 API 키 및 히스토리 불러오기
  useEffect(() => {
    const storedKey = localStorage.getItem("apiKey");
    if (storedKey) {
      setApiKey(storedKey);
    }
    loadGenerationHistory();
  }, []);

  const loadGenerationHistory = async () => {
    try {
      // Supabase에서 조회
      const response = await fetch("/api/api-history/generations?limit=100");
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          // Supabase 데이터를 로컬 형식으로 변환 (요청/응답은 암호화되어 있으므로 표시하지 않음)
          const history: ApiGenerationHistory[] = data.data.map(
            (item: any) => ({
              type: item.type,
              request: {}, // 암호화되어 있어서 클라이언트에서 복호화 불가
              response: {}, // 암호화되어 있어서 클라이언트에서 복호화 불가
              timestamp: item.created_at,
              success: item.success,
              error: item.error_message || undefined,
            })
          );
          setGenerationHistory(history);
          return;
        }
      }
    } catch (err) {
      console.error(
        "Supabase 히스토리 로드 실패, 로컬 스토리지에서 로드:",
        err
      );
    }

    // Supabase 조회 실패 시 로컬 스토리지에서 로드
    try {
      const history = localStorage.getItem("apiGenerationHistory");
      if (history) {
        setGenerationHistory(JSON.parse(history));
      }
    } catch (err) {
      console.error("생성 히스토리 로드 실패:", err);
    }
  };

  // 중복 저장 방지를 위한 Set (타임스탬프 기반)
  const savingHistory = React.useRef<Set<string>>(new Set());

  const saveGenerationHistory = async (historyItem: ApiGenerationHistory) => {
    // 중복 저장 방지: 같은 타임스탬프의 요청은 무시
    const historyKey = `${historyItem.type}-${historyItem.timestamp}`;
    if (savingHistory.current.has(historyKey)) {
      console.log("중복 저장 방지:", historyKey);
      return;
    }
    savingHistory.current.add(historyKey);
    
    // 5초 후 Set에서 제거 (메모리 누수 방지)
    setTimeout(() => {
      savingHistory.current.delete(historyKey);
    }, 5000);

    // 로컬 스토리지 저장 제거 (Supabase에만 저장)

    // Supabase에 저장 시도 (API 키로 사용자 찾기)
    try {
      const anonymousId = getOrCreateAnonymousId();
      const response = await fetch("/api/api-history/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...historyItem,
          apiKey: apiKey, // API 키를 전달하여 사용자 찾기
          anonymousId: anonymousId, // API 키로 사용자를 찾지 못할 경우 사용
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

  const handleAdventureTest = async () => {
    if (!apiKey) {
      setAdventureError("API 키를 입력해주세요.");
      return;
    }

    if (!openaiApiKey) {
      setAdventureError("OpenAI API 키를 입력해주세요.");
      return;
    }

    setAdventureLoading(true);
    setAdventureError(null);
    setAdventureResponse(null);

    const requestBody: any = {
      theme: adventureTheme,
      childAge: adventureChildAge,
      duration: adventureDuration,
      useAgent: true,
      openaiApiKey: openaiApiKey,
    };

    if (adventurePreferences) {
      requestBody.preferences = adventurePreferences
        .split(",")
        .map((p) => p.trim());
    }

    setAdventureRequest(requestBody);

    try {
      const headers: any = {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      };

      if (openaiApiKey) {
        headers["x-openai-api-key"] = openaiApiKey;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/v1/adventures/generate`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setAdventureResponse(data);
        // 히스토리에 저장
        saveGenerationHistory({
          type: "adventure",
          request: requestBody,
          response: data,
          timestamp: new Date().toISOString(),
          success: true,
        });
      } else {
        const errorMessage = data.message || "모험 생성 실패";
        setAdventureError(errorMessage);
        // 에러도 히스토리에 저장
        saveGenerationHistory({
          type: "adventure",
          request: requestBody,
          response: data,
          timestamp: new Date().toISOString(),
          success: false,
          error: errorMessage,
        });
      }
    } catch (err) {
      setAdventureError("네트워크 오류가 발생했습니다.");
    } finally {
      setAdventureLoading(false);
    }
  };

  const handleRiddleTest = async () => {
    if (!apiKey) {
      setRiddleError("API 키를 입력해주세요.");
      return;
    }

    if (!openaiApiKey) {
      setRiddleError("OpenAI API 키를 입력해주세요.");
      return;
    }

    setRiddleLoading(true);
    setRiddleError(null);
    setRiddleResponse(null);

    const requestBody: any = {
      theme: riddleTheme,
      childAge: riddleChildAge,
      type: riddleType,
      openaiApiKey: openaiApiKey,
    };

    if (riddleAnswerHint) {
      requestBody.answerHint = riddleAnswerHint;
    }

    setRiddleRequest(requestBody);

    try {
      const headers: any = {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "x-openai-api-key": openaiApiKey,
      };

      const response = await fetch(`${API_BASE_URL}/api/v1/riddles/generate`, {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setRiddleResponse(data);
        // 히스토리에 저장
        saveGenerationHistory({
          type: "riddle",
          request: requestBody,
          response: data,
          timestamp: new Date().toISOString(),
          success: true,
        });
      } else {
        const errorMessage = data.message || "퀴즈 생성 실패";
        setRiddleError(errorMessage);
        // 에러도 히스토리에 저장
        saveGenerationHistory({
          type: "riddle",
          request: requestBody,
          response: data,
          timestamp: new Date().toISOString(),
          success: false,
          error: errorMessage,
        });
      }
    } catch (err) {
      setRiddleError("네트워크 오류가 발생했습니다.");
    } finally {
      setRiddleLoading(false);
    }
  };

  const formatJSON = (obj: any) => {
    return JSON.stringify(obj, null, 2);
  };

  return (
    <div className="space-y-6">
      {/* API 키 입력 */}
      <div
        className="border p-6"
        style={{
          backgroundColor: "var(--color-background)",
          borderColor: "var(--color-outline)",
          borderRadius: "var(--border-radius-medium)",
        }}
      >
        <h3
          className="text-xl font-bold mb-4"
          style={{ color: "var(--color-on-background)" }}
        >
          API 키 설정
        </h3>
        <div className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--color-on-background)" }}
            >
              API 키 <span style={{ color: "var(--color-error)" }}>*</span>
            </label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg font-mono text-sm"
              style={{
                backgroundColor: "var(--color-background)",
                borderColor: "var(--color-outline)",
                color: "var(--color-on-background)",
                borderRadius: "var(--border-radius-small)",
              }}
              placeholder="ak_live_..."
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--color-on-background)" }}
            >
              OpenAI API 키{" "}
              <span style={{ color: "var(--color-error)" }}>*</span>
            </label>
            <input
              type="password"
              value={openaiApiKey}
              onChange={(e) => setOpenaiApiKey(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg font-mono text-sm"
              style={{
                backgroundColor: "var(--color-background)",
                borderColor: "var(--color-outline)",
                color: "var(--color-on-background)",
                borderRadius: "var(--border-radius-small)",
              }}
              placeholder="sk-..."
              required
            />
            <p
              className="mt-1 text-xs"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              OpenAI API 키는 필수입니다. API 테스트를 위해 반드시 입력해주세요.
            </p>
          </div>
        </div>
      </div>

      {/* 탭 */}
      <div
        className="border p-6"
        style={{
          backgroundColor: "var(--color-background)",
          borderColor: "var(--color-outline)",
          borderRadius: "var(--border-radius-medium)",
        }}
      >
        <div
          className="flex gap-4 mb-6 border-b"
          style={{ borderColor: "var(--color-outline)" }}
        >
          <button
            onClick={() => setActiveTab("adventure")}
            className="px-4 py-2 font-medium transition-colors"
            style={{
              borderBottom:
                activeTab === "adventure"
                  ? `2px solid var(--color-primary)`
                  : "none",
              color:
                activeTab === "adventure"
                  ? "var(--color-on-background)"
                  : "var(--color-on-surface-variant)",
              marginBottom: "-1px",
            }}
          >
            모험 생성 테스트
          </button>
          <button
            onClick={() => setActiveTab("riddle")}
            className="px-4 py-2 font-medium transition-colors"
            style={{
              borderBottom:
                activeTab === "riddle"
                  ? `2px solid var(--color-primary)`
                  : "none",
              color:
                activeTab === "riddle"
                  ? "var(--color-on-background)"
                  : "var(--color-on-surface-variant)",
              marginBottom: "-1px",
            }}
          >
            퀴즈 생성 테스트
          </button>
        </div>

        {/* 모험 생성 테스트 */}
        {activeTab === "adventure" && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--color-on-background)" }}
                >
                  테마 <span style={{ color: "var(--color-error)" }}>*</span>
                </label>
                <input
                  type="text"
                  value={adventureTheme}
                  onChange={(e) => setAdventureTheme(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{
                    backgroundColor: "var(--color-background)",
                    borderColor: "var(--color-outline)",
                    color: "var(--color-on-background)",
                    borderRadius: "var(--border-radius-small)",
                  }}
                  placeholder="우주 탐험"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--color-on-background)" }}
                >
                  아이 나이{" "}
                  <span style={{ color: "var(--color-error)" }}>*</span>
                </label>
                <input
                  type="number"
                  value={adventureChildAge}
                  onChange={(e) =>
                    setAdventureChildAge(parseInt(e.target.value) || 7)
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{
                    backgroundColor: "var(--color-background)",
                    borderColor: "var(--color-outline)",
                    color: "var(--color-on-background)",
                    borderRadius: "var(--border-radius-small)",
                  }}
                  min="3"
                  max="15"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--color-on-background)" }}
                >
                  기간 (일){" "}
                  <span style={{ color: "var(--color-error)" }}>*</span>
                </label>
                <input
                  type="number"
                  value={adventureDuration}
                  onChange={(e) =>
                    setAdventureDuration(parseInt(e.target.value) || 5)
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{
                    backgroundColor: "var(--color-background)",
                    borderColor: "var(--color-outline)",
                    color: "var(--color-on-background)",
                    borderRadius: "var(--border-radius-small)",
                  }}
                  min="2"
                  max="7"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--color-on-background)" }}
                >
                  선호도 (쉼표로 구분)
                </label>
                <input
                  type="text"
                  value={adventurePreferences}
                  onChange={(e) => setAdventurePreferences(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{
                    backgroundColor: "var(--color-background)",
                    borderColor: "var(--color-outline)",
                    color: "var(--color-on-background)",
                    borderRadius: "var(--border-radius-small)",
                  }}
                  placeholder="과학, 탐험"
                />
              </div>
            </div>
            <button
              onClick={handleAdventureTest}
              disabled={adventureLoading}
              className="px-6 py-2 font-medium rounded-lg transition-colors"
              style={{
                backgroundColor: adventureLoading
                  ? "var(--color-outline)"
                  : "var(--color-primary)",
                color: "#000000",
                borderRadius: "var(--border-radius-medium)",
                cursor: adventureLoading ? "not-allowed" : "pointer",
              }}
            >
              {adventureLoading ? "생성 중..." : "모험 생성"}
            </button>

            {adventureError && (
              <div
                className="p-3 rounded-lg"
                style={{
                  backgroundColor: "var(--color-error)",
                  color: "#FFFFFF",
                  borderRadius: "var(--border-radius-small)",
                }}
              >
                {adventureError}
              </div>
            )}

            {(adventureRequest || adventureResponse) && (
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                {adventureRequest && (
                  <div>
                    <h4
                      className="text-sm font-semibold mb-2"
                      style={{ color: "var(--color-on-background)" }}
                    >
                      요청
                    </h4>
                    <pre
                      className="p-4 text-xs overflow-auto rounded-lg"
                      style={{
                        backgroundColor: "var(--color-surface)",
                        color: "var(--color-on-background)",
                        borderRadius: "var(--border-radius-small)",
                        maxHeight: "400px",
                      }}
                    >
                      {formatJSON(adventureRequest)}
                    </pre>
                  </div>
                )}
                {adventureResponse && (
                  <div>
                    <h4
                      className="text-sm font-semibold mb-2"
                      style={{ color: "var(--color-on-background)" }}
                    >
                      응답
                    </h4>
                    <pre
                      className="p-4 text-xs overflow-auto rounded-lg"
                      style={{
                        backgroundColor: "var(--color-surface)",
                        color: "var(--color-on-background)",
                        borderRadius: "var(--border-radius-small)",
                        maxHeight: "400px",
                      }}
                    >
                      {formatJSON(adventureResponse)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 퀴즈 생성 테스트 */}
        {activeTab === "riddle" && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--color-on-background)" }}
                >
                  테마 <span style={{ color: "var(--color-error)" }}>*</span>
                </label>
                <input
                  type="text"
                  value={riddleTheme}
                  onChange={(e) => setRiddleTheme(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{
                    backgroundColor: "var(--color-background)",
                    borderColor: "var(--color-outline)",
                    color: "var(--color-on-background)",
                    borderRadius: "var(--border-radius-small)",
                  }}
                  placeholder="우주 탐험"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--color-on-background)" }}
                >
                  아이 나이{" "}
                  <span style={{ color: "var(--color-error)" }}>*</span>
                </label>
                <input
                  type="number"
                  value={riddleChildAge}
                  onChange={(e) =>
                    setRiddleChildAge(parseInt(e.target.value) || 7)
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{
                    backgroundColor: "var(--color-background)",
                    borderColor: "var(--color-outline)",
                    color: "var(--color-on-background)",
                    borderRadius: "var(--border-radius-small)",
                  }}
                  min="3"
                  max="15"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--color-on-background)" }}
                >
                  문제 유형{" "}
                  <span style={{ color: "var(--color-error)" }}>*</span>
                </label>
                <select
                  value={riddleType}
                  onChange={(e) => setRiddleType(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{
                    backgroundColor: "var(--color-background)",
                    borderColor: "var(--color-outline)",
                    color: "var(--color-on-background)",
                    borderRadius: "var(--border-radius-small)",
                  }}
                >
                  <option value="riddle">수수께끼</option>
                  <option value="cipher">암호</option>
                  <option value="puzzle">퍼즐</option>
                  <option value="math">수학</option>
                </select>
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "var(--color-on-background)" }}
                >
                  정답 힌트 (선택사항)
                </label>
                <input
                  type="text"
                  value={riddleAnswerHint}
                  onChange={(e) => setRiddleAnswerHint(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  style={{
                    backgroundColor: "var(--color-background)",
                    borderColor: "var(--color-outline)",
                    color: "var(--color-on-background)",
                    borderRadius: "var(--border-radius-small)",
                  }}
                  placeholder="책장"
                />
              </div>
            </div>
            <button
              onClick={handleRiddleTest}
              disabled={riddleLoading}
              className="px-6 py-2 font-medium rounded-lg transition-colors"
              style={{
                backgroundColor: riddleLoading
                  ? "var(--color-outline)"
                  : "var(--color-primary)",
                color: "#000000",
                borderRadius: "var(--border-radius-medium)",
                cursor: riddleLoading ? "not-allowed" : "pointer",
              }}
            >
              {riddleLoading ? "생성 중..." : "퀴즈 생성"}
            </button>

            {riddleError && (
              <div
                className="p-3 rounded-lg"
                style={{
                  backgroundColor: "var(--color-error)",
                  color: "#FFFFFF",
                  borderRadius: "var(--border-radius-small)",
                }}
              >
                {riddleError}
              </div>
            )}

            {(riddleRequest || riddleResponse) && (
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                {riddleRequest && (
                  <div>
                    <h4
                      className="text-sm font-semibold mb-2"
                      style={{ color: "var(--color-on-background)" }}
                    >
                      요청
                    </h4>
                    <pre
                      className="p-4 text-xs overflow-auto rounded-lg"
                      style={{
                        backgroundColor: "var(--color-surface)",
                        color: "var(--color-on-background)",
                        borderRadius: "var(--border-radius-small)",
                        maxHeight: "400px",
                      }}
                    >
                      {formatJSON(riddleRequest)}
                    </pre>
                  </div>
                )}
                {riddleResponse && (
                  <div>
                    <h4
                      className="text-sm font-semibold mb-2"
                      style={{ color: "var(--color-on-background)" }}
                    >
                      응답
                    </h4>
                    <pre
                      className="p-4 text-xs overflow-auto rounded-lg"
                      style={{
                        backgroundColor: "var(--color-surface)",
                        color: "var(--color-on-background)",
                        borderRadius: "var(--border-radius-small)",
                        maxHeight: "400px",
                      }}
                    >
                      {formatJSON(riddleResponse)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 생성 히스토리 */}
      {generationHistory.length > 0 && (
        <div
          className="border p-6"
          style={{
            backgroundColor: "var(--color-background)",
            borderColor: "var(--color-outline)",
            borderRadius: "var(--border-radius-medium)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-xl font-bold"
              style={{ color: "var(--color-on-background)" }}
            >
              생성 히스토리 ({generationHistory.length}개)
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="px-4 py-2 text-sm font-medium rounded-lg"
                style={{
                  backgroundColor: "var(--color-surface)",
                  color: "var(--color-on-background)",
                  borderRadius: "var(--border-radius-medium)",
                  cursor: "pointer",
                }}
              >
                {showHistory ? "숨기기" : "보기"}
              </button>
              <button
                onClick={async () => {
                  if (confirm("모든 히스토리를 삭제하시겠습니까?")) {
                    try {
                      const response = await fetch(
                        "/api/api-history/generations",
                        {
                          method: "DELETE",
                        }
                      );
                      if (response.ok) {
                        localStorage.removeItem("apiGenerationHistory");
                        setGenerationHistory([]);
                        setShowHistory(false);
                      } else {
                        alert("삭제에 실패했습니다.");
                      }
                    } catch (err) {
                      console.error("삭제 오류:", err);
                      // 로컬 스토리지는 삭제
                      localStorage.removeItem("apiGenerationHistory");
                      setGenerationHistory([]);
                      setShowHistory(false);
                    }
                  }
                }}
                className="px-4 py-2 text-sm font-medium rounded-lg"
                style={{
                  backgroundColor: "var(--color-error)",
                  color: "#FFFFFF",
                  borderRadius: "var(--border-radius-medium)",
                  cursor: "pointer",
                }}
              >
                전체 삭제
              </button>
            </div>
          </div>
          {showHistory && (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {generationHistory.map((item, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg"
                  style={{
                    backgroundColor: item.success
                      ? "var(--color-surface)"
                      : "rgba(239, 68, 68, 0.1)",
                    borderColor: item.success
                      ? "var(--color-outline)"
                      : "var(--color-error)",
                    borderRadius: "var(--border-radius-medium)",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-1 text-xs font-semibold rounded"
                        style={{
                          backgroundColor:
                            item.type === "adventure"
                              ? "var(--color-primary)"
                              : "var(--color-secondary)",
                          color: "#000000",
                          borderRadius: "var(--border-radius-small)",
                        }}
                      >
                        {item.type === "adventure" ? "모험" : "퀴즈"}
                      </span>
                      {item.success ? (
                        <span
                          className="text-xs"
                          style={{ color: "var(--color-success)" }}
                        >
                          ✓ 성공
                        </span>
                      ) : (
                        <span
                          className="text-xs"
                          style={{ color: "var(--color-error)" }}
                        >
                          ✗ 실패
                        </span>
                      )}
                    </div>
                    <span
                      className="text-xs"
                      style={{ color: "var(--color-on-surface-variant)" }}
                    >
                      {new Date(item.timestamp).toLocaleString("ko-KR")}
                    </span>
                  </div>
                  {item.error && (
                    <div
                      className="mb-2 p-2 rounded"
                      style={{
                        backgroundColor: "var(--color-error)",
                        color: "#FFFFFF",
                        borderRadius: "var(--border-radius-small)",
                      }}
                    >
                      <p className="text-xs">{item.error}</p>
                    </div>
                  )}
                  <details className="mt-2">
                    <summary
                      className="cursor-pointer text-sm font-medium"
                      style={{ color: "var(--color-on-background)" }}
                    >
                      요청/응답 보기
                    </summary>
                    <div className="mt-2 grid md:grid-cols-2 gap-4">
                      <div>
                        <p
                          className="text-xs font-semibold mb-1"
                          style={{ color: "var(--color-on-background)" }}
                        >
                          요청:
                        </p>
                        <pre
                          className="p-2 text-xs overflow-auto rounded"
                          style={{
                            backgroundColor: "var(--color-background)",
                            color: "var(--color-on-background)",
                            borderRadius: "var(--border-radius-small)",
                            maxHeight: "200px",
                          }}
                        >
                          {formatJSON(item.request)}
                        </pre>
                      </div>
                      <div>
                        <p
                          className="text-xs font-semibold mb-1"
                          style={{ color: "var(--color-on-background)" }}
                        >
                          응답:
                        </p>
                        <pre
                          className="p-2 text-xs overflow-auto rounded"
                          style={{
                            backgroundColor: "var(--color-background)",
                            color: "var(--color-on-background)",
                            borderRadius: "var(--border-radius-small)",
                            maxHeight: "200px",
                          }}
                        >
                          {formatJSON(item.response)}
                        </pre>
                      </div>
                    </div>
                  </details>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
