import { createEffect, type Signal } from "solid-js";
import { reconcile, type SetStoreFunction } from "solid-js/store";
import { isFunction, isInstanceOf, isKeyed, isString } from "./guards";
import type { AnyRecord, KeyOfUnion, Narrow } from "./types";

type Store<T> = [T, SetStoreFunction<T>];
type Reactive<T> = Signal<T> | Store<T>;
type Accessors<T> = [get: () => T, set: (value: T) => void];
type Update<T> = (update: (prev: T) => T) => unknown;
type PersistOpts<T> = {
  key: string;
  encode?: (value: T) => string;
  decode?: (value: string) => T;
  onError?: (e: Error) => void;
};

function isSignal<T>(reactive: Reactive<T>): reactive is Signal<T> {
  return isFunction(reactive[0]);
}

function toAccessors<T>(reactive: Reactive<T>): Accessors<T> {
  if (isSignal(reactive)) {
    const [get, set] = reactive;
    return [get, (value) => set(() => value)];
  }
  const [store, setStore] = reactive;
  return [() => store, (value) => setStore(reconcile(value))];
}

export function persist<T>(store: Store<T>, opts: PersistOpts<T>): Store<T>;
export function persist<T>(signal: Signal<T>, opts: PersistOpts<T>): Signal<T>;
export function persist<T>(
  reactive: Reactive<T>,
  opts: PersistOpts<T>,
): Reactive<T> {
  const [get, set] = toAccessors(reactive);
  const {
    key,
    encode = JSON.stringify,
    decode = JSON.parse,
    onError = console.error,
  } = opts;

  function fail(message: string, cause: unknown): void {
    onError(new Error(message, { cause }));
  }

  const item = localStorage.getItem(key);
  if (isString(item)) {
    try {
      set(decode(item));
    } catch (e) {
      fail(`Failed to restore "${key}" from ${item}`, e);
    }
  }

  createEffect(() => {
    try {
      localStorage.setItem(key, encode(get()));
    } catch (e) {
      fail(`Failed to persist "${key}"`, e);
    }
  });

  return reactive;
}

export function onInput<
  T extends AnyRecord,
  K extends keyof T,
  E extends { currentTarget: { value: string } },
>(
  set: Update<T>,
  key: K,
  parse: (value: E["currentTarget"]["value"], event: E) => T[K],
): (event: E) => void {
  return (event: E): void => {
    const value = parse(event.currentTarget.value, event);
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
): undefined | Narrow<T, Record<K, unknown>> {
  return isKeyed(value, key) ? value : undefined;
}
