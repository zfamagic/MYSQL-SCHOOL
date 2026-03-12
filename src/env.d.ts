// src/env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  // 这里列出你需要的环境变量类型
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_TITLE: string
  // 更多变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}