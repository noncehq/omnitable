import '@omnitable/appframe/global.css'
import '@omnitable/appframe/components.css'
import '@omnitable/appframe/init.css'
import '@omnitable/appframe/preset'

import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import router from './router'

createRoot(document.getElementById('root')!).render(<RouterProvider router={router}></RouterProvider>)
