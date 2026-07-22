export function getFileNameFromContentDisposition(headerValue: string | null): string | null {
  if (!headerValue) {
    return null;
  }

  const match = /filename\*?=(?:UTF-8''|\")?([^\";]+)/i.exec(headerValue);
  if (!match?.[1]) {
    return null;
  }

  return decodeURIComponent(match[1].replace(/\"/g, "")).trim();
}