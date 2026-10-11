import {
  type Accessor,
  type ComponentProps,
  type JSX,
  mergeProps,
  onMount,
  Show,
  splitProps,
} from "solid-js";
import { Portal } from "solid-js/web";
import { isDate, isFunction, isOf } from "./guards";
import type { ExtendProps, Targeted } from "./types";

const BUTTON_KEYS = ["Enter", " "] as const;

type Sign = "positive" | "negative";

type HTMLNumberProps = ExtendProps<
  "span",
  {
    value: number;
    money?: boolean;
    precision?: number;
    highlight?: boolean | Sign;
    options?: Intl.NumberFormatOptions;
    locales?: Intl.LocalesArgument;
  }
>;

export function HTMLNumber(props: HTMLNumberProps) {
  const merged = mergeProps(
    {
      highlight: false,
      money: false,
      precision: 2,
      options: {} as Intl.NumberFormatOptions,
    },
    props,
  );
  const [local, parent] = splitProps(merged, [
    "value",
    "highlight",
    "money",
    "precision",
    "options",
    "locales",
  ]);
  const getNumberFormatOptions = (): Intl.NumberFormatOptions => ({
    minimumFractionDigits: Math.min(
      local.precision,
      local.options.maximumFractionDigits ?? local.precision,
    ),
    maximumFractionDigits: Math.max(
      local.precision,
      local.options.minimumFractionDigits ?? local.precision,
    ),
    ...local.options,
  });
  const getText = () =>
    local.value.toLocaleString(local.locales, getNumberFormatOptions());
  const getValueSign = (): Sign | undefined => {
    if (local.value > 0) return "positive";
    if (local.value < 0) return "negative";
    return undefined;
  };
  const getSign = (): Sign | undefined =>
    local.highlight === true ? getValueSign() : local.highlight || undefined;

  return (
    <span
      data-money={local.money || undefined}
      data-positive={getSign() === "positive" || undefined}
      data-negative={getSign() === "negative" || undefined}
      {...parent}
    >
      {getText()}
    </span>
  );
}

type HTMLDateProps = ExtendProps<
  "time",
  {
    value: Date;
    locales?: Intl.LocalesArgument;
    options?: Intl.DateTimeFormatOptions;
  },
  "datetime"
>;

export function HTMLDate(props: HTMLDateProps) {
  const merged = mergeProps({ options: {} }, props);
  const [local, parent] = splitProps(merged, [
    "children",
    "value",
    "options",
    "locales",
  ]);
  const getDateTime = () =>
    isDate(local.value) ? local.value.toISOString() : undefined;
  const getText = () =>
    local.children ??
    local.value.toLocaleDateString(local.locales, local.options);

  return (
    <time datetime={getDateTime()} {...parent}>
      {getText()}
    </time>
  );
}

type MaterialFont =
  | "icons"
  | "icons-outlined"
  | "icons-round"
  | "icons-sharp"
  | "icons-two-tone"
  | "symbols-outlined"
  | "symbols-rounded"
  | "symbols-sharp";

type HTMLIconProps = ExtendProps<"i", { type: string; variant?: MaterialFont }>;

/**
 * Load the stylesheet matching `variant`.
 * Symbols: `Material+Symbols+{Outlined|Rounded|Sharp}`.
 * Icons: `Material+Icons[+{Outlined|Round|Sharp|Two+Tone}]`.
 * @link https://fonts.google.com/icons
 * @example <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
 * @example <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
 */
export function HTMLIcon(props: HTMLIconProps) {
  const getIsClickable = () => Boolean(props.onClick);
  const merged = mergeProps(
    {
      variant: "symbols-outlined" as const,
      class: "",
      get title() {
        return props.type;
      },
      get role() {
        return getIsClickable() ? ("button" as const) : undefined;
      },
      get tabIndex() {
        return getIsClickable() ? 0 : undefined;
      },
      get "aria-label"() {
        return getIsClickable() ? props.type : undefined;
      },
      get "aria-hidden"() {
        return getIsClickable() ? undefined : ("true" as const);
      },
    },
    props,
  );
  const [local, parent] = splitProps(merged, ["type", "variant", "class"]);
  const getClass = () => `material-${local.variant} ${local.class}`.trimEnd();

  function onKeyDown(event: Targeted<HTMLElement, KeyboardEvent>): void {
    if (!getIsClickable() || !isOf(event.key, BUTTON_KEYS)) return;
    event.preventDefault();
    event.currentTarget.click();
  }

  return (
    <i
      data-icon={local.type}
      on:keydown={onKeyDown}
      class={getClass()}
      {...parent}
    >
      {local.type}
    </i>
  );
}

type HTMLDialogProps<T> = ExtendProps<
  "dialog",
  {
    open?: T | undefined | null | false;
    mount?: ComponentProps<typeof Portal>["mount"];
    children?: JSX.Element | ((item: Accessor<NonNullable<T>>) => JSX.Element);
  }
>;

export function HTMLDialog<T>(props: HTMLDialogProps<T>) {
  const [local, parent] = splitProps(props, ["open", "mount", "children"]);

  function getChildren(item: Accessor<NonNullable<T>>): JSX.Element {
    return isFunction(local.children) ? local.children(item) : local.children;
  }

  function ref(el: HTMLDialogElement): void {
    onMount(() => el.showModal());
  }

  function onClick(event: Targeted<HTMLDialogElement, MouseEvent>): void {
    if (event.target === event.currentTarget) event.currentTarget.close();
  }

  return (
    <Show when={local.open}>
      {(item) => (
        <Portal mount={local.mount}>
          <dialog ref={ref} on:click={onClick} {...parent}>
            {getChildren(item)}
          </dialog>
        </Portal>
      )}
    </Show>
  );
}
