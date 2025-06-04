import { useMemo, useRef } from 'react'
import { useMemoizedFn } from 'ahooks'
import { Dropdown } from 'antd'
import { Ellipsis } from 'lucide-react'

import { $ } from '@omnitable/stk/utils'
import { Eye, PencilSimpleLine, Trash } from '@phosphor-icons/react'

import styles from './index.module.css'

import type { ComponentType, Omnitable } from '@omnitable/omnitable'
import type { MenuProps } from 'antd'

export type OperationComponentType = {
  type: 'operation'
  props?: {
    no_edit?: boolean
    no_delete?: boolean
  }
}

const Index = (props: ComponentType<OperationComponentType['props']>) => {
  const { self_props, editing, onFocus, onChange } = props
  const { no_edit, no_delete } = self_props || {}
  const signal = useRef(0)

  const items = useMemo(() => {
    const target = [
      {
        key: 'view',
        label: 'View',
        icon: <Eye size={16}></Eye>,
      },
    ] as Required<MenuProps>['items']

    if (!no_edit) {
      target.push({
        key: 'edit',
        label: 'Edit',
        icon: <PencilSimpleLine size={16}></PencilSimpleLine>,
      })
    }

    if (!no_delete) {
      target.push(
        {
          type: 'divider',
        },
        {
          key: 'delete',
          label: 'Delete',
          icon: <Trash size={16}></Trash>,
        },
      )
    }

    return target
  }, [no_edit, no_delete])

  const onClick = useMemoizedFn(({ key }) => {
    signal.current++

    onChange?.({ key, signal: signal.current })
  })

  const Btn = (
    <div className="btn_wrap flex justify_center align_center clickable">
      <Ellipsis size={16} strokeWidth={2} strokeLinecap="round"></Ellipsis>
    </div>
  )

  return (
    <div className="flex justify_end">
      <button className={$.cx('flex', styles._local)} onFocus={onFocus}>
        {editing ? (
          <Dropdown
            rootClassName={styles.dropdown}
            trigger={['click']}
            destroyOnHidden
            getPopupContainer={() => document.body}
            menu={{ items, onClick, onFocus }}>
            <div>{Btn}</div>
          </Dropdown>
        ) : (
          Btn
        )}
      </button>
    </div>
  )
}

export default $.memo(Index)
