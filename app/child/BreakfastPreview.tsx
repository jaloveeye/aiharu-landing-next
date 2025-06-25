"use client";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { v4 as uuidv4 } from "uuid";

function isValidUUID(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    id
  );
}

function getAnonId() {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("anon_id") || "";
  if (!isValidUUID(id)) {
    id = uuidv4();
    localStorage.setItem("anon_id", id);
  }
  return id;
}

export default function BreakfastPreview() {
  const [alreadyAnalyzed, setAlreadyAnalyzed] = useState(false);
  const [anonId, setAnonId] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAnonId(getAnonId());
    }
  }, []);

  useEffect(() => {
    if (!anonId) return;
    fetch(`/api/analyze-meal?anon_id=${anonId}`)
      .then((res) => res.json())
      .then((data) => setAlreadyAnalyzed(!!data.analyzed));
  }, [anonId]);

  return (
    <div className="bg-white border border-yellow-200 rounded-xl p-6 shadow max-w-md w-full flex flex-col gap-4 mt-8 mx-auto items-center text-center">
      {alreadyAnalyzed ? (
        <div className="text-yellow-500 text-sm font-semibold">
          오늘은 이미 분석을 완료했어요. 내일 다시 시도해 주세요!
        </div>
      ) : (
        <Button
          as="a"
          href="/breakfast"
          variant="primary"
          className="w-fit mx-auto text-white"
        >
          아침 식단 기록/분석하기
        </Button>
      )}
    </div>
  );
}
