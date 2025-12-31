export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function withBasePath(pathname: string): string {
  const base = BASE_PATH.endsWith('/') ? BASE_PATH.slice(0, -1) : BASE_PATH;
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return base ? `${base}${path}` : path;
}
