import { createBrowserRouter } from 'react-router-dom'

import Compare from './pages/compare'
import ConfigGroup from './pages/config_group'
import ConfigStat from './pages/config_stat'
import CustomGroup from './pages/custom_group'
import CustomStat from './pages/custom_stat'
import Editor from './pages/editor'
import Layout from './pages/layout'
import Log from './pages/log'
import Table from './pages/table'

import type { RouteObject } from 'react-router-dom'

const routes: Array<RouteObject> = [
	{
		path: '/',
		element: <Table />
	},
	{
		path: '/config_group',
		element: <ConfigGroup />
	},
	{
		path: '/custom_group',
		element: <CustomGroup />
	},
	{
		path: '/config_stat',
		element: <ConfigStat />
	},
	{
		path: '/custom_stat',
		element: <CustomStat />
	},
	{
		path: '/log',
		element: <Log />
	},
	{
		path: '/editor',
		element: <Editor />
	},
	{
		path: '/compare',
		element: <Compare />
	}
]

export default createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: routes
	}
])
