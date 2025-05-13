import { $ } from 'stk/utils'

import Component from './Component'

import type { IPropsComponent } from '../types'

const Index = (props: IPropsComponent) => {
	return <Component {...props} editing use_by_form />
}

export default $.memo(Index)
