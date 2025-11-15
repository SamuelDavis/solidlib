import { createEffect } from "solid-js";
import { isString } from "./guards";
export function persist(signal, opts) {
    const [get, set] = signal;
    const { key, encode = JSON.stringify, decode = JSON.parse } = opts;
    const item = localStorage.getItem(key);
    if (isString(item))
        set(decode(item));
    createEffect(() => localStorage.setItem(key, encode(get())));
    return signal;
}
