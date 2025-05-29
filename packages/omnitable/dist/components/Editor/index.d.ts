import 'highlight.js/styles/atom-one-dark.min.css';
export interface IProps {
    value: string;
    readonly?: boolean;
    max_height?: number;
    onChange: (v: string) => void;
    uploadImage?: () => Promise<string>;
}
declare const _default: import("react").MemoExoticComponent<(props: IProps) => import("react/jsx-runtime").JSX.Element>;
export default _default;
