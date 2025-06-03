import 'highlight.js/styles/atom-one-dark.min.css'

import { useEffect, useState } from 'react'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import { createLowlight } from 'lowlight'

import { $ } from '@omnitable/stk/utils'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { Color } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import TextStyle from '@tiptap/extension-text-style'
import Typography from '@tiptap/extension-typography'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import Toolbar from './Toolbar'

import styles from './index.module.css'

const lowlight = createLowlight()

lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('js', js)
lowlight.register('ts', ts)

export interface IProps {
  value: string
  readonly?: boolean
  max_height?: number
  onChange: (v: string) => void
  uploadImage?: () => Promise<string>
}

const getContentString = (v: string) => (v.startsWith('{') ? JSON.parse(v) : v)

const Index = (props: IProps) => {
  const { value, readonly, max_height, onChange, uploadImage } = props
  const [seted, setSeted] = useState(false)

  const editor = useEditor({
    editable: !readonly,
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder: 'Write description...',
      }),
      Link.configure({
        openOnClick: false,
        defaultProtocol: 'https',
      }),
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'ts',
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Typography,
      Image,
      TableHeader,
      TableRow,
      TableCell,
      TaskList,
      Underline,
      TextStyle,
      Color,
    ],
    content: value ? getContentString(value) : '',
    onUpdate: ({ editor }) => {
      const content = editor.getJSON()

      onChange(JSON.stringify(content))
    },
  })

  useEffect(() => {
    if (!value || seted) return

    editor.commands.setContent(value ? getContentString(value) : '', false)

    setSeted(true)
  }, [value, seted])

  if (!editor) return null

  return (
    <div className={$.cx('w_100 flex flex_column', styles._local)}>
      <Toolbar editor={editor} uploadImage={uploadImage}></Toolbar>
      <div
        className="editor_wrap w_100 border_box"
        style={{ height: max_height, maxHeight: max_height, overflowY: 'scroll' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default $.memo(Index)
