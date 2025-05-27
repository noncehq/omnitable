import '@phosphor-icons/web/regular'
import '@omnitable/appframe/global.css'
import '@omnitable/appframe/preset'

import { Fragment, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useMemoizedFn } from 'ahooks'
import { App, Button } from 'antd'
import { debounce, omit, pick } from 'lodash-es'
import { RefreshCw } from 'lucide-react'
import { observer } from 'mobx-react-lite'

import { AntdConfigProvider, Drawer, LoadingCircle, Modal } from '@omnitable/appframe/components'
import { $ } from '@omnitable/stk/utils'
import { Eyes, PauseCircle, PlayCircle, Plus } from '@phosphor-icons/react'

import {
  Detail,
  Fields,
  Filter,
  Group,
  Pagination,
  Sort,
  Stat,
  Table,
  Timeline,
  TimelineControls,
  View,
} from './components'
import { Provider } from './context'
import styles from './index.module.css'
import Model from './model'

import type { IPropsConfigProvider, IPropsDrawer, IPropsModal } from '@omnitable/appframe/components'
import type {
  IPropsDetail,
  IPropsFields,
  IPropsFilter,
  IPropsGroup,
  IPropsPagination,
  IPropsSort,
  IPropsStat,
  IPropsTable,
  IPropsTimeline,
  IPropsTimelineControls,
  IPropsView,
  Omnitable,
} from './types'

const { useApp } = App

const Index = (props: Omnitable.Props) => {
  const [x] = useState(() => new Model())
  const antd = useApp()
  const filter_columns = $.copy(x.filter_columns)
  const visible_columns = $.copy(x.visible_columns)
  const ref_register_fields = useRef<Omnitable.Config['register_fields']>(null)

  const target_props = useMemo(() => {
    if ('config_url' in props) return props
    if (!props.register_fields) return props

    ref_register_fields.current = props.register_fields

    return omit(props, ['register_fields'])
  }, [props])

  useLayoutEffect(() => {
    x.init({ props: target_props, antd })

    return () => x.off()
  }, [target_props, antd])

  const props_config_provider: IPropsConfigProvider = {}

  if (x.config?.locale) props_config_provider['locale'] = x.config?.locale
  if (x.config?.theme) props_config_provider['theme'] = x.config?.theme

  const props_sort: IPropsSort = {
    sort_field_options: $.copy(x.sort_field_options),
    sort_params: $.copy(x.sort_params),
    onChangeSort: x.onChangeSort,
  }

  const props_filter: IPropsFilter = {
    filter_columns,
    filter_relation: x.filter_relation,
    filter_params: $.copy(x.filter_params.filter(item => !item.shadow)),
    onChangeFilter: useMemoizedFn(debounce(x.onChangeFilter, 300)),
  }

  const props_stat: IPropsStat = {
    visible_columns,
    stat_params: $.copy(x.stat_params),
    onChangeStat: x.onChangeStat,
  }

  const props_group: IPropsGroup = {
    group_params: $.copy(x.group_params),
    getGroupFieldOptions: x.getGroupFieldOptions,
    onChangeGroup: x.onChangeGroup,
  }

  const props_fields: IPropsFields = {
    visible_columns,
    onChangeVisibleColumns: useMemoizedFn(v => {
      x.visible_columns = v

      x.clearApplyView()
    }),
  }

  const props_timeline: IPropsTimeline = {
    label_bind: x.config?.header?.timeline?.label_bind!,
    items: $.copy(x.config?.header?.timeline?.items) || [],
    timeline_type: x.timeline_type,
    timeline_items: $.copy(x.timeline_items),
    timeline_focus: x.timeline_focus,
    onTimelineFocus: x.onTimelineFocus,
  }

  const props_timeline_controls: IPropsTimelineControls = {
    timeline_type: x.timeline_type,
    timeline_timestamp: x.timeline_timestamp,
    timeline_querying: x.timeline_querying,
    timeline_range: x.timeline_range,
    onChangeTimelineType: x.onChangeTimelineType,
    onChangeTimelineTimestamp: x.onChangeTimelineTimestamp,
    onResetTimeline: x.onResetTimeline,
  }

  const props_table: IPropsTable = {
    primary: x.primary,
    table_columns: $.copy(
      x.visible_columns
        .map(item => {
          const column = x.table_columns.find(c => c.name === item.name)!

          return item.visible ? column : null
        })
        .filter(item => item !== null),
    ),
    data: $.copy(x.items.concat(x.stat_items)),
    sort_params: $.copy(x.sort_params),
    editing_info: $.copy(x.editing_info),
    modal_index: x.modal_index,
    table_props: $.copy(pick(x.config?.table, ['table_header_sticky_top', 'border', 'row_click', 'row_bg'])),
    onSort: x.onSort,
    onChange: x.onChange,
    onRowClick: useMemoizedFn((index: number) => {
      x.modal_type === 'view'
      x.modal_index = index
      x.modal_visible = true
    }),
    setEditingInfo: useMemoizedFn(v => (x.editing_info = v)),
    setItems: useMemoizedFn(v => (x.items = v)),
  }

  const props_pagination: IPropsPagination = {
    pagination: $.copy(x.pagination),
    onChangePagination: x.onChangePagination,
  }

  const props_detail: IPropsDetail = {
    form_columns: $.copy(x.form_columns),
    modal_type: x.modal_type,
    item: $.copy(x.modal_index !== null && x.modal_index >= 0 ? x.items.at(x.modal_index) : undefined),
    loading: x.loading,
    onSubmit: x.onSubmit,
    onClose: useMemoizedFn(() => {
      x.modal_visible = false
      x.modal_index = -2
    }),
    render: x.config.form.render ? useMemoizedFn(x.config.form.render) : undefined,
  }

  const props_view: IPropsView = {
    visibles: {
      sort: x.config?.header?.sort !== undefined,
      filter: x.config?.header?.filter !== undefined,
      stat: x.config?.header?.stat !== undefined,
      group: x.config?.header?.group !== undefined,
    },
    filter_columns,
    visible_columns,
    views: $.copy(x.views),
    getSortFieldOptions: x.getSortFieldOptions,
    getGroupFieldOptions: x.getGroupFieldOptions,
    onApplyView: x.onApplyView,
    onChangeViews: useMemoizedFn(v => (x.views = v)),
  }

  const onToggleView = useMemoizedFn(() => (x.modal_view_visible = !x.modal_view_visible))

  const onCreate = useMemoizedFn(() => {
    x.modal_index == -2
    x.modal_type = 'add'
    x.modal_visible = true
  })

  const Dialog = x.config?.form?.dialog === 'modal' ? Modal : Drawer

  const props_dialog =
    x.config?.form?.dialog === 'modal'
      ? {}
      : ({
          placement: x.modal_view_visible ? 'left' : 'right',
          header_actions: x.modal_view_visible && (
            <button className="btn_add_view flex justify_center align_center absolute clickable" onClick={x.onAddView}>
              <Plus className="icon" weight="bold"></Plus>
              <span>Add</span>
            </button>
          ),
        } as IPropsDrawer)

  return (
    <AntdConfigProvider {...props_config_provider}>
      <Provider value={{ base_url: x.config?.baseurl, ref_register_fields }}>
        <div className={$.cx('omnitable_root', styles._local)}>
          {x.config?.header && (
            <div
              className={$.cx(
                'omnitable_table_header_wrap header_wrap w_100 flex flex_wrap justify_between',
                styles.header_wrap,
              )}>
              <div className="flex">
                {x.config?.header?.view && (
                  <button
                    className="header_btn_wrap border_box flex align_center clickable mr_8"
                    onClick={onToggleView}>
                    <Eyes className="icon"></Eyes>
                    <span className="label">View</span>
                    {x.apply_view_name && <span className="counts flex align_center">{x.apply_view_name}</span>}
                  </button>
                )}
                {x.config.header.sort && x.sort_columns.length > 0 && <Sort {...props_sort}></Sort>}
                {x.config.header.filter && x.filter_columns.length > 0 && <Filter {...props_filter}></Filter>}
                {x.config.header.stat && <Stat {...props_stat}></Stat>}
                {x.config.header.group && <Group {...props_group}></Group>}
                {x.config.header.timeline && <TimelineControls {...props_timeline_controls}></TimelineControls>}
              </div>
              <div className="flex">
                {x.config.header.refresh && (
                  <button
                    className={$.cx(
                      'header_btn_wrap square border_box flex justify_center align_center clickable mr_8',
                      x.refreshing && 'refreshing',
                    )}
                    onClick={x.onRefresh}>
                    <RefreshCw className="icon" size="0.921em" strokeWidth={1.5}></RefreshCw>
                  </button>
                )}
                {x.config.header.live && (
                  <button
                    className={$.cx(
                      'header_btn_wrap border_box flex align_center clickable mr_8',
                      x.living && 'living',
                    )}
                    onClick={x.onLive}>
                    {x.living ? (
                      <PauseCircle className="icon"></PauseCircle>
                    ) : (
                      <PlayCircle className="icon"></PlayCircle>
                    )}
                    <span className="label">Live</span>
                  </button>
                )}
                <Fields {...props_fields}></Fields>
                {x.config?.actions?.create && (
                  <Button className="flex justify_center align_center clickable ml_8" type="primary" onClick={onCreate}>
                    <Plus className="icon" weight="bold"></Plus>
                    <span>Create</span>
                  </Button>
                )}
              </div>
            </div>
          )}
          {x.config?.header?.timeline && <Timeline {...props_timeline}></Timeline>}
          <div className="omnitable_table_body_wrap body_wrap w_100 flex flex_column relative">
            {!x.loading_init && x.querying && (
              <div className="querying_wrap w_100 h_100 flex justify_center align_center absolute">
                <LoadingCircle></LoadingCircle>
              </div>
            )}
            {!x.loading_init && x.config ? (
              <Fragment>
                <Table {...props_table}></Table>
                {x.config?.pagination && <Pagination {...props_pagination}></Pagination>}
              </Fragment>
            ) : (
              <div className="loading_wrap w_100 flex justify_center align_center">
                <LoadingCircle></LoadingCircle>
              </div>
            )}
          </div>
          <Dialog
            className={styles.Dialog}
            open={x.modal_visible || x.modal_view_visible}
            title={
              x.modal_view_visible ? 'Table views' : x.modal_type === 'add' ? 'Create' : props_detail.item?.[x.primary]
            }
            width={x.modal_view_visible ? 'min(90vw,660px)' : 'min(100vw,480px)'}
            maskClosable={x.modal_type === 'view' || x.modal_view_visible}
            disablePadding={x.modal_visible}
            onCancel={x.modal_view_visible ? onToggleView : props_detail.onClose}
            {...props_dialog}>
            {x.modal_view_visible ? <View {...props_view}></View> : <Detail {...props_detail}></Detail>}
          </Dialog>
        </div>
      </Provider>
    </AntdConfigProvider>
  )
}

export default $.memo(observer(Index))

export type { Omnitable, ComponentType } from './types'
export type { Model }
