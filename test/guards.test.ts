import { describe, expect, expectTypeOf, it } from "vitest";
import {
  assert,
  isArray,
  isBoolean,
  isDate,
  isFunction,
  isHtml,
  isIn,
  isInstanceOf,
  isKeyed,
  isNonNullable,
  isNumber,
  isObject,
  isOf,
  isString,
} from "../src/guards";

describe("assert", () => {
  it("passes when the guard holds", () => {
    expect(() => assert(isString, "a")).not.toThrow();
  });

  it("throws a TypeError naming the guard", () => {
    expect(() => assert(isString, 1)).toThrow(new TypeError("isString"));
  });

  it("forwards extra arguments to the guard", () => {
    expect(() => assert(isOf, "b", ["a", "b"])).not.toThrow();
    expect(() => assert(isOf, "c", ["a", "b"])).toThrow(TypeError);
  });
});

describe("isNonNullable", () => {
  it.each([0, "", false, NaN, {}])("accepts %o", (value) => {
    expect(isNonNullable(value)).toBe(true);
  });

  it.each([null, undefined])("rejects %o", (value) => {
    expect(isNonNullable(value)).toBe(false);
  });
});

describe("isInstanceOf", () => {
  it("checks the prototype chain", () => {
    expect(isInstanceOf(new RangeError(), Error)).toBe(true);
    expect(isInstanceOf({}, Error)).toBe(false);
  });
});

describe("isOf", () => {
  it("checks array members", () => {
    expect(isOf("a", ["a", "b"])).toBe(true);
    expect(isOf("c", ["a", "b"])).toBe(false);
  });

  it("checks record values", () => {
    expect(isOf(1, { a: 1 })).toBe(true);
    expect(isOf("a", { a: 1 })).toBe(false);
  });
});

describe("isIn", () => {
  it("checks accessible keys", () => {
    expect(isIn("a", { a: 1 })).toBe(true);
    expect(isIn("b", { a: 1 })).toBe(false);
  });

  it("includes inherited keys", () => {
    expect(isIn("toString", {})).toBe(true);
  });
});

describe("isKeyed", () => {
  it("checks objects for an accessible key", () => {
    expect(isKeyed({ a: undefined }, "a")).toBe(true);
    expect(isKeyed({}, "constructor")).toBe(true);
    expect(isKeyed({}, "a")).toBe(false);
  });

  it.each([null, undefined, "a", 1])("rejects non-object %o", (value) => {
    expect(isKeyed(value, "length")).toBe(false);
  });

  it("narrows unions to members with the key", () => {
    const value = { a: 1 } as { a: number } | { b: string };
    if (isKeyed(value, "a")) expectTypeOf(value).toEqualTypeOf<{ a: number }>();
  });

  it("narrows unknown to a keyed record", () => {
    const value: unknown = { a: 1 };
    if (isKeyed(value, "a"))
      expectTypeOf(value).toEqualTypeOf<Record<"a", unknown>>();
  });
});

describe("isFunction", () => {
  it("checks callables", () => {
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction(class {})).toBe(true);
    expect(isFunction({})).toBe(false);
  });

  it("narrows unions to their function members", () => {
    const value = (() => 1) as (() => number) | string;
    if (isFunction(value)) expectTypeOf(value).toEqualTypeOf<() => number>();
  });
});

describe("isHtml", () => {
  it("matches tag names case-insensitively", () => {
    expect(isHtml({ tagName: "INPUT" }, "input")).toBe(true);
    expect(isHtml({ tagName: "SELECT" }, "input")).toBe(false);
    expect(isHtml(null, "input")).toBe(false);
  });
});

describe("isObject", () => {
  it.each([{}, [], new Date()])("accepts %o", (value) => {
    expect(isObject(value)).toBe(true);
  });

  it.each([null, undefined, "a", 1, () => {}])("rejects %o", (value) => {
    expect(isObject(value)).toBe(false);
  });
});

describe("isString", () => {
  it("checks primitives only", () => {
    expect(isString("")).toBe(true);
    expect(isString(new String(""))).toBe(false);
  });
});

describe("isBoolean", () => {
  it("checks primitives only", () => {
    expect(isBoolean(false)).toBe(true);
    expect(isBoolean(0)).toBe(false);
  });
});

describe("isArray", () => {
  it("checks arrays", () => {
    expect(isArray([])).toBe(true);
    expect(isArray({ length: 0 })).toBe(false);
  });

  it("narrows unions to their array members", () => {
    const value = [] as string[] | string;
    if (isArray(value)) expectTypeOf(value).toEqualTypeOf<string[]>();
  });
});

describe("isNumber", () => {
  it.each([0, -1, Infinity])("accepts %o", (value) => {
    expect(isNumber(value)).toBe(true);
  });

  it.each([NaN, "1", 1n])("rejects %o", (value) => {
    expect(isNumber(value)).toBe(false);
  });
});

describe("isDate", () => {
  it("accepts valid dates only", () => {
    expect(isDate(new Date())).toBe(true);
    expect(isDate(new Date("invalid"))).toBe(false);
    expect(isDate(Date.now())).toBe(false);
  });
});
