import { createEffect } from "solid-js";
import { assert, isFunction, isInstanceOf, isKeyed, isString } from "./guards";
export function persist(mut, opts) {
    const [get, set] = mut;
    // TODO: Signal and SetStoreFunction have no overlap
    const setter = set;
    const { key, encode = JSON.stringify, decode = JSON.parse, onError = console.error, } = opts;
    const item = localStorage.getItem(key);
    try {
        if (isString(item))
            setter(() => decode(item));
    }
    catch (e) {
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
export function onInput(set, key, mut) {
    return (event) => {
        const value = mut(event.currentTarget.value, event);
        // @ts-expect-error
        // Each member of the union type 'Setter<T> | SetStoreFunction<T>' has signatures,
        // but none of those signatures are compatible with each other. [2349]
        set((prev) => ({ ...prev, [key]: value }));
    };
}
export function preventDefault(input) {
    if (isInstanceOf(input, Event))
        input.preventDefault();
    else
        return (event) => {
            preventDefault(event);
            return input(event);
        };
}
export function extract(value, key) {
    return isKeyed(value, key) ? value : undefined;
}
