import fs from "fs";
import path from "path";
import { MDXRemote } from "next-mdx-remote/rsc";
import matter from "gray-matter";
import Link from "next/link";

function getTodayFilePath() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return path.join(
    process.cwd(),
    "content/ai-daily",
    `${yyyy}-${mm}-${dd}.mdx`
  );
}

const CONTENT_DIR = path.join(process.cwd(), "content/ai-daily");

function getAllDailyContents() {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));
  const posts = files.map((filename) => {
    const file = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf-8");
    const { data, content } = matter(file);
    return {
      title: data.title || filename.replace(".mdx", ""),
      tags: data.tags || [],
      date: data.date,
      slug: filename.replace(".mdx", ""),
      excerpt:
        content
          .split("\n")
          .find((line) => line.trim() && !line.startsWith("---"))
          ?.slice(0, 80) || "",
    };
  });
  // 날짜 내림차순 정렬
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export default function AiDailyListPage() {
  const posts = getAllDailyContents();
  return (
    <div className="min-h-screen flex flex-col items-center bg-green-50 px-4 py-20">
      <main className="flex flex-col items-center gap-8 w-full max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-green-600 text-center drop-shadow-md mb-4">
          오늘의 ai 아카이브
        </h1>
        <div className="grid gap-6 w-full">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/ai/daily/${post.slug}`}
              className="block bg-white border border-green-200 rounded-xl p-6 shadow hover:shadow-lg transition-shadow w-full"
            >
              <div className="flex flex-col gap-2">
                <div className="text-lg font-semibold text-green-700">
                  {post.title}
                </div>
                <div className="text-xs text-gray-400">{post.date}</div>
                <div className="text-sm text-green-800 mt-1">
                  {post.excerpt}
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {post.tags?.map((tag: string) => (
                    <span
                      key={tag}
                      className="bg-green-100 text-green-600 rounded px-2 py-0.5 text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
