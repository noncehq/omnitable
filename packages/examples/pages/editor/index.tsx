import Omnitable from '@omnitable/omnitable'

import config from '../../config_editor'

const Index = () => {
  return (
    <div className="table_example_wrap">
      <Omnitable {...config}></Omnitable>
    </div>
  )
}

export default Index
