import styles from './page.module.css'

import type { Omnitable } from '@omnitable/omnitable'

const options = {
  Status: [
    { label: 'Investigating', value: 'investigating', icon: 'magnifying-glass' },
    { label: 'Fixing', value: 'fixing', icon: 'wrench' },
    { label: 'Monitoring', value: 'monitoring', icon: 'pulse' },
    { label: 'Resolved', value: 'resolved', icon: 'checks' },
  ],
  Priority: [
    { label: 'No Priority', value: 'no-priority' },
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Urgent', value: 'urgent' },
  ],
  Category: [
    { label: 'Hardware', value: 'hardware', icon: 'hard-drives' },
    { label: 'Software', value: 'software', icon: 'app-window' },
    { label: 'Network', value: 'network', icon: 'cell-tower' },
    { label: 'Power Supply', value: 'power_supply', icon: 'lightning-slash' },
    { label: 'Operational', value: 'operational', icon: 'hand' },
    { label: 'Environmental', value: 'environmental', icon: 'globe-x' },
    { label: 'Other', value: 'other', icon: 'waves' },
  ],
  Diagnosis: [
    { label: 'Fan', value: 'fan', icon: 'fan' },
    { label: 'Hashboard', value: 'hashboard', icon: 'gauge' },
    { label: 'Control Board', value: 'control_board', icon: 'toggle-left' },
    { label: 'Psu', value: 'psu', icon: 'battery-charging' },
    { label: 'Temperature Sensor', value: 'temperature_sensor', icon: 'thermometer-simple' },
    { label: 'Firmware', value: 'firmware', icon: 'hard-drive' },
    { label: 'Overheating', value: 'overheating', icon: 'thermometer-hot' },
    { label: 'Other', value: 'other', icon: 'waves' },
  ],
}

export default {
  name: 'table_normal',
  primary: 'incidentID',
  baseurl: process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8787/api/omnitable/incidents',
  actions: {
    query: '/query',
    create: '/create',
    update: '/update/{{incidentID}}',
    delete: '/delete/{{incidentID}}',
  },
  header: {
    filter: {
      columns: [
        { name: 'Title', datatype: 'string' },
        { name: 'Status', datatype: 'array' },
        { name: 'Priority', datatype: 'array', forcetype: 'priority' },
        { name: 'Category', datatype: 'array' },
        { name: 'Diagnosis', datatype: 'array' },
        { name: 'Reporter', datatype: 'array' },
      ],
    },
    sort: {},
  },
  table: {
    columns: [
      { name: 'ID' },
      { name: 'Priority', sort: true },
      { name: 'Title', width: 320 },
      { name: 'Status' },
      { name: 'Category' },
      { name: 'Diagnosis' },
      { name: 'Created At', sort: true },
      { name: 'Operation' },
    ],
  },
  form: {
    columns: [{ name: 'Title' }, { name: 'Description' }],
    use_table_columns: true,
    exclude_table_columns: ['Created At', 'Operation'],
    dialog: 'modal',
    modal: {
      className: styles.modal,
      width: 'min(900px,84vw)',
      height: 'min(600px,84vh)',
      header: () => null,
    },
  },
  fields: {
    common: {
      ID: { bind: 'incidentID', type: 'text', props: { prefix: '' } },
      Title: { bind: 'Title', type: 'input' },
      Priority: {
        bind: 'Priority',
        type: 'priority',
        props: { placeholder: 'Select Priority', borderless: true },
      },
      Status: {
        bind: 'Status',
        type: 'select',
        props: { options: options.Status, placeholder: 'Select Status', borderless: true },
      },
      Category: {
        bind: 'Category',
        type: 'select',
        props: { options: options.Category, placeholder: 'Select Category', borderless: true },
      },
      Diagnosis: {
        bind: 'Diagnosis',
        type: 'select',
        props: { options: options.Diagnosis, placeholder: 'Select Diagnosis', borderless: true },
      },
    },
    table: {
      'Created At': { bind: 'Created At', type: 'date', props: { format: 'YYYY-MM-DD HH:mm' } },
      Operation: { bind: '_operation', type: 'operation' },
    },
    form: {
      Title: { bind: 'Title', type: 'textarea', props: { autoSize: true, placeholder: 'Input event title' } },
      Description: { bind: 'Description', type: 'editor', props: {} },
    },
  },
  pagination: {},
} as Omnitable.Config
