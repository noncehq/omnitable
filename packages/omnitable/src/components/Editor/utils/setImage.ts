import type { Editor } from '@tiptap/react'

export default (editor: Editor) => {
	const url = window.prompt('URL')

	if (url) {
		editor.chain().focus().setImage({ src: url }).run()
	}
}
