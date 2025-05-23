import { useMemoizedFn } from 'ahooks'
import { Popover } from 'antd'
import { useMemo } from 'react'

import { $ } from '@omnitable/stk/utils'
import {
  ArrowClockwise,
  ArrowCounterClockwise,
  Code,
  Image,
  Link,
  ListBullets,
  ListChecks,
  ListNumbers,
  PaintBrush,
  RowsPlusBottom,
  Table,
  TextB,
  TextItalic,
  TextStrikethrough,
  TextUnderline,
} from '@phosphor-icons/react'

import { Highlight, TableActions } from './components'
import styles from './index.module.css'
import { setImage, setLink } from './utils'

import type { Editor } from '@tiptap/react'

interface IProps {
  editor: Editor
}

const Index = (props: IProps) => {
  const { editor } = props

  const getColorActive = useMemoizedFn(v => editor.isActive('textStyle', { color: v }))
  const getbackgroundActive = useMemoizedFn(v => editor.isActive('highlight', { color: v }))

  const onSelectHighlight = (type: 'color' | 'background', v: string) => {
    if (type === 'color') {
      if (!v || getColorActive(v)) {
        editor.commands.unsetColor()
      } else {
        editor.commands.setColor(v)
      }
    } else {
      if (!v) {
        editor.commands.unsetHighlight()
      } else {
        editor.commands.toggleHighlight({ color: v })
      }
    }
  }

  const actions = useMemo(() => {
    return [
      {
        Icon: ArrowCounterClockwise,
        action: () => editor.commands.undo(),
        disabled: () => !editor.can().undo(),
      },
      {
        Icon: ArrowClockwise,
        action: () => editor.commands.redo(),
        disabled: () => !editor.can().redo(),
      },
      {
        render: () => <span className="divider" key="divider_0"></span>,
      },
      {
        Icon: TextB,
        action: () => editor.commands.toggleBold(),
        active: () => editor.isActive('bold'),
      },
      {
        Icon: TextItalic,
        action: () => editor.commands.toggleItalic(),
        active: () => editor.isActive('italic'),
      },
      {
        Icon: TextUnderline,
        action: () => editor.commands.toggleUnderline(),
        active: () => editor.isActive('underline'),
      },
      {
        Icon: TextStrikethrough,
        action: () => editor.commands.toggleStrike(),
        active: () => editor.isActive('strike'),
      },
      {
        Icon: Link,
        action: () => setLink(editor),
        active: () => editor.isActive('link'),
      },
      {
        render: () => (
          <Popover
            trigger={['click']}
            placement="bottom"
            destroyOnHidden
            content={
              <Highlight
                getColorActive={getColorActive}
                getbackgroundActive={getbackgroundActive}
                onSelect={onSelectHighlight}
              />
            }
            key="highlight">
            <div>
              <div
                className={$.cx(
                  'btn_wrap flex justify_center align_center clickable',
                  (editor.isActive('textStyle') || editor.isActive('highlight')) && 'active',
                )}>
                <PaintBrush weight={editor.isActive('highlight') ? 'bold' : 'regular'}></PaintBrush>
              </div>
            </div>
          </Popover>
        ),
      },
      {
        render: () => <span className="divider" key="divider_1"></span>,
      },
      {
        Icon: Code,
        action: () => editor.commands.toggleCodeBlock(),
        active: () => editor.isActive('codeBlock'),
      },
      {
        Icon: ListBullets,
        action: () => editor.commands.toggleBulletList(),
        active: () => editor.isActive('bulletList'),
      },
      {
        Icon: ListNumbers,
        action: () => editor.commands.toggleOrderedList(),
        active: () => editor.isActive('orderedList'),
      },
      {
        Icon: ListChecks,
        action: () => editor.commands.toggleTaskList(),
        active: () => editor.isActive('taskList'),
      },
      {
        render: () => (
          <Popover
            trigger={['click']}
            placement="bottom"
            destroyOnHidden
            content={<TableActions editor={editor} />}
            key="table">
            <div>
              <div
                className={$.cx(
                  'btn_wrap flex justify_center align_center clickable',
                  editor.isActive('table') && 'active',
                )}>
                <Table weight={editor.isActive('table') ? 'bold' : 'regular'}></Table>
              </div>
            </div>
          </Popover>
        ),
      },
      {
        Icon: Image,
        action: () => setImage(editor),
      },
      {
        Icon: RowsPlusBottom,
        action: () => editor.chain().insertContent('<p></p>').focus('end').run(),
      },
    ]
  }, [editor])

  return (
    <div className={$.cx('border_box', styles.Toolbar)}>
      <div className="toolbar_wrap w_100 border_box  flex justify_between align_center">
        {actions.map(({ Icon, action, active, disabled, render }, index) =>
          render ? (
            render()
          ) : (
            <button
              className={$.cx(
                'btn_wrap flex justify_center align_center clickable',
                active?.() && 'active',
              )}
              type="button"
              disabled={disabled?.()}
              onClick={action}
              key={index}>
              <Icon weight={active?.() ? 'bold' : 'regular'}></Icon>
            </button>
          ),
        )}
      </div>
    </div>
  )
}

export default Index
