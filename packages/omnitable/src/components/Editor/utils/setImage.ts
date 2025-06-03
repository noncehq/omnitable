import type { Editor } from '@tiptap/react'
import type { IProps } from '..'

export default async (editor: Editor, uploadImage: IProps['uploadImage']) => {
  let url = ''

  if (uploadImage) {
    url = await uploadImage()
  } else {
    url = window.prompt('URL')
  }

  if (url) {
    editor.chain().focus().setImage({ src: url }).run()
  }
}
