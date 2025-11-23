import { createEffect, type Signal } from "solid-js";
import { isFunction, isString } from "./guards";
import { SetStoreFunction } from "solid-js/store";

type Store<T> = [T, SetStoreFunction<T>];
type PersistOpts<T> = {
  key: string;
  encode?: (value: T) => string;
  decode?: (value: string) => T;
};
type Mut<T> = Signal<T> | Store<T>;
export function persist<T>(signal: Store<T>, opts: PersistOpts<T>): Store<T>;
export function persist<T>(signal: Signal<T>, opts: PersistOpts<T>): Signal<T>;
export function persist<T>(mut: Mut<T>, opts: PersistOpts<T>): Mut<T> {
  const [get, set] = mut;
  // TODO: Signal and SetStoreFunction have no overlap
  const setter = set as unknown as (cb: () => T) => any;
  const { key, encode = JSON.stringify, decode = JSON.parse } = opts;

  const item = localStorage.getItem(key);
  if (isString(item)) setter(() => decode(item));
  createEffect(() => {
    const value = isFunction(get) ? get() : get;
    return localStorage.setItem(key, encode(value));
  });

  return mut;
}
