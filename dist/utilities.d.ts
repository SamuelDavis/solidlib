import { type Signal } from "solid-js";
export declare function persist<T>(signal: Signal<T>, opts: {
    key: string;
    encode?: (value: T) => string;
    decode?: (value: string) => T;
}): Signal<T>;
