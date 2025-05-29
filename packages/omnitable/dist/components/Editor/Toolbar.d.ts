import type { Editor } from '@tiptap/react';
import type { IProps as IPropsEditor } from '.';
interface IProps {
    editor: Editor;
    uploadImage: IPropsEditor['uploadImage'];
}
declare const Index: (props: IProps) => import("react/jsx-runtime").JSX.Element;
export default Index;
