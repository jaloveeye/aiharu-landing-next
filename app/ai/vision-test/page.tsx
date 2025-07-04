"use client";
import { useState } from "react";
import Alert from "@/components/ui/Alert";

export default function VisionTestPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageBase64, setImageBase64] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      setError(
        "지원하지 않는 이미지 형식입니다. png, jpg, gif, webp만 업로드할 수 있습니다."
      );
      setImageFile(null);
      setImagePreview("");
      setImageBase64("");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setImageBase64((reader.result as string).split(",")[1] || "");
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setResult("");
    setError("");
    try {
      const res = await fetch("/api/vision-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64 }),
      });
      const data = await res.json();
      if (res.ok && data.result) {
        setResult(data.result);
      } else {
        setError(data.error || "분석에 실패했습니다.");
      }
    } catch (e: any) {
      setError(e.message || "분석에 실패했습니다.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-4 py-20">
      <div className="bg-white border border-green-200 rounded-xl p-6 shadow max-w-md w-full flex flex-col gap-4 mt-8 mx-auto items-center text-center">
        <h2 className="text-2xl font-bold text-green-700 mb-2">
          Vision API 테스트
        </h2>
        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
          onChange={handleImageChange}
          className="file:bg-green-700 file:text-white file:font-bold file:rounded file:px-3 file:py-1 file:border-none file:mr-2 file:cursor-pointer text-gray-800"
          style={{ background: "#f9fafb" }}
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="업로드된 식단 사진 미리보기"
            className="w-32 h-32 object-cover rounded border mt-2 mx-auto"
          />
        )}
        {imageFile && (
          <button
            type="button"
            className="text-xs font-bold text-red-600 underline mt-1"
            style={{
              background: "#fff8f8",
              borderRadius: "4px",
              padding: "2px 8px",
            }}
            onClick={() => {
              setImageFile(null);
              setImagePreview("");
              setImageBase64("");
              setResult("");
              setError("");
            }}
          >
            사진 삭제
          </button>
        )}
        <button
          type="button"
          className={`rounded px-4 py-2 mt-2 ${
            loading || !imageBase64
              ? "bg-gray-300 text-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
          disabled={loading || !imageBase64}
          onClick={handleAnalyze}
        >
          {loading ? "분석 중..." : "Vision 분석하기"}
        </button>
        {error && <Alert variant="error">{error}</Alert>}
        {result && (
          <div className="w-full mt-4 text-left whitespace-pre-line text-green-800 bg-green-50 border border-green-100 rounded p-3 text-sm">
            {result}
          </div>
        )}
      </div>
    </div>
  );
}
