import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ["**/*.test.ts", "**/*.test.tsx"],
    exclude: [
      "**/dist/**",
      "**/.next/**",
      "**/node_modules/**",
      "**/*.stories.tsx",
      "**/*.stories.ts",
    ],
    environment: "jsdom",
    globals: true,
    setupFiles: ["jest.setup.ts"],
  },
  esbuild: {
    jsx: "automatic",
  },
});
