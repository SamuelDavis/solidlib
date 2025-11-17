import {
  mergeProps,
  onCleanup,
  onMount,
  splitProps,
  ValidComponent,
} from "solid-js";
import { ExtendProps } from "./types";
import { isFunction, isHtml } from "./guards";
import { Dynamic, Portal } from "solid-js/web";

type HTMLNumberProps = ExtendProps<
  "span",
  {
    value: number;
    money?: boolean;
    precision?: number;
    highlight?: boolean;
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
      classList: {},
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
    "classList",
  ]);
  const getClassList = (): NonNullable<HTMLNumberProps["classList"]> => {
    const { money, highlight, value } = merged;
    return {
      money,
      positive: highlight && value > 0,
      negative: highlight && value < 0,
      ...local.classList,
    };
  };
  const getNumberFormatOptions = (): Intl.NumberFormatOptions => ({
    minimumFractionDigits: local.precision,
    maximumFractionDigits: local.precision,
    ...local.options,
  });
  const getText = () =>
    merged.value.toLocaleString(local.locales, getNumberFormatOptions());

  return (
    <span classList={getClassList()} {...parent}>
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

type ModalProps = ExtendProps<
  "dialog",
  { onClose?: (event: Event) => void; portal?: boolean }
>;

export function Modal(props: ModalProps) {
  const [local, parent] = splitProps(props, [
    "onClose",
    "onClick",
    "ref",
    "portal",
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

  const Dialog = () => (
    <dialog open onClick={onClick} ref={local.ref} {...parent}>
      {props.children}
    </dialog>
  );

  return local.portal ? (
    <Portal mount={document.body}>
      <Dialog />
    </Portal>
  ) : (
    <Dialog />
  );
}
