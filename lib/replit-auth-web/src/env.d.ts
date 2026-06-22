// Minimal ambient typing for the Vite-injected `import.meta.env.BASE_URL`.
// This lib is consumed by Vite web apps but is itself built with `tsc --build`
// (no vite/client types), so declare just the shape it relies on.
interface ImportMetaEnv {
  readonly BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
