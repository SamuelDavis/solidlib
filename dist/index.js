import { spread, mergeProps as mergeProps$1, insert, createComponent, Portal, use, template, delegateEvents } from 'solid-js/web';
import { mergeProps, splitProps, Show, onMount, onCleanup, createEffect } from 'solid-js';

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
function isKeyed(value, key) {
  return isObject(value) && isIn(key, value);
}
function isFunction(value) {
  return typeof value === "function";
}
function isHtml(value, tag) {
  return isObject(value) && "tagName" in value && value.tagName === tag.toUpperCase();
}
function isObject(value) {
  return typeof value === "object";
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
  _tmpl$2 = /*#__PURE__*/template(`<time>`),
  _tmpl$3 = /*#__PURE__*/template(`<i>`),
  _tmpl$4 = /*#__PURE__*/template(`<dialog open>`);
function HTMLNumber(props) {
  const merged = mergeProps({
    highlight: false,
    money: false,
    precision: 2,
    fill: true,
    options: {},
    locales: "en-US"
  }, props);
  const [local, parent] = splitProps(merged, ["highlight", "money", "precision", "options", "locales"]);
  const getNumberFormatOptions = () => ({
    minimumFractionDigits: local.precision,
    maximumFractionDigits: local.precision,
    ...local.options
  });
  const getText = () => merged.value.toLocaleString(local.locales, getNumberFormatOptions());
  const getIsPositive = () => {
    if (merged.highlight === "positive") return true;
    if (merged.highlight === true && merged.value > 0) return true;
    return undefined;
  };
  const getIsNegative = () => {
    if (merged.highlight === "negative") return true;
    if (merged.highlight === true && merged.value < 0) return true;
    return undefined;
  };
  return (() => {
    var _el$ = _tmpl$();
    spread(_el$, mergeProps$1({
      get ["data-money"]() {
        return merged.money || undefined;
      },
      get ["data-positive"]() {
        return getIsPositive();
      },
      get ["data-negative"]() {
        return getIsNegative();
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
  const [local, parent] = splitProps(merged, ["children", "value", "options", "locales"]);
  return (() => {
    var _el$2 = _tmpl$2();
    spread(_el$2, mergeProps$1({
      get datetime() {
        return local.value.toUTCString();
      }
    }, parent), false, true);
    insert(_el$2, createComponent(Show, {
      get when() {
        return local.children;
      },
      get fallback() {
        return local.value.toLocaleDateString(local.locales, local.options);
      },
      children: children => children()
    }));
    return _el$2;
  })();
}
/**
 * @link https://fonts.google.com/icons?icon.set=Material+Symbols
 * @example <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Symbol" />
 */
function HTMLIcon(props) {
  const merged = mergeProps({
    role: props.onClick ? "button" : undefined,
    title: props.type,
    variant: "symbol",
    classList: {}
  }, props);
  const [local, parent] = splitProps(merged, ["type", "variant", "class"]);
  const getVariantClass = () => `material-${local.variant}s`;
  const getClass = () => `${getVariantClass()} ${local.class}`.trimEnd();
  return (() => {
    var _el$3 = _tmpl$3();
    spread(_el$3, mergeProps$1({
      get ["class"]() {
        return getClass();
      }
    }, parent), false, true);
    insert(_el$3, () => local.type);
    return _el$3;
  })();
}
function Modal(props) {
  const merged = mergeProps({
    when: true,
    mount: document.body
  }, props);
  const [local, parent] = splitProps(merged, ["onClose", "onClick", "ref", "mount", "when"]);
  const onKeyDown = event => event.key === "Escape" && local.onClose?.(event);
  onMount(() => window.addEventListener("keydown", onKeyDown));
  onCleanup(() => window.removeEventListener("keydown", onKeyDown));
  function onClick(event) {
    if (event.target === local.ref) local.onClose?.(event);
    if (isFunction(local.onClick) && isHtml(local.ref, "dialog")) local.onClick({
      ...event,
      currentTarget: local.ref,
      target: local.ref
    });
  }
  return createComponent(Show, {
    get when() {
      return local.when;
    },
    get children() {
      return createComponent(Portal, {
        get mount() {
          return local.mount;
        },
        get children() {
          var _el$4 = _tmpl$4();
          var _ref$ = local.ref;
          typeof _ref$ === "function" ? use(_ref$, _el$4) : local.ref = _el$4;
          _el$4.$$click = onClick;
          spread(_el$4, parent, false, true);
          insert(_el$4, () => props.children);
          return _el$4;
        }
      });
    }
  });
}
delegateEvents(["click"]);

function persist(mut, opts) {
  const [get, set] = mut;
  // TODO: Signal and SetStoreFunction have no overlap
  const setter = set;
  const {
    key,
    encode = JSON.stringify,
    decode = JSON.parse
  } = opts;
  const item = localStorage.getItem(key);
  if (isString(item)) setter(() => decode(item));
  createEffect(() => {
    const value = isFunction(get) ? get() : get;
    return localStorage.setItem(key, encode(value));
  });
  return mut;
}
function onInput(set, key, mut) {
  return event => {
    const value = mut(event.currentTarget.value, event);
    // @ts-ignore
    // Each member of the union type 'Setter<T> | SetStoreFunction<T>' has signatures,
    // but none of those signatures are compatible with each other. [2349]
    set(prev => ({
      ...prev,
      [key]: value
    }));
  };
}
function preventDefault(event) {
  event.preventDefault();
}
function extract(value, key) {
  return isKeyed(value, key) ? value : undefined;
}

export { HTMLDate, HTMLIcon, HTMLNumber, Modal, assert, extract, isArray, isBoolean, isDate, isFunction, isHtml, isIn, isInstanceOf, isKeyed, isNonNullable, isNumber, isObject, isOf, isString, onInput, persist, preventDefault };
