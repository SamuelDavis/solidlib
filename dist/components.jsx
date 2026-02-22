import { mergeProps, onCleanup, onMount, Show, splitProps } from "solid-js";
import { isFunction, isHtml } from "./guards";
import { Portal } from "solid-js/web";
export function HTMLNumber(props) {
    const merged = mergeProps({
        highlight: false,
        money: false,
        precision: 2,
        fill: true,
        options: {},
        locales: "en-US",
    }, props);
    const [local, parent] = splitProps(merged, [
        "highlight",
        "money",
        "precision",
        "options",
        "locales",
    ]);
    const getNumberFormatOptions = () => ({
        minimumFractionDigits: local.precision,
        maximumFractionDigits: local.precision,
        ...local.options,
    });
    const getText = () => merged.value.toLocaleString(local.locales, getNumberFormatOptions());
    const getIsPositive = () => {
        if (merged.highlight === "positive")
            return true;
        if (merged.highlight === true && merged.value > 0)
            return true;
        return undefined;
    };
    const getIsNegative = () => {
        if (merged.highlight === "negative")
            return true;
        if (merged.highlight === true && merged.value < 0)
            return true;
        return undefined;
    };
    return (<span data-money={merged.money || undefined} data-positive={getIsPositive()} data-negative={getIsNegative()} {...parent}>
      {getText()}
    </span>);
}
export function HTMLDate(props) {
    const merged = mergeProps({ options: {}, locales: "en-US" }, props);
    const [local, parent] = splitProps(merged, [
        "children",
        "value",
        "options",
        "locales",
    ]);
    return (<time datetime={local.value.toUTCString()} {...parent}>
      <Show when={local.children} fallback={local.value.toLocaleDateString(local.locales, local.options)}>
        {(children) => children()}
      </Show>
    </time>);
}
/**
 * @link https://fonts.google.com/icons
 * @example <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols" />
 */
export function HTMLIcon(props) {
    const merged = mergeProps({
        role: props.onClick ? "button" : undefined,
        title: props.type,
        variant: "symbol",
        class: '',
        classList: {},
    }, props);
    const [local, parent] = splitProps(merged, ["type", "variant", "class"]);
    const getVariantClass = () => `material-${local.variant}s`;
    const getClass = () => `${getVariantClass()} ${local.class}`.trimEnd();
    return (<i class={getClass()} {...parent}>
      {local.type}
    </i>);
}
export function Modal(props) {
    const merged = mergeProps({ when: true, mount: document.body }, props);
    const [local, parent] = splitProps(merged, [
        "onClose",
        "onClick",
        "ref",
        "mount",
        "when",
    ]);
    const onKeyDown = (event) => event.key === "Escape" && local.onClose?.(event);
    onMount(() => window.addEventListener("keydown", onKeyDown));
    onCleanup(() => window.removeEventListener("keydown", onKeyDown));
    function onClick(event) {
        if (event.target === local.ref)
            local.onClose?.(event);
        if (isFunction(local.onClick) && isHtml(local.ref, "dialog"))
            local.onClick({
                ...event,
                currentTarget: local.ref,
                target: local.ref,
            });
    }
    return (<Show when={local.when}>
      <Portal mount={local.mount}>
        <dialog open onClick={onClick} ref={local.ref} {...parent}>
          {props.children}
        </dialog>
      </Portal>
    </Show>);
}
