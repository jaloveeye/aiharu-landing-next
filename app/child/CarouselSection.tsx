"use client";
import Carousel from "@/components/ui/Carousel";

interface CardItem {
  icon: string;
  title: string;
  desc: string;
}

export default function CarouselSection({ cards }: { cards: CardItem[] }) {
  return (
    <div className="w-full max-w-md mx-auto">
      <Carousel
        items={cards}
        renderItem={(card) => (
          <div
            className="bg-white border border-yellow-200 rounded-xl p-6 shadow flex flex-col items-start gap-3 w-full"
            style={{ minHeight: "120px", minWidth: "180px", maxWidth: "320px" }}
          >
            <div className="flex flex-row items-center gap-2 mb-1">
              <span className="text-2xl">{card.icon}</span>
              <div className="font-bold text-yellow-700 text-lg">
                {card.title}
              </div>
            </div>
            <div className="text-yellow-800 text-sm">{card.desc}</div>
          </div>
        )}
        minHeight="140px"
        minWidth="200px"
      />
    </div>
  );
}
