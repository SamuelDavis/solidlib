import { createEffect } from "solid-js";
import { isFunction, isString } from "./guards";
export function persist(mut, opts) {
    const [get, set] = mut;
    // TODO: Signal and SetStoreFunction have no overlap
    const setter = set;
    const { key, encode = JSON.stringify, decode = JSON.parse } = opts;
    const item = localStorage.getItem(key);
    if (isString(item))
        setter(() => decode(item));
    createEffect(() => {
        const value = isFunction(get) ? get() : get;
        return localStorage.setItem(key, encode(value));
    });
    return mut;
}
export function onInput(set, key, mut) {
    return (event) => {
        const value = mut(event.currentTarget.value, event);
        // @ts-ignore
        // Each member of the union type 'Setter<T> | SetStoreFunction<T>' has signatures,
        // but none of those signatures are compatible with each other. [2349]
        set((prev) => ({ ...prev, [key]: value }));
    };
}
export function preventDefault(event) {
    event.preventDefault();
}
