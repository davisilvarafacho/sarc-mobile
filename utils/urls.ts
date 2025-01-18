export function obj2query(obj: {}): string {
  return Object.entries(obj)
    .map((arr) => arr.join("="))
    .join("&");
}
