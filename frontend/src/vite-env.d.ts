/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APTABASE_APP_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
