import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { useClickAway } from 'ahooks'
import { AnimatePresence, motion } from 'motion/react'
import { createPortal } from 'react-dom'

import { $, is_server } from '@omnitable/stk/utils'
import { X } from '@phosphor-icons/react'

import styles from './index.module.css'

import type { MouseEvent, ReactNode } from 'react'

export interface IProps {
  children: ReactNode
  open: boolean
  className?: HTMLDivElement['className']
  bodyClassName?: HTMLDivElement['className']
  title?: string | number
  width?: string | number
  minHeight?: string | number
  height?: string | number
  maskClosable?: boolean
  disableOverflow?: boolean
  disablePadding?: boolean
  hideClose?: boolean
  zIndex?: number
  header?: (onClose: IProps['onCancel']) => ReactNode
  onCancel?: (e?: MouseEvent<HTMLElement>) => void
  getContainer?: () => Element
  getRef?: (v: HTMLDivElement) => void
}

const Index = (props: IProps) => {
  const {
    children,
    open,
    className,
    bodyClassName,
    title,
    width,
    minHeight,
    height,
    maskClosable,
    disableOverflow,
    disablePadding,
    hideClose,
    zIndex,
    header,
    onCancel,
    getContainer,
    getRef,
  } = props
  const ref_content_wrap = useRef<HTMLDivElement>(null)
  const ref_content = useRef<HTMLDivElement>(null)
  const [on_body, setOnbody] = useState(false)
  const [exsit, setExsit] = useState(false)

  if (is_server) return null

  const container = getContainer?.() || document.body

  useEffect(() => {
    if (open) {
      setExsit(true)

      document.body.style.setProperty('overflow-y', 'hidden')

      const handle_hash_change = () => onCancel?.()

      window.addEventListener('popstate', handle_hash_change)

      return () => {
        window.removeEventListener('popstate', handle_hash_change)
      }
    } else {
      const timer = setTimeout(() => {
        setExsit(false)
      }, 180)

      document.body.style.removeProperty('overflow-y')

      return () => clearTimeout(timer)
    }
  }, [open])

  useClickAway(e => {
    if (!maskClosable) return
    if (e.target !== ref_content_wrap.current) return

    onCancel?.(e as unknown as MouseEvent<HTMLDivElement>)
  }, ref_content)

  useEffect(() => {
    setOnbody(container === document.body)
  }, [container])

  const Header = useMemo(() => {
    if (header) return header(onCancel)
    if (!title) return null

    return (
      <div className={$.cx(styles.header, 'w_100 border_box flex justify_between align_center')}>
        <span className="title">{title}</span>
        {!hideClose && (
          <span className="btn_close flex justify_center align_center clickable" onClick={onCancel}>
            <X size={14}></X>
          </span>
        )}
      </div>
    )
  }, [title, hideClose, onCancel, header])

  if (!exsit) return null

  const Content = (
    <Fragment>
      <AnimatePresence>
        {open && (
          <motion.div
            className={$.cx('omni', styles.mask, on_body && styles.on_body, 'w_100 h_100')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            style={{ zIndex: zIndex ?? 1001 }}></motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {open && (
          <motion.div
            className={$.cx(
              'omni',
              styles.content_wrap,
              on_body && styles.on_body,
              disableOverflow && styles.disableOverflow,
              disablePadding && styles.disablePadding,
              className,
              'if_modal_wrap w_100 h_100 border_box flex align_center',
            )}
            ref={ref_content_wrap}
            initial={{ transform: 'translate3d(0px, -30px, 0px)', opacity: 0 }}
            animate={{ transform: 'translate3d(0px, 0px, 0px)', opacity: 1 }}
            exit={{ transform: 'translate3d(0px, 30px, 0px)', opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            style={{ zIndex: zIndex ? zIndex + 1 : 1002 }}>
            <div
              className={$.cx(styles.content, 'if_modal_content border_box flex flex_column')}
              style={{ width: width ?? 360, minHeight, ...(height ? { height, overflowY: 'scroll' } : {}) }}
              ref={ref_content}>
              {Header}
              <div
                className={$.cx(
                  styles.body,
                  bodyClassName,
                  disableOverflow && styles.disableOverflow,
                  'if_modal_body w_100 border_box flex flex_column',
                )}
                ref={getRef}>
                {children}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Fragment>
  )

  if (container) {
    return createPortal(Content, container)
  }

  return Content
}

export default $.memo(Index)
