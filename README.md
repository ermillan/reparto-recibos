# 🚀 Starter profesional React + TypeScript con arquitectura hexagonal

Stack:
- React + Vite + TypeScript
- Rutas públicas/privadas con guard (middleware) y cookie token
- Axios con interceptor (Bearer)
- .env dev/prd y API base
- Tailwind CSS v4 + @tailwindcss/vite
- shadcn/ui listo para instalar
- Husky + lint-staged + Oxlint + Prettier + Vitest

## 1) Crear e instalar
```bash
# scaffold
yarn create vite my-app --template react-ts
cd my-app

# deps runtime
yarn add react-router-dom axios js-cookie zod

# deps dev
yarn add -D typescript @types/node @vitejs/plugin-react tailwindcss @tailwindcss/vite husky lint-staged prettier vitest @vitest/coverage-v8 @testing-library/react @testing-library/jest-dom oxlint
```

## 2) Tailwind v4
- Usa `@import "tailwindcss";` en `src/styles.css` y el plugin `@tailwindcss/vite` en `vite.config.ts`.

## 3) shadcn/ui
```bash
yarn dlx shadcn@latest init
yarn dlx shadcn@latest add button input
```

## 4) Variables de entorno
- `.env.development` y `.env.production` con `VITE_ENV`, URLs base, cookie name y flags de seguridad.

## 5) Árbol Hexagonal
```
src/
├─ domain/
├─ application/
├─ infrastructure/
└─ presentation/
```

## 6) Guards & Router
- `AuthGuard` y `GuestGuard` con cookies.
- `AppRouter.tsx` define rutas públicas/privadas.

## 7) Axios Interceptors
- Agrega `Authorization: Bearer <token>` si la cookie existe.
- Manejo básico de 401.

## 8) Husky + lint-staged + Oxlint + Prettier
- `pre-commit`: lint-staged (oxlint + prettier).
- `pre-push`: typecheck + tests.

## 9) Scripts
```bash
yarn dev
yarn lint:ox
yarn typecheck
yarn test
```

> Para activar husky en tu repo local: `yarn dlx husky init` (o `npm run prepare`).

¡Listo para codificar!