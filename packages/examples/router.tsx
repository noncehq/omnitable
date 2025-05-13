import { createBrowserRouter } from 'react-router-dom'

import Layout from '@/layout'

import Index from './pages/index'

import type { RouteObject } from 'react-router-dom'

const routes: Array<RouteObject> = [
	{
		path: '/',
		element: <Index></Index>
	}
]

export default createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: routes
	}
])
