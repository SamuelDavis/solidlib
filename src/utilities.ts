import { createEffect, type Signal } from "solid-js";
import { isFunction, isString } from "./guards";
import { SetStoreFunction } from "solid-js/store";

export function persist<T>(
  signal: [T, SetStoreFunction<T>],
  opts: {
    key: string;
    encode?: (value: T) => string;
    decode?: (value: string) => T;
  },
): [T, SetStoreFunction<T>];
export function persist<T>(
  signal: Signal<T>,
  opts: {
    key: string;
    encode?: (value: T) => string;
    decode?: (value: string) => T;
  },
): Signal<T>;
export function persist<T>(
  signal: [T | (() => T), (v: T) => any],
  opts: {
    key: string;
    encode?: (value: T) => string;
    decode?: (value: string) => T;
  },
) {
  const [get, set] = signal;
  const { key, encode = JSON.stringify, decode = JSON.parse } = opts;

  const item = localStorage.getItem(key);
  if (isString(item)) set(decode(item));
  createEffect(() => {
    const value = isFunction(get) ? get() : get;
    return localStorage.setItem(key, encode(value));
  });

  return signal;
}
