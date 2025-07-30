import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getReportIdFromPathname(): string {
  const pathname = window.location.pathname;
  // "/new-report/123" または "/report/123" などの形式に対応
  const match = pathname.match(/\/(new-report|report)\/([^\/]+)/);
  if (!match) {
    console.error("Current pathname:", pathname);
    throw new Error(`Invalid report ID. Current path: ${pathname}`);
  }
  return match[2];
}

export function getReportIdFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    // "/new-report/123" または "/report/123" などの形式に対応
    const match = pathname.match(/\/(new-report|report)\/([^\/]+)/);
    if (!match) {
      throw new Error(`Invalid report ID. Current path: ${pathname}`);
    }
    return match[2];
  } catch {
    throw new Error(`Failed to extract report ID from URL: ${url}`);
  }
}
