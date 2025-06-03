import { createContext, useContextSelector } from '@omnitable/stk/react'

import type { MutableRefObject } from 'react'
import type { Omnitable } from './types'

export interface Context {
  base_url: string
  ref_register_fields: MutableRefObject<Omnitable.Config['register_fields']>
}

// @ts-ignore Avoid duplicate declarations
export const Context = createContext<Context>()
export const Provider = Context.Provider

export const useContext = <Selected>(selector: (value: Context) => Selected) => {
  return useContextSelector(Context, selector)
}
