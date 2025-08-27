import { commonMetadata } from "@/app/metadata/common";

export const metadata = {
  ...commonMetadata,
  title: "아이하루 - 아이와 부모가 함께 만드는 하루 습관 | aiharu.net",
  description:
    "아이하루는 아이와 부모가 함께 목표를 세우고, 피드백과 칭찬으로 성장하는 습관 여정을 지원합니다. 목표 체크, 피드백, 보상 시스템, 주간 리포트 등 다양한 기능 제공.",
  keywords: "아이하루, 습관, 성장, 피드백, 보상, 부모, 자녀, 대시보드",
  openGraph: {
    ...commonMetadata.openGraph,
    title: "아이하루 - 아이와 부모가 함께 만드는 하루 습관 | aiharu.net",
    description:
      "아이하루는 아이와 부모가 함께 목표를 세우고, 피드백과 칭찬으로 성장하는 습관 여정을 지원합니다. 목표 체크, 피드백, 보상 시스템, 주간 리포트 등 다양한 기능 제공.",
    url: "https://aiharu.net/child",
    images: [
      {
        url: "/og-childharu.png",
        width: 1200,
        height: 630,
        alt: "아이하루 - aiharu.net",
      },
    ],
  },
};
