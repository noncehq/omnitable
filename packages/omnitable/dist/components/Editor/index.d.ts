import 'highlight.js/styles/atom-one-dark.min.css';
interface IProps {
    value: string;
    readonly?: boolean;
    max_height?: number;
    onChange: (v: string) => void;
}
declare const _default: import("react").MemoExoticComponent<(props: IProps) => import("react").JSX.Element | import("react").ReactNode>;
export default _default;
