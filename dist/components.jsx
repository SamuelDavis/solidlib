import { mergeProps, onCleanup, onMount, Show, splitProps, } from "solid-js";
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
    return (<span data-money={merged.money || undefined} data-positive={(merged.highlight && merged.value > 0) || undefined} data-negative={(merged.highlight && merged.value < 0) || undefined} {...parent}>
      {getText()}
    </span>);
}
export function HTMLDate(props) {
    const merged = mergeProps({ options: {}, locales: "en-US" }, props);
    const [local, parent] = splitProps(merged, ["value", "options", "locales"]);
    return (<span {...parent}>
      {local.value.toLocaleDateString(local.locales, local.options)}
    </span>);
}
/**
 * @see: https://fonts.googleapis.com/icon?family=Material+Icons
 */
export function HTMLIcon(props) {
    props = mergeProps({
        role: props.onClick ? "button" : undefined,
        title: props.type,
        classList: {},
    }, props);
    const [local, parent] = splitProps(props, ["type", "classList"]);
    const getClassList = () => ({
        "material-icons": true,
        ...local.classList,
    });
    return (<i classList={getClassList()} {...parent}>
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
