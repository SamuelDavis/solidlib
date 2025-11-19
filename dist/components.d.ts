import { JSX } from "solid-js";
import { ExtendProps } from "./types";
type HTMLNumberProps = ExtendProps<"span", {
    value: number;
    money?: boolean;
    precision?: number;
    highlight?: boolean;
    options?: Intl.NumberFormatOptions;
    locale?: Intl.LocalesArgument;
}>;
export declare function HTMLNumber(props: HTMLNumberProps): JSX.Element;
type HTMLDateProps = ExtendProps<"span", {
    value: Date;
    locales?: Intl.LocalesArgument;
    options?: Intl.DateTimeFormatOptions;
}>;
export declare function HTMLDate(props: HTMLDateProps): JSX.Element;
type HTMLIconProps = ExtendProps<"i", {
    type: string;
}>;
/**
 * @see: https://fonts.googleapis.com/icon?family=Material+Icons
 */
export declare function HTMLIcon(props: HTMLIconProps): JSX.Element;
type ModalProps<T> = ExtendProps<"dialog", {
    when?: T | undefined | null | false;
    mount?: Node;
    onClose?: (...args: any[]) => void | any;
}>;
export declare function Modal<T>(props: ModalProps<T>): JSX.Element;
export {};
