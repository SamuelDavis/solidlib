import type { ComponentProps, ValidComponent } from "solid-js";
import { DOMElement } from "solid-js/jsx-runtime";
export type AnyRecord<Value = any> = Record<PropertyKey, Value>;
export type { Signal, EffectFunction } from "solid-js";
export type KeyOfUnion<T> = T extends unknown ? keyof T : never;
export type Targeted<El extends Element = HTMLElement, Ev extends Event = Event> = Ev & {
    currentTarget: El;
    target: DOMElement;
};
export type ExtendProps<Source extends ValidComponent, Extension extends AnyRecord = Record<never, never>, Ignore extends keyof ComponentProps<Source> = never> = Omit<ComponentProps<Source>, keyof Extension | Ignore> & Extension;
