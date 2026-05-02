import { type Setter, type Signal } from "solid-js";
import { SetStoreFunction } from "solid-js/store";
import { AnyRecord, KeyOfUnion } from "./types";
type Store<T> = [T, SetStoreFunction<T>];
type PersistOpts<T> = {
    key: string;
    encode?: (value: T) => string;
    decode?: (value: string) => T;
    onError?: (e: Error) => void;
};
export declare function persist<T>(signal: Store<T>, opts: PersistOpts<T>): Store<T>;
export declare function persist<T>(signal: Signal<T>, opts: PersistOpts<T>): Signal<T>;
export declare function onInput<T extends AnyRecord, K extends keyof T, E extends {
    currentTarget: {
        value: string;
    };
}>(set: Setter<T> | SetStoreFunction<T>, key: K, mut: (value: E["currentTarget"]["value"], event: E) => T[K]): (event: E) => void;
export declare function preventDefault<E extends Event>(event: E): void;
export declare function preventDefault<E extends Event>(handler: (event: E) => unknown): (event: E) => void;
export declare function extract<T, K extends PropertyKey & KeyOfUnion<T>>(value: T, key: K): undefined | Extract<T, Record<K, unknown>>;
export {};
