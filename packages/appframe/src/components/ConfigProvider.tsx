import { App, ConfigProvider } from 'antd'
import en_US from 'antd/locale/en_US'
import zh_CN from 'antd/locale/zh_CN'
import { useMemo } from 'react'
import { memo } from 'stk/react'

import { getAntdTheme } from '../theme'

import type { PropsWithChildren } from 'react'
import type { ConfigProviderProps } from 'antd/es/config-provider'

export interface IProps extends PropsWithChildren, Omit<ConfigProviderProps, 'locale' | 'theme'> {
	locale: 'en' | 'zh'
	theme: 'light' | 'dark'
}

const Index = (props: IProps) => {
	const { children, locale = 'en', theme = 'light', ...rest_props } = props

	const target_theme = useMemo(() => getAntdTheme(theme), [theme])

	const props_config_provider: ConfigProviderProps = {
		...rest_props,
		prefixCls: 'omni',
		iconPrefixCls: 'omni-icon',
		locale: locale === 'en' ? en_US : zh_CN,
		theme: target_theme,
		virtual: false,
		getPopupContainer: n => n?.parentElement!
	}

	return (
		<ConfigProvider {...props_config_provider}>
			<App prefixCls='omni'>{children}</App>
		</ConfigProvider>
	)
}

export default memo(Index)
