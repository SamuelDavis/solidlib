export function assert<T, Args extends any[]>(
  guard: (value: unknown, ...args: Args) => value is T,
  value: unknown,
  ...args: Args
): asserts value is T {
  if (!guard(value, ...args)) throw new TypeError();
}

export function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

export function isInstanceOf<V>(
  value: unknown,
  ctor: new (...args: any[]) => V,
): value is V {
  return value instanceof ctor;
}

export function isOf<T>(
  value: unknown,
  other: T[] | Record<string | number | symbol, T>,
): value is T {
  return Array.isArray(other)
    ? other.includes(value as any)
    : Object.values(other).includes(value as any);
}

export function isIn<T extends string | number | symbol>(
  value: unknown,
  other: Record<T, any>,
): value is T {
  return (value as any) in other;
}

export function isFunction<T extends (...args: any[]) => any>(
  value: unknown | T,
): value is T {
  return typeof value === "function";
}
export function isString(value: unknown): value is string {
  return typeof value === "string";
}
export function isBoolean(value: unknown): value is boolean {
  return value === true || value === false;
}
export function isArray<T = unknown>(value: T[] | unknown): value is T[] {
  return Array.isArray(value);
}
export function isNumber(value: unknown): value is number {
  return typeof value === "number" && !Number.isNaN(value);
}
export function isDate(value: unknown, cast: boolean = false): value is Date {
  value = cast ? new Date(value as string) : value;
  return value instanceof Date && isNumber(value.getTime());
}
