import { App, ConfigProvider } from 'antd'
import en_US from 'antd/locale/en_US'
import zh_CN from 'antd/locale/zh_CN'

import { memo } from '@omnitable/stk/react'

import { getAntdTheme } from '../theme'

import type { ConfigProviderProps } from 'antd/es/config-provider'
import type { PropsWithChildren } from 'react'

export interface IProps extends PropsWithChildren, Omit<ConfigProviderProps, 'locale' | 'theme'> {
  locale?: 'en' | 'zh'
  theme?: 'light' | 'dark'
}

const Index = (props: IProps) => {
  const { children, locale, theme, ...rest_props } = props

  const props_config_provider: ConfigProviderProps = {
    ...rest_props,
    prefixCls: 'omni',
    iconPrefixCls: 'omni-icon',
    virtual: false,
    getPopupContainer: n => n?.parentElement!,
  }

  if (locale) props_config_provider['locale'] = locale === 'en' ? en_US : zh_CN
  if (theme) props_config_provider['theme'] = getAntdTheme(theme)

  return (
    <ConfigProvider {...props_config_provider}>
      <App prefixCls="omni">{children}</App>
    </ConfigProvider>
  )
}

export default memo(Index)
