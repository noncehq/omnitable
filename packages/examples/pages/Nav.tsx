import { NavLink, useLocation } from 'react-router-dom'

import { $ } from '@omnitable/stk/utils'

const nav_items = [
  {
    type: 'Normal',
    key: '',
  },
  {
    type: 'Config Group',
    key: 'config_group',
  },
  {
    type: 'Custom Group',
    key: 'custom_group',
  },
  {
    type: 'Config Stat',
    key: 'config_stat',
  },
  {
    type: 'Custom Stat',
    key: 'custom_stat',
  },
  {
    type: 'Log Mode',
    key: 'log',
  },
  {
    type: 'Editor Support',
    key: 'editor',
  },
  {
    type: 'Compare',
    key: 'compare',
  },
]

const Index = () => {
  const { pathname } = useLocation()

  return (
    <div className="nav_items w_100 border_box flex">
      {nav_items.map(item => (
        <NavLink
          className={$.cx(
            'nav_item flex justify_center align_center clickable',
            // pathname === `/../../${item.key}` && 'active'
          )}
          to={`/${item.key}`}
          key={item.key}>
          {item.type}
        </NavLink>
      ))}
    </div>
  )
}

export default Index
