import common from './index'

import type { ThemeConfig } from 'antd'

export default {
	token: {
		colorSuccess: common.color_success,
		colorWarning: common.color_warning,
		colorError: common.color_danger,
		controlHeightLG: 38,
		controlHeight: 30,
		controlHeightSM: 26,
		controlHeightXS: 18,
		fontFamily: 'inherit',
		controlOutline: 'none'
	}
} as ThemeConfig
