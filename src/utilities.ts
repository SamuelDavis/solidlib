import { createEffect, type Signal } from "solid-js";
import { isString } from "./guards";

export function persist<T>(
  signal: Signal<T>,
  opts: {
    key: string;
    encode?: (value: T) => string;
    decode?: (value: string) => T;
  },
): Signal<T> {
  const [get, set] = signal;
  const { key, encode = JSON.stringify, decode = JSON.parse } = opts;

  const item = localStorage.getItem(key);
  if (isString(item)) set(decode(item));
  createEffect(() => localStorage.setItem(key, encode(get())));

  return signal;
}
