import { type Signal } from "solid-js";
import { SetStoreFunction } from "solid-js/store";
type Store<T> = [T, SetStoreFunction<T>];
type PersistOpts<T> = {
    key: string;
    encode?: (value: T) => string;
    decode?: (value: string) => T;
};
export declare function persist<T>(signal: Store<T>, opts: PersistOpts<T>): Store<T>;
export declare function persist<T>(signal: Signal<T>, opts: PersistOpts<T>): Signal<T>;
export {};
