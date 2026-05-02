import { createEffect, type Setter, type Signal } from "solid-js";
import { assert, isFunction, isInstanceOf, isKeyed, isString } from "./guards";
import { SetStoreFunction } from "solid-js/store";
import { AnyRecord, KeyOfUnion } from "./types";

type Store<T> = [T, SetStoreFunction<T>];
type PersistOpts<T> = {
  key: string;
  encode?: (value: T) => string;
  decode?: (value: string) => T;
  onError?: (e: Error) => void;
};
type Mut<T> = Signal<T> | Store<T>;
export function persist<T>(signal: Store<T>, opts: PersistOpts<T>): Store<T>;
export function persist<T>(signal: Signal<T>, opts: PersistOpts<T>): Signal<T>;
export function persist<T>(mut: Mut<T>, opts: PersistOpts<T>): Mut<T> {
  const [get, set] = mut;
  // TODO: Signal and SetStoreFunction have no overlap
  const setter = set as unknown as (cb: () => T) => any;
  const {
    key,
    encode = JSON.stringify,
    decode = JSON.parse,
    onError = console.error,
  } = opts;

  const item = localStorage.getItem(key);
  try {
    if (isString(item)) setter(() => decode(item));
  } catch (e) {
    assert(isInstanceOf, e, Error);
    onError(new Error(e.message, { cause: item }));
    const value = isFunction(get) ? get() : get;
    localStorage.setItem(key, encode(value));
  }

  createEffect(() => {
    const value = isFunction(get) ? get() : get;
    return localStorage.setItem(key, encode(value));
  });

  return mut;
}

export function onInput<
  T extends AnyRecord,
  K extends keyof T,
  E extends { currentTarget: { value: string } },
>(
  set: Setter<T> | SetStoreFunction<T>,
  key: K,
  mut: (value: E["currentTarget"]["value"], event: E) => T[K],
): (event: E) => void {
  return (event: E): void => {
    const value = mut(event.currentTarget.value, event);
    // @ts-expect-error
    // Each member of the union type 'Setter<T> | SetStoreFunction<T>' has signatures,
    // but none of those signatures are compatible with each other. [2349]
    set((prev) => ({ ...prev, [key]: value }));
  };
}

export function preventDefault<E extends Event>(event: E): void;
export function preventDefault<E extends Event>(
  handler: (event: E) => unknown,
): (event: E) => void;
export function preventDefault<E extends Event>(
  input: E | ((e: E) => unknown),
) {
  if (isInstanceOf(input, Event)) input.preventDefault();
  else
    return (event: E) => {
      preventDefault(event);
      return input(event);
    };
}

export function extract<T, K extends PropertyKey & KeyOfUnion<T>>(
  value: T,
  key: K,
): undefined | Extract<T, Record<K, unknown>> {
  return isKeyed(value, key) ? value : undefined;
}
