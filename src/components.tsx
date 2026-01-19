import { mergeProps, onCleanup, onMount, Show, splitProps } from "solid-js";
import { ExtendProps } from "./types";
import { isFunction, isHtml } from "./guards";
import { Portal } from "solid-js/web";

type HTMLNumberProps = ExtendProps<
  "span",
  {
    value: number;
    money?: boolean;
    precision?: number;
    highlight?: boolean | "positive" | "negative";
    options?: Intl.NumberFormatOptions;
    locale?: Intl.LocalesArgument;
  }
>;

export function HTMLNumber(props: HTMLNumberProps) {
  const merged = mergeProps(
    {
      highlight: false,
      money: false,
      precision: 2,
      fill: true,
      options: {},
      locales: "en-US",
    },
    props,
  );
  const [local, parent] = splitProps(merged, [
    "highlight",
    "money",
    "precision",
    "options",
    "locales",
  ]);
  const getNumberFormatOptions = (): Intl.NumberFormatOptions => ({
    minimumFractionDigits: local.precision,
    maximumFractionDigits: local.precision,
    ...local.options,
  });
  const getText = () =>
    merged.value.toLocaleString(local.locales, getNumberFormatOptions());

  const getIsPositive = (): undefined | true => {
    if (merged.highlight === "positive") return true;
    if (merged.highlight === true && merged.value > 0) return true;
    return undefined;
  };
  const getIsNegative = (): undefined | true => {
    if (merged.highlight === "negative") return true;
    if (merged.highlight === true && merged.value < 0) return true;
    return undefined;
  };

  return (
    <span
      data-money={merged.money || undefined}
      data-positive={getIsPositive()}
      data-negative={getIsNegative()}
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
  const merged = mergeProps({ options: {}, locales: "en-US" }, props);
  const [local, parent] = splitProps(merged, [
    "children",
    "value",
    "options",
    "locales",
  ]);
  return (
    <time datetime={local.value.toUTCString()} {...parent}>
      <Show
        when={local.children}
        fallback={local.value.toLocaleDateString(local.locales, local.options)}
      >
        {(children) => children()}
      </Show>
    </time>
  );
}

type HTMLIconProps = ExtendProps<
  "i",
  { type: string; variant?: "icon" | "symbol" }
>;

/**
 * @link https://fonts.google.com/icons?icon.set=Material+Symbols
 * @example <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Symbol" />
 */
export function HTMLIcon(props: HTMLIconProps) {
  const merged = mergeProps(
    {
      role: props.onClick ? ("button" as const) : undefined,
      title: props.type,
      variant: "symbol",
      classList: {},
    },
    props,
  );
  const [local, parent] = splitProps(merged, ["type", "variant", "class"]);
  const getVariantClass = () => `material-${local.variant}s`;
  const getClass = (): NonNullable<HTMLIconProps["class"]> =>
    `${getVariantClass()} ${local.class}`.trimEnd();

  return (
    <i class={getClass()} {...parent}>
      {local.type}
    </i>
  );
}

type ModalProps<T> = ExtendProps<
  "dialog",
  {
    when?: T | undefined | null | false;
    mount?: Node;
    onClose?: (...args: any[]) => void | any;
  }
>;

export function Modal<T>(props: ModalProps<T>) {
  const merged = mergeProps({ when: true, mount: document.body }, props);
  const [local, parent] = splitProps(merged, [
    "onClose",
    "onClick",
    "ref",
    "mount",
    "when",
  ]);

  const onKeyDown = (event: KeyboardEvent) =>
    event.key === "Escape" && local.onClose?.(event);
  onMount(() => window.addEventListener("keydown", onKeyDown));
  onCleanup(() => window.removeEventListener("keydown", onKeyDown));

  function onClick(event: MouseEvent) {
    if (event.target === local.ref) local.onClose?.(event);
    if (isFunction(local.onClick) && isHtml(local.ref, "dialog"))
      local.onClick({
        ...event,
        currentTarget: local.ref,
        target: local.ref,
      });
  }

  return (
    <Show when={local.when}>
      <Portal mount={local.mount}>
        <dialog open onClick={onClick} ref={local.ref} {...parent}>
          {props.children}
        </dialog>
      </Portal>
    </Show>
  );
}
