import { createContext, useContextSelector } from 'stk/react'

export interface Context {
	base_url: string
}

// @ts-ignore Avoid duplicate declarations
export const Context = createContext<Context>()
export const Provider = Context.Provider

export const useContext = <Selected>(selector: (value: Context) => Selected) => {
	return useContextSelector(Context, selector)
}
