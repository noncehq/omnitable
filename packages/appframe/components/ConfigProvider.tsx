import { ConfigProvider } from 'antd'
import { memo } from 'stk/react'

import type { PropsWithChildren } from 'react'

import type { ConfigProviderProps } from 'antd/es/config-provider'

interface IProps extends PropsWithChildren {
	locale: ConfigProviderProps['locale']
	theme: ConfigProviderProps['theme']
}

const Index = (props: IProps) => {
	const { children, locale, theme } = props

	const props_config_provider: ConfigProviderProps = {
		prefixCls: 'omni',
		iconPrefixCls: 'omni-icon',
		locale,
		theme,
		virtual: false,
		getPopupContainer: n => n?.parentElement!
	}

	return <ConfigProvider {...props_config_provider}>{children}</ConfigProvider>
}

export default memo(Index)
