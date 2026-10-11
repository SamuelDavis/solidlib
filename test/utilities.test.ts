import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { describe, expect, expectTypeOf, it, vi } from "vitest";
import { extract, onInput, preventDefault } from "../src/utilities";

describe("onInput", () => {
  it("sets the key to the mutated input value", () => {
    let state = { name: "", age: 0 };
    const set = (update: (prev: typeof state) => typeof state) => {
      state = update(state);
    };
    const handler = onInput(set, "age", Number);

    handler({ currentTarget: { value: "42" } });

    expect(state).toEqual({ name: "", age: 42 });
  });

  it("accepts signal and store setters", () => {
    const [, setSignal] = createSignal({ name: "" });
    const [, setStore] = createStore({ name: "" });

    expectTypeOf(onInput(setSignal, "name", String)).toBeFunction();
    expectTypeOf(onInput(setStore, "name", String)).toBeFunction();
  });
});

describe("preventDefault", () => {
  it("prevents an event", () => {
    const event = new Event("submit", { cancelable: true });

    preventDefault(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it("wraps a handler", () => {
    const event = new Event("submit", { cancelable: true });
    const handler = vi.fn();

    preventDefault(handler)(event);

    expect(event.defaultPrevented).toBe(true);
    expect(handler).toHaveBeenCalledWith(event);
  });
});

describe("extract", () => {
  it("returns union members with the key", () => {
    const value = { a: 1 } as { a: number } | { b: string };

    expect(extract(value, "a")).toBe(value);
  });

  it("returns undefined otherwise", () => {
    const value = { b: "" } as { a: number } | { b: string };

    expect(extract(value, "a")).toBeUndefined();
  });
});
