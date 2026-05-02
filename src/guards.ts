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
  other: readonly T[] | Record<PropertyKey, T>,
): value is T {
  return Array.isArray(other)
    ? other.includes(value as T)
    : Object.values(other).includes(value as T);
}

export function isIn<T extends PropertyKey>(
  value: unknown,
  other: Record<T, unknown>,
): value is T {
  return (value as T) in other;
}

export function isKeyed<K extends PropertyKey, T = unknown>(
  value: T,
  key: K,
): value is Extract<T, Record<K, unknown>> {
  return isObject(value) && isIn(key, value);
}

export function isFunction<T extends (...args: any[]) => any>(
  value: unknown,
): value is T {
  return typeof value === "function";
}
export function isHtml<T extends keyof HTMLElementTagNameMap>(
  value: unknown,
  tag: T,
): value is HTMLElementTagNameMap[T] {
  return (
    isObject(value) && "tagName" in value && value.tagName === tag.toUpperCase()
  );
}
export function isObject(value: unknown): value is object {
  return typeof value === "object" && value !== null;
}
export function isString(value: unknown): value is string {
  return typeof value === "string";
}
export function isBoolean(value: unknown): value is boolean {
  return value === true || value === false;
}
export function isArray<T>(value: T): value is Extract<T, readonly unknown[]> {
  return Array.isArray(value);
}
export function isNumber(value: unknown): value is number {
  return typeof value === "number" && !Number.isNaN(value);
}
export function isDate(value: unknown): value is Date {
  return value instanceof Date && isNumber(value.getTime());
}
