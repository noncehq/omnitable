import type { TooltipProps } from 'recharts';
import type Model from '../../model';
interface IProps extends Pick<TooltipProps<any, any>, 'payload'> {
    timeline_type: Model['timeline_type'];
    items: Required<Model['config']>['header']['timeline']['items'];
}
declare const _default: import("react").MemoExoticComponent<(props: IProps) => import("react/jsx-runtime").JSX.Element>;
export default _default;
