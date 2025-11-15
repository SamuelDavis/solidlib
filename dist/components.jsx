import { mergeProps, splitProps } from "solid-js";
export function HTMLNumber(props) {
    const merged = mergeProps({
        highlight: false,
        money: false,
        precision: 2,
        fill: true,
        classList: {},
        options: {},
        locales: "en-US",
    }, props);
    const [local, parent] = splitProps(merged, [
        "highlight",
        "money",
        "precision",
        "options",
        "locales",
        "classList",
    ]);
    const getClassList = () => {
        const { money, highlight, value } = merged;
        return {
            money,
            positive: highlight && value > 0,
            negative: highlight && value < 0,
            ...local.classList,
        };
    };
    const getNumberFormatOptions = () => ({
        minimumFractionDigits: local.precision,
        maximumFractionDigits: local.precision,
        ...local.options,
    });
    const getText = () => merged.value.toLocaleString(local.locales, getNumberFormatOptions());
    return (<span classList={getClassList()} {...parent}>
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
