import { ExtendProps } from "./types";
type HTMLNumberProps = ExtendProps<"span", {
    value: number;
    money?: boolean;
    precision?: number;
    highlight?: boolean;
    options?: Intl.NumberFormatOptions;
    locale?: Intl.LocalesArgument;
}>;
export declare function HTMLNumber(props: HTMLNumberProps): import("solid-js").JSX.Element;
type HTMLDateProps = ExtendProps<"span", {
    value: Date;
    locales?: Intl.LocalesArgument;
    options?: Intl.DateTimeFormatOptions;
}>;
export declare function HTMLDate(props: HTMLDateProps): import("solid-js").JSX.Element;
type HTMLIconProps = ExtendProps<"i", {
    type: string;
}>;
/**
 * @see: https://fonts.googleapis.com/icon?family=Material+Icons
 */
export declare function HTMLIcon(props: HTMLIconProps): import("solid-js").JSX.Element;
type ModalProps = ExtendProps<"dialog", {
    onClose?: (event: Event) => void;
    portal?: boolean;
}>;
export declare function Modal(props: ModalProps): import("solid-js").JSX.Element;
export {};
