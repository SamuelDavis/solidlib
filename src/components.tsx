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
  "span",
  {
    value: Date;
    locales?: Intl.LocalesArgument;
    options?: Intl.DateTimeFormatOptions;
  }
>;

export function HTMLDate(props: HTMLDateProps) {
  const merged = mergeProps({ options: {}, locales: "en-US" }, props);
  const [local, parent] = splitProps(merged, ["value", "options", "locales"]);
  return (
    <span {...parent}>
      {local.value.toLocaleDateString(local.locales, local.options)}
    </span>
  );
}

type HTMLIconProps = ExtendProps<"i", { type: string }>;

/**
 * @see: https://fonts.googleapis.com/icon?family=Material+Icons
 */
export function HTMLIcon(props: HTMLIconProps) {
  props = mergeProps(
    {
      role: props.onClick ? ("button" as const) : undefined,
      title: props.type,
      classList: {},
    },
    props,
  );
  const [local, parent] = splitProps(props, ["type", "classList"]);
  const getClassList = (): NonNullable<HTMLIconProps["classList"]> => ({
    "material-icons": true,
    ...local.classList,
  });

  return (
    <i classList={getClassList()} {...parent}>
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
