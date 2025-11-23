import { createEffect } from "solid-js";
import { isFunction, isString } from "./guards";
export function persist(signal, opts) {
    const [get, set] = signal;
    const { key, encode = JSON.stringify, decode = JSON.parse } = opts;
    const item = localStorage.getItem(key);
    if (isString(item))
        set(decode(item));
    createEffect(() => {
        const value = isFunction(get) ? get() : get;
        return localStorage.setItem(key, encode(value));
    });
    return signal;
}
