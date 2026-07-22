export function absoluteUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://buscavagas.com.br";
  return `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
}
