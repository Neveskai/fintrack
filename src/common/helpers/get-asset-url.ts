type EnvLike = { VITE_PUBLIC_BUCKET_URL?: string; VITE_PLATFORM?: string };

function getEnv(): EnvLike {
  return (typeof globalThis !== "undefined" && (globalThis as unknown as { __VITE_ENV__?: EnvLike }).__VITE_ENV__) ?? {};
}

export const getAssetUrl = (localPath: string, env?: EnvLike): string => {
  const e = env ?? getEnv();
  if (e.VITE_PLATFORM === "dev") {
    return localPath;
  }

  const cleanPath = localPath.replace(/^\/?assets\//, "");
  const encodedPath = encodeURIComponent(cleanPath);
  const base = e.VITE_PUBLIC_BUCKET_URL ?? "";

  return `${base}${encodedPath}?alt=media`;
};
