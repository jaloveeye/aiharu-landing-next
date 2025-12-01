"use client";

import { useState } from "react";

const API_BASE_URL = "https://connect-agent.aiharu.net";

export default function ApiManual() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const CodeBlock = ({ children, language = "bash" }: { children: string; language?: string }) => (
    <pre className="p-4 text-xs overflow-x-auto rounded-lg" style={{ 
      backgroundColor: 'var(--color-surface)', 
      color: 'var(--color-on-background)',
      borderRadius: 'var(--border-radius-small)',
      fontFamily: 'monospace'
    }}>
      <code>{children}</code>
    </pre>
  );

  return (
    <div className="space-y-6">
      {/* API 소개 */}
      <div className="border p-6" style={{ 
        backgroundColor: 'var(--color-background)', 
        borderColor: 'var(--color-outline)',
        borderRadius: 'var(--border-radius-medium)'
      }}>
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-on-background)' }}>
          API 개요
        </h3>
        <div className="space-y-4" style={{ color: 'var(--color-on-surface-variant)' }}>
          <p>
            김아빠 모험 및 퀴즈 생성 API는 AI를 활용하여 아이들을 위한 맞춤형 모험 게임과 수수께끼/암호/퍼즐 문제를 생성하는 RESTful API입니다.
          </p>
          <div>
            <p className="font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>주요 기능:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>모험 생성: 테마, 아이 나이, 기간에 맞춘 완전한 모험 게임 생성</li>
              <li>퀴즈 생성: 수수께끼, 암호, 퍼즐, 수학 문제 생성</li>
              <li>AI 기반: OpenAI GPT-4o를 활용한 고품질 콘텐츠 생성</li>
              <li>품질 검증: 자동 품질 검증 및 개선 루프</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>Base URL:</p>
            <code className="px-2 py-1 rounded" style={{ 
              backgroundColor: 'var(--color-surface)', 
              color: 'var(--color-on-background)',
              borderRadius: 'var(--border-radius-small)'
            }}>
              {API_BASE_URL}
            </code>
          </div>
        </div>
      </div>

      {/* 인증 */}
      <div className="border p-6" style={{ 
        backgroundColor: 'var(--color-background)', 
        borderColor: 'var(--color-outline)',
        borderRadius: 'var(--border-radius-medium)'
      }}>
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-on-background)' }}>
          인증
        </h3>
        <div className="space-y-4" style={{ color: 'var(--color-on-surface-variant)' }}>
          <p>
            모든 API 요청에는 다음 두 가지 헤더가 <strong style={{ color: 'var(--color-error)' }}>필수</strong>입니다:
          </p>
          <div className="space-y-2">
            <div>
              <p className="font-semibold mb-1" style={{ color: 'var(--color-on-background)' }}>1. API 키 (필수):</p>
              <CodeBlock language="http">
{`x-api-key: YOUR_API_KEY`}
              </CodeBlock>
            </div>
            <div>
              <p className="font-semibold mb-1" style={{ color: 'var(--color-on-background)' }}>2. OpenAI API 키 (필수):</p>
              <CodeBlock language="http">
{`x-openai-api-key: sk-YOUR_OPENAI_API_KEY`}
              </CodeBlock>
              <p className="text-sm mt-1" style={{ color: 'var(--color-on-surface-variant)' }}>
                OpenAI API 키는 <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--color-secondary)' }}>OpenAI Platform</a>에서 발급받을 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 엔드포인트 상세 */}
      <div className="border p-6" style={{ 
        backgroundColor: 'var(--color-background)', 
        borderColor: 'var(--color-outline)',
        borderRadius: 'var(--border-radius-medium)'
      }}>
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-on-background)' }}>
          API 엔드포인트
        </h3>
        <div className="space-y-6">
          {/* 모험 생성 */}
          <div>
            <button
              onClick={() => toggleSection("adventure")}
              className="w-full text-left p-4 border rounded-lg flex items-center justify-between"
              style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)',
                color: 'var(--color-on-background)'
              }}
            >
              <span className="font-semibold">POST /api/v1/adventures/generate</span>
              <span>{activeSection === "adventure" ? "−" : "+"}</span>
            </button>
            {activeSection === "adventure" && (
              <div className="mt-4 space-y-4 p-4 border rounded-lg" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)'
              }}>
                <p style={{ color: 'var(--color-on-surface-variant)' }}>
                  아이를 위한 맞춤형 모험 게임을 생성합니다.
                </p>
                <div>
                  <p className="font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>필수 파라미터:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4" style={{ color: 'var(--color-on-surface-variant)' }}>
                    <li><code className="px-1 py-0.5 rounded" style={{ backgroundColor: 'var(--color-background)' }}>theme</code>: 모험 테마 (예: "우주 탐험", "해적 모험")</li>
                    <li><code className="px-1 py-0.5 rounded" style={{ backgroundColor: 'var(--color-background)' }}>childAge</code>: 아이 나이 (3-15세 권장)</li>
                    <li><code className="px-1 py-0.5 rounded" style={{ backgroundColor: 'var(--color-background)' }}>duration</code>: 모험 기간 (일수, 2-7일 권장)</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>요청 예시:</p>
                  <CodeBlock language="json">
{`{
  "theme": "우주 탐험",
  "childAge": 7,
  "duration": 5,
  "preferences": ["과학", "탐험"],
  "useAgent": true
}`}
                  </CodeBlock>
                </div>
                <div>
                  <p className="font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>필수 헤더:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mb-3" style={{ color: 'var(--color-on-surface-variant)' }}>
                    <li><code className="px-1 py-0.5 rounded" style={{ backgroundColor: 'var(--color-background)' }}>x-api-key</code>: 발급받은 API 키</li>
                    <li><code className="px-1 py-0.5 rounded" style={{ backgroundColor: 'var(--color-background)' }}>x-openai-api-key</code>: OpenAI API 키 (필수)</li>
                  </ul>
                  <p className="font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>cURL 예시:</p>
                  <CodeBlock language="bash">
{`curl -X POST ${API_BASE_URL}/api/v1/adventures/generate \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "x-openai-api-key: sk-YOUR_OPENAI_API_KEY" \\
  -d '{
    "theme": "우주 탐험",
    "childAge": 7,
    "duration": 5,
    "preferences": ["과학", "탐험"]
  }'`}
                  </CodeBlock>
                </div>
              </div>
            )}
          </div>

          {/* 퀴즈 생성 */}
          <div>
            <button
              onClick={() => toggleSection("riddle")}
              className="w-full text-left p-4 border rounded-lg flex items-center justify-between"
              style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)',
                color: 'var(--color-on-background)'
              }}
            >
              <span className="font-semibold">POST /api/v1/riddles/generate</span>
              <span>{activeSection === "riddle" ? "−" : "+"}</span>
            </button>
            {activeSection === "riddle" && (
              <div className="mt-4 space-y-4 p-4 border rounded-lg" style={{ 
                backgroundColor: 'var(--color-surface)', 
                borderColor: 'var(--color-outline)',
                borderRadius: 'var(--border-radius-medium)'
              }}>
                <p style={{ color: 'var(--color-on-surface-variant)' }}>
                  수수께끼, 암호, 퍼즐, 수학 문제를 생성합니다.
                </p>
                <div>
                  <p className="font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>필수 파라미터:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4" style={{ color: 'var(--color-on-surface-variant)' }}>
                    <li><code className="px-1 py-0.5 rounded" style={{ backgroundColor: 'var(--color-background)' }}>theme</code>: 테마 (예: "우주 탐험", "해적 모험")</li>
                    <li><code className="px-1 py-0.5 rounded" style={{ backgroundColor: 'var(--color-background)' }}>childAge</code>: 아이 나이 (3-15세 권장)</li>
                    <li><code className="px-1 py-0.5 rounded" style={{ backgroundColor: 'var(--color-background)' }}>type</code>: 문제 유형 (riddle, cipher, puzzle, math)</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>요청 예시:</p>
                  <CodeBlock language="json">
{`{
  "theme": "우주 탐험",
  "childAge": 7,
  "type": "riddle",
  "answerHint": "책장"
}`}
                  </CodeBlock>
                </div>
                <div>
                  <p className="font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>필수 헤더:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mb-3" style={{ color: 'var(--color-on-surface-variant)' }}>
                    <li><code className="px-1 py-0.5 rounded" style={{ backgroundColor: 'var(--color-background)' }}>x-api-key</code>: 발급받은 API 키</li>
                    <li><code className="px-1 py-0.5 rounded" style={{ backgroundColor: 'var(--color-background)' }}>x-openai-api-key</code>: OpenAI API 키 (필수)</li>
                  </ul>
                  <p className="font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>cURL 예시:</p>
                  <CodeBlock language="bash">
{`curl -X POST ${API_BASE_URL}/api/v1/riddles/generate \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "x-openai-api-key: sk-YOUR_OPENAI_API_KEY" \\
  -d '{
    "theme": "우주 탐험",
    "childAge": 7,
    "type": "riddle",
    "answerHint": "책장"
  }'`}
                  </CodeBlock>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 사용 예시 */}
      <div className="border p-6" style={{ 
        backgroundColor: 'var(--color-background)', 
        borderColor: 'var(--color-outline)',
        borderRadius: 'var(--border-radius-medium)'
      }}>
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-on-background)' }}>
          사용 예시
        </h3>
        <div className="space-y-6">
          <div>
            <p className="font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>JavaScript:</p>
            <CodeBlock language="javascript">
{`// 모험 생성
async function generateAdventure() {
  const response = await fetch('${API_BASE_URL}/api/v1/adventures/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'YOUR_API_KEY',
      'x-openai-api-key': 'sk-YOUR_OPENAI_API_KEY' // 필수
    },
    body: JSON.stringify({
      theme: '우주 탐험',
      childAge: 7,
      duration: 5,
      preferences: ['과학', '탐험'],
      useAgent: true
    })
  });

  const data = await response.json();
  console.log(data);
}`}
            </CodeBlock>
          </div>
          <div>
            <p className="font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>Python:</p>
            <CodeBlock language="python">
{`import requests

def generate_adventure():
    url = '${API_BASE_URL}/api/v1/adventures/generate'
    headers = {
        'Content-Type': 'application/json',
        'x-api-key': 'YOUR_API_KEY',
        'x-openai-api-key': 'sk-YOUR_OPENAI_API_KEY'  # 필수
    }
    data = {
        'theme': '우주 탐험',
        'childAge': 7,
        'duration': 5,
        'preferences': ['과학', '탐험'],
        'useAgent': True
    }
    response = requests.post(url, json=data, headers=headers)
    return response.json()`}
            </CodeBlock>
          </div>
        </div>
      </div>

      {/* 에러 처리 */}
      <div className="border p-6" style={{ 
        backgroundColor: 'var(--color-background)', 
        borderColor: 'var(--color-outline)',
        borderRadius: 'var(--border-radius-medium)'
      }}>
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-on-background)' }}>
          에러 처리
        </h3>
        <div className="space-y-4" style={{ color: 'var(--color-on-surface-variant)' }}>
          <div>
            <p className="font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>HTTP 상태 코드:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>200</strong>: 성공</li>
              <li><strong>400</strong>: 잘못된 요청 (파라미터 누락 또는 잘못된 형식)</li>
              <li><strong>401</strong>: 인증 실패 (API 키 없음 또는 잘못됨)</li>
              <li><strong>500</strong>: 서버 오류</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-2" style={{ color: 'var(--color-on-background)' }}>에러 응답 형식:</p>
            <CodeBlock language="json">
{`{
  "success": false,
  "error": "ErrorType",
  "message": "에러 메시지"
}`}
            </CodeBlock>
          </div>
        </div>
      </div>

    </div>
  );
}

