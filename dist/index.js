import { template, spread, mergeProps as mergeProps$1, insert } from 'solid-js/web';
import { mergeProps, splitProps, createEffect } from 'solid-js';

function assert(guard, value, ...args) {
  if (!guard(value, ...args)) throw new TypeError();
}
function isNonNullable(value) {
  return value !== null && value !== undefined;
}
function isInstanceOf(value, ctor) {
  return value instanceof ctor;
}
function isOf(value, other) {
  return Array.isArray(other) ? other.includes(value) : Object.values(other).includes(value);
}
function isIn(value, other) {
  return value in other;
}
function isFunction(value) {
  return typeof value === "function";
}
function isString(value) {
  return typeof value === "string";
}
function isBoolean(value) {
  return value === true || value === false;
}
function isArray(value) {
  return Array.isArray(value);
}
function isNumber(value) {
  return typeof value === "number" && !Number.isNaN(value);
}
function isDate(value, cast = false) {
  value = cast ? new Date(value) : value;
  return value instanceof Date && isNumber(value.getTime());
}

var _tmpl$ = /*#__PURE__*/template(`<span>`),
  _tmpl$2 = /*#__PURE__*/template(`<i>`);
function HTMLNumber(props) {
  const merged = mergeProps({
    highlight: false,
    money: false,
    precision: 2,
    fill: true,
    classList: {},
    options: {},
    locales: "en-US"
  }, props);
  const [local, parent] = splitProps(merged, ["highlight", "money", "precision", "options", "locales", "classList"]);
  const getClassList = () => {
    const {
      money,
      highlight,
      value
    } = merged;
    return {
      money,
      positive: highlight && value > 0,
      negative: highlight && value < 0,
      ...local.classList
    };
  };
  const getNumberFormatOptions = () => ({
    minimumFractionDigits: local.precision,
    maximumFractionDigits: local.precision,
    ...local.options
  });
  const getText = () => merged.value.toLocaleString(local.locales, getNumberFormatOptions());
  return (() => {
    var _el$ = _tmpl$();
    spread(_el$, mergeProps$1({
      get classList() {
        return getClassList();
      }
    }, parent), false, true);
    insert(_el$, getText);
    return _el$;
  })();
}
function HTMLDate(props) {
  const merged = mergeProps({
    options: {},
    locales: "en-US"
  }, props);
  const [local, parent] = splitProps(merged, ["value", "options", "locales"]);
  return (() => {
    var _el$2 = _tmpl$();
    spread(_el$2, parent, false, true);
    insert(_el$2, () => local.value.toLocaleDateString(local.locales, local.options));
    return _el$2;
  })();
}
/**
 * @see: https://fonts.googleapis.com/icon?family=Material+Icons
 */
function HTMLIcon(props) {
  props = mergeProps({
    role: props.onClick ? "button" : undefined,
    title: props.type,
    classList: {}
  }, props);
  const [local, parent] = splitProps(props, ["type", "classList"]);
  const getClassList = () => ({
    "material-icons": true,
    ...local.classList
  });
  return (() => {
    var _el$3 = _tmpl$2();
    spread(_el$3, mergeProps$1({
      get classList() {
        return getClassList();
      }
    }, parent), false, true);
    insert(_el$3, () => local.type);
    return _el$3;
  })();
}

function persist(signal, opts) {
  const [get, set] = signal;
  const {
    key,
    encode = JSON.stringify,
    decode = JSON.parse
  } = opts;
  const item = localStorage.getItem(key);
  if (isString(item)) set(decode(item));
  createEffect(() => localStorage.setItem(key, encode(get())));
  return signal;
}

export { HTMLDate, HTMLIcon, HTMLNumber, assert, isArray, isBoolean, isDate, isFunction, isIn, isInstanceOf, isNonNullable, isNumber, isOf, isString, persist };
