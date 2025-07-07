const fs = require("fs");
const path = require("path");

const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const dd = String(today.getDate()).padStart(2, "0");
const dateStr = `${yyyy}-${mm}-${dd}`;

const contentDir = path.join(__dirname, "../content/ai-daily");
const filePath = path.join(contentDir, `${dateStr}.mdx`);

if (fs.existsSync(filePath)) {
  console.log("이미 오늘의 MDX 파일이 존재합니다:", filePath);
  process.exit(0);
}

const template = `---
title: "${dateStr}의 AI 데일리"
date: "${dateStr}"
tags: []
---

여기에 오늘의 AI 데일리 콘텐츠를 작성하세요.
`;

fs.writeFileSync(filePath, template);
console.log("생성 완료:", filePath);
