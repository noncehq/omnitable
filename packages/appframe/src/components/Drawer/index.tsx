import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { useClickAway } from 'ahooks'
import { AnimatePresence, motion } from 'motion/react'
import { createPortal } from 'react-dom'

import { $, is_server } from '@omnitable/stk/utils'
import { X } from '@phosphor-icons/react'

import styles from './index.module.css'

import type { CSSProperties, MouseEvent, ReactNode } from 'react'

export interface IProps {
  children: ReactNode
  open: boolean
  placement?: 'left' | 'right' | 'top' | 'bottom'
  className?: HTMLDivElement['className']
  bodyClassName?: HTMLDivElement['className']
  title?: string | number
  width?: string | number
  height?: string | number
  maskClosable?: boolean
  disableOverflow?: boolean
  disablePadding?: boolean
  zIndex?: number
  header_actions?: ReactNode
  onCancel?: (e?: MouseEvent<HTMLElement>) => void
  getRef?: (v: HTMLElement | null) => void
}

const Index = (props: IProps) => {
  const {
    children,
    open,
    placement = 'left',
    className,
    bodyClassName,
    title,
    width,
    height,
    maskClosable,
    disableOverflow,
    disablePadding,
    zIndex,
    header_actions,
    onCancel,
    getRef,
  } = props
  const ref_content_wrap = useRef<HTMLDivElement>(null)
  const ref_content = useRef<HTMLDivElement>(null)
  const [exsit, setExsit] = useState(false)

  useEffect(() => {
    if (is_server) return

    if (open) {
      setExsit(true)

      document.body.setAttribute('data-scroll-locked', '1')

      const handle_hash_change = () => onCancel?.()

      window.addEventListener('popstate', handle_hash_change)

      return () => {
        window.removeEventListener('popstate', handle_hash_change)
      }
    } else {
      const timer = setTimeout(() => {
        setExsit(false)
      }, 180)

      document.body.removeAttribute('data-scroll-locked')

      return () => clearTimeout(timer)
    }
  }, [open])

  useClickAway(e => {
    if (!maskClosable) return
    if (e.target !== ref_content_wrap.current) return

    onCancel?.(e as unknown as MouseEvent<HTMLDivElement>)
  }, ref_content)

  const { align, transform, style } = useMemo(() => {
    switch (placement) {
      case 'left':
        return {
          style: { width: width ?? 300 } as CSSProperties,
          transform: 'translate3d(-100%, 0px, 0px)',
        }
      case 'right':
        return {
          align: 'justify_end',
          style: { width: width ?? 300 } as CSSProperties,
          transform: 'translate3d(100%, 0px, 0px)',
        }
      case 'top':
        return {
          style: { width: '100%', height: height ?? 300 } as CSSProperties,
          transform: 'translate3d(0px, -100%, 0px)',
        }
      case 'bottom':
        return {
          align: 'align_end',
          style: { width: '100%', height: height ?? 300 } as CSSProperties,
          transform: 'translate3d(0px, 100%, 0px)',
        }
    }
  }, [placement, width, height])

  if (!exsit) return null

  const Content = (
    <Fragment>
      <AnimatePresence>
        {open && (
          <motion.div
            className={$.cx(styles.mask, styles.on_body, 'w_100 h_100')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            style={{ zIndex: zIndex ?? 1001 }}></motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {open && (
          <div
            className={$.cx(
              styles.content_wrap,
              styles.on_body,
              disableOverflow && styles.disableOverflow,
              disablePadding && styles.disablePadding,
              'if_modal_wrap w_100 h_100 border_box flex',
              align,
            )}
            ref={ref_content_wrap}
            style={{ zIndex: zIndex ? zIndex + 1 : 1002 }}>
            <motion.div
              className={$.cx(styles.content, className, 'if_modal_content border_box flex flex_column')}
              initial={{ transform }}
              animate={{ transform: 'translate3d(0px, 0px, 0px)' }}
              exit={{ transform }}
              transition={{ duration: 0.18, ease: 'easeInOut' }}
              style={style}
              ref={ref_content}>
              {title && (
                <div className={$.cx(styles.header, 'w_100 border_box flex justify_between align_center relative')}>
                  <span className="title">{title}</span>
                  {header_actions ? (
                    header_actions
                  ) : (
                    <span className="btn_close flex justify_center align_center clickable" onClick={onCancel}>
                      <X size={16}></X>
                    </span>
                  )}
                </div>
              )}
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Fragment>
  )

  return createPortal(Content, document.body)
}

export default $.memo(Index)
