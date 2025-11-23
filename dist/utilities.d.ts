import { type Signal } from "solid-js";
import { SetStoreFunction } from "solid-js/store";
export declare function persist<T>(signal: [T, SetStoreFunction<T>], opts: {
    key: string;
    encode?: (value: T) => string;
    decode?: (value: string) => T;
}): [T, SetStoreFunction<T>];
export declare function persist<T>(signal: Signal<T>, opts: {
    key: string;
    encode?: (value: T) => string;
    decode?: (value: string) => T;
}): Signal<T>;
