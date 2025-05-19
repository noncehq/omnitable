import Omnitable from '@omnitable/omnitable'

import config from '../../config_config_stat'

const Index = () => {
	return (
		<div className='table_example_wrap'>
			<Omnitable {...config}></Omnitable>
		</div>
	)
}

export default Index
