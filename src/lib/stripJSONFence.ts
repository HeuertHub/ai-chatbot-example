export function stripJSONFence(s: string) {
  if (!s) return s;
  return s
    .replace(/^\s*```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();
}
