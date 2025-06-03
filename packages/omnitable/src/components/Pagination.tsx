import { Pagination } from 'antd'

import { $ } from '@omnitable/stk/utils'

import { pagesize_options } from '../metadata'

import styles from '../index.module.css'

import type { IPropsPagination } from '../types'

const Index = (props: IPropsPagination) => {
  const { pagination, onChangePagination } = props
  const { page, pagesize, total } = pagination

  return (
    <div className={$.cx('w_100', styles.Pagination)}>
      <Pagination
        align="end"
        showSizeChanger
        total={total}
        current={page}
        pageSize={pagesize}
        pageSizeOptions={pagesize_options}
        showTotal={total => `Total ${total} records`}
        onChange={onChangePagination}
      />
    </div>
  )
}

export default $.memo(Index)
