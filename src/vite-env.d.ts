/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_MAPS_API_KEY: string
  readonly VITE_NAVER_MAPS_CLIENT_ID: string
  readonly VITE_NAVER_MAPS_CLIENT_SECRET: string
  readonly VITE_KAKAO_MAP_APP_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
