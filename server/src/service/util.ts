export function intVal(n: number | string): number {
  return typeof n === "number" ? n : parseInt(n);
}
