export const dynamic = "force-dynamic";
import fs from "fs";
import path from "path";
import { MDXRemote } from "next-mdx-remote/rsc";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function AiDailyDetailPage({ params }: { params: any }) {
  const filePath = path.join(
    process.cwd(),
    "content/ai-daily",
    `${params.date}.mdx`
  );
  if (!fs.existsSync(filePath)) {
    notFound();
  }
  const file = fs.readFileSync(filePath, "utf-8");
  const { content, data } = matter(file);

  return (
    <div className="min-h-screen flex flex-col items-center bg-green-50 px-4 py-20">
      <Link
        href="/ai/daily"
        className="self-start mb-4 text-green-700 hover:underline flex items-center gap-1 text-sm"
      >
        ← 오늘의 ai하루로 돌아가기
      </Link>
      <main className="flex flex-col items-center gap-8 w-full max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-green-600 text-center drop-shadow-md mb-4">
          {data.title}
        </h1>
        <div className="text-xs text-gray-400 mb-2">{data.date}</div>
        <div className="flex gap-2 mb-4 flex-wrap">
          {data.tags?.map((tag: string) => (
            <span
              key={tag}
              className="bg-green-100 text-green-600 rounded px-2 py-0.5 text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
        <div className="bg-white border border-green-200 rounded-xl p-6 shadow w-full text-green-800 prose prose-green">
          <MDXRemote source={content} />
        </div>
      </main>
    </div>
  );
}
