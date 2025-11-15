import { assert as test, describe, it } from "vitest";
import { isOf, isIn, isInstanceOf, assert } from "./guards";

describe("isValueOf", () => {
  it("supports arrays", () => {
    test.isTrue(isOf("a", ["a", "b"]));
    test.isTrue(isOf("b", ["a", "b"]));
    test.isFalse(isOf("c", ["a", "b"]));
  });

  it("supports objects", () => {
    test.isTrue(isOf("a", { foo: "a", bar: "b" }));
    test.isTrue(isOf("b", { foo: "a", bar: "b" }));
    test.isFalse(isOf("qux", { foo: "a", bar: "b" }));
  });
});

describe("isKeyOf", () => {
  it("supports arrays", () => {
    test.isTrue(isIn(0, ["a", "b", "c"]));
    test.isTrue(isIn(2, ["a", "b", "c"]));
    test.isFalse(isIn(3, ["a", "b", "c"]));
  });

  it("supports objects", () => {
    test.isTrue(isIn("foo", { foo: "a", bar: "b" }));
    test.isTrue(isIn("bar", { foo: "a", bar: "b" }));
    test.isFalse(isIn("qux", { foo: "a", bar: "b" }));
  });
});

describe("isInstanceOf", () => {
  it("supports errors", () => {
    test.isTrue(isInstanceOf(new Error(), Error));
    test.isTrue(isInstanceOf(new TypeError(), Error));
    test.isFalse(isInstanceOf(new Error(), TypeError));
  });
});

describe("assert", () => {
  it("isValueOf", () => {
    test.doesNotThrow(() => assert(isOf, "b", ["a", "b"]));
    test.throws(() => assert(isOf, "c", ["a", "b"]));
    test.doesNotThrow(() => assert(isOf, "b", { foo: "a", bar: "b" }));
    test.throws(() => assert(isOf, "qux", { foo: "a", bar: "b" }));
  });

  it("isKeyOf", () => {
    test.doesNotThrow(() => assert(isIn, 2, ["a", "b", "c"]));
    test.throws(() => assert(isIn, 3, ["a", "b", "c"]));
    test.doesNotThrow(() => assert(isIn, "bar", { foo: "a", bar: "b" }));
    test.throws(() => assert(isIn, "qux", { foo: "a", bar: "b" }));
  });

  it("isInstanceOf", () => {
    test.doesNotThrow(() => assert(isInstanceOf, new TypeError(), Error));
    test.throws(() => assert(isInstanceOf, new Error(), TypeError));
  });
});
