interface IProps {
    getColorActive: (v: string) => boolean;
    getbackgroundActive: (v: string) => boolean;
    onSelect: (type: 'color' | 'background', v: string) => void;
}
declare const Index: (props: IProps) => import("react/jsx-runtime").JSX.Element;
export default Index;
