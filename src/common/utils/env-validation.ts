const REQUIRED_VARS = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_APP_ID",
] as const;

const OPTIONAL_VARS = [
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
] as const;

type EnvLike = { PROD?: boolean; [key: string]: string | boolean | undefined };

function getEnv(): EnvLike {
  return (typeof globalThis !== "undefined" && (globalThis as unknown as { __VITE_ENV__?: EnvLike }).__VITE_ENV__) ?? {};
}

export function validateEnv(env?: EnvLike): void {
  const e = env ?? getEnv();
  if (e.PROD) return;

  const missing = REQUIRED_VARS.filter((key) => !e[key]);

  if (missing.length > 0) {
    console.warn(
      `[FinTrack] Variáveis obrigatórias não configuradas: ${missing.join(", ")}.\n` +
        `Copie .env.example para .env e preencha os valores. Consulte o README.`
    );
  }

  const missingOptional = OPTIONAL_VARS.filter((key) => !e[key]);

  if (missingOptional.length > 0) {
    console.info(
      `[FinTrack] Variáveis opcionais não configuradas: ${missingOptional.join(", ")}.`
    );
  }
}
