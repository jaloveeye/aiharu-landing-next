"use client";
import { useState, ReactNode } from "react";

interface CarouselProps<T> {
  items: T[];
  renderItem: (item: T, idx: number) => ReactNode;
  minHeight?: string;
  minWidth?: string;
  dotColor?: string;
}

export default function Carousel<T>({
  items,
  renderItem,
  minHeight = "200px",
  minWidth = "100%",
  dotColor = "bg-yellow-500",
}: CarouselProps<T>) {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i === 0 ? items.length - 1 : i - 1));
  const next = () => setIdx((i) => (i === items.length - 1 ? 0 : i + 1));
  return (
    <div
      className="flex flex-col items-center w-full"
      style={{ minWidth, minHeight }}
    >
      <div className="relative w-full" style={{ minHeight }}>
        <button
          aria-label="이전"
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border border-yellow-200 rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-yellow-50 z-10"
        >
          &#60;
        </button>
        <div
          className="mx-10 flex items-center justify-center"
          style={{ minHeight }}
        >
          <div
            className="transition-all duration-300 flex items-center justify-center w-full"
            style={{ minHeight, minWidth }}
          >
            {renderItem(items[idx], idx)}
          </div>
        </div>
        <button
          aria-label="다음"
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-yellow-200 rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-yellow-50 z-10"
        >
          &#62;
        </button>
      </div>
      <div className="flex gap-2 mt-4">
        {items.map((_, i) => (
          <span
            key={i}
            className={`w-2.5 h-2.5 rounded-full ${
              i === idx ? dotColor : "bg-yellow-200"
            } transition-all`}
          />
        ))}
      </div>
    </div>
  );
}
