import { mergeProps, onMount, Show, Signal, splitProps } from "solid-js";
import { ExtendProps, Targeted } from "./types";
import { isArray, isFunction } from "./guards";
import { Portal } from "solid-js/web";

type HTMLNumberProps = ExtendProps<
  "span",
  {
    value: number;
    money?: boolean;
    precision?: number;
    highlight?: boolean | "positive" | "negative";
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
    <time datetime={local.value.toISOString()} {...parent}>
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
 * @link https://fonts.google.com/icons
 * @example <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols" />
 */
export function HTMLIcon(props: HTMLIconProps) {
  const merged = mergeProps(
    {
      role: props.onClick ? ("button" as const) : undefined,
      title: props.type,
      variant: "symbol",
      class: "",
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

export function Modal(
  props: ExtendProps<
    "dialog",
    { open?: boolean | Signal<boolean>; mount?: Node }
  >,
) {
  const merged = mergeProps(
    { open: false, mount: document.body, closedby: "any" as const },
    props,
  );
  const [local, parent] = splitProps(merged, ["open", "mount", "onClose"]);
  const getOpenSignal = (): Signal<boolean> => {
    const { open } = local;
    return isArray(open) ? open : [() => open, () => {}];
  };
  const [getOpen, setOpen] = getOpenSignal();

  let ref: undefined | HTMLDialogElement;

  onMount(() => {
    if (getOpen()) ref?.showModal();
  });

  function onClose(event: Targeted<HTMLDialogElement>): void {
    setOpen(false);
    if (isFunction(local.onClose)) local.onClose(event);
    else if (isFunction(local.onClose?.[0]))
      local.onClose[0](local.onClose[1], event);
  }

  return (
    <Portal mount={local.mount}>
      <dialog onClose={onClose} ref={ref} {...parent} />;
    </Portal>
  );
}
