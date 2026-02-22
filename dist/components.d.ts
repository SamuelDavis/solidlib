import { ExtendProps } from "./types";
type HTMLNumberProps = ExtendProps<"span", {
    value: number;
    money?: boolean;
    precision?: number;
    highlight?: boolean | "positive" | "negative";
    options?: Intl.NumberFormatOptions;
    locale?: Intl.LocalesArgument;
}>;
export declare function HTMLNumber(props: HTMLNumberProps): import("solid-js").JSX.Element;
type HTMLDateProps = ExtendProps<"time", {
    value: Date;
    locales?: Intl.LocalesArgument;
    options?: Intl.DateTimeFormatOptions;
}, "datetime">;
export declare function HTMLDate(props: HTMLDateProps): import("solid-js").JSX.Element;
type HTMLIconProps = ExtendProps<"i", {
    type: string;
    variant?: "icon" | "symbol";
}>;
/**
 * @link https://fonts.google.com/icons
 * @example <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols" />
 */
export declare function HTMLIcon(props: HTMLIconProps): import("solid-js").JSX.Element;
type ModalProps<T> = ExtendProps<"dialog", {
    when?: T | undefined | null | false;
    mount?: Node;
    onClose?: (...args: any[]) => void | any;
}>;
export declare function Modal<T>(props: ModalProps<T>): import("solid-js").JSX.Element;
export {};
