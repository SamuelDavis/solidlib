import type { ComponentProps, ValidComponent } from "solid-js";
import { DOMElement } from "solid-js/jsx-runtime";

export type AnyRecord<Value = any> = Record<symbol | string | number, Value>;
export type { Signal, EffectFunction } from "solid-js";

export type Targeted<
  El extends Element = HTMLElement,
  Ev extends Event = Event,
> = Ev & {
  currentTarget: El;
  target: DOMElement;
};

export type ExtendProps<
  Source extends ValidComponent,
  Extension extends AnyRecord = {},
  Ignore extends keyof Source = never,
> = Omit<ComponentProps<Source>, keyof Extension | Ignore> & Extension;
