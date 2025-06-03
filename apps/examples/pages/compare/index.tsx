'use client'

import Omnitable from '@omnitable/omnitable'

import config from '../../config_compare'

const Index = () => {
  return (
    <div className="table_example_wrap">
      <Omnitable {...config}></Omnitable>
    </div>
  )
}

export default Index
