import { deepEqual } from 'fast-equals'
import { memo } from 'react'

import type { MemoExoticComponent, ComponentType } from 'react'

type Memo = <T extends ComponentType<any>>(Component: T) => MemoExoticComponent<T>

const Index: Memo = el => memo(el, (prev, next) => deepEqual(prev, next))

export default Index
