import type { TranscriptLine } from "../types";
export async function getTranscript(
  url: string,
  signal?: AbortSignal,
): Promise<TranscriptLine[]> {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error("Không tải được transcript.");
  return response.json();
}
