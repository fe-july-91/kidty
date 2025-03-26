export function findKeyByValue(obj: any, value: string) {
  return Object.entries(obj).find(([_, val]) => val === value)?.[0];
}
