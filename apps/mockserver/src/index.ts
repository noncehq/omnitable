import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { z } from 'zod'

import { serve } from '@hono/node-server'

const app = new Hono()

app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  }),
)

// ---------------------
// Schema
// ---------------------

const SortParamSchema = z.object({
  field: z.string(),
  order: z.union([z.literal('desc'), z.literal('asc')]),
})
type SortParam = z.infer<typeof SortParamSchema>

const FilterParamSchema = z.object({
  field: z.string(),
  expression: z.string(),
  value: z.any(),
})
type FilterParam = z.infer<typeof FilterParamSchema>

const OmniTableQueryRequestSchema = z.object({
  sort_params: z.array(SortParamSchema).optional(),
  filter_relation: z.union([z.literal('and'), z.literal('or')]).optional(),
  filter_params: z.array(FilterParamSchema).optional(),
  page: z.number().optional(),
  pagesize: z.number().optional(),
  params: z.record(z.any()).optional(),
})
type OmniTableQueryRequest = z.infer<typeof OmniTableQueryRequestSchema>

const CreateIncidentDataSchema = z.object({
  Title: z.string(),
  Description: z.string().optional(),
  Status: z.enum(['investigating', 'fixing', 'monitoring', 'resolved']).optional(),
  Priority: z.enum(['no-priority', 'low', 'medium', 'high', 'urgent']).optional(),
  Category: z
    .enum(['hardware', 'software', 'network', 'power_supply', 'operational', 'environmental', 'other'])
    .optional(),
  Diagnosis: z
    .enum(['fan', 'hashboard', 'control_board', 'psu', 'temperature_sensor', 'firmware', 'overheating', 'other'])
    .optional(),
  Assignee: z.string().optional(),
  Reporter: z.string().optional(),
  Farm: z.string().optional(),
  Miners: z.array(z.string()).optional(),
})
type CreateIncidentData = z.infer<typeof CreateIncidentDataSchema>

const UpdateIncidentDataSchema = CreateIncidentDataSchema.partial()
type UpdateIncidentData = z.infer<typeof UpdateIncidentDataSchema>

type MutationResponse = { id: number } | { error: unknown; message: string }

type QueryIncidentData = {
  incidentID: string
  'Created At': number
  'Updated At': number
  Title: string
  Status: 'investigating' | 'fixing' | 'monitoring' | 'resolved'
  Priority: 'no-priority' | 'low' | 'medium' | 'high' | 'urgent'
  Diagnosis: 'fan' | 'hashboard' | 'control_board' | 'psu' | 'temperature_sensor' | 'firmware' | 'overheating' | 'other'
  Category: 'hardware' | 'software' | 'network' | 'power_supply' | 'operational' | 'environmental' | 'other'
  Assignee: string
  Reporter: string
  Farm: string
  Miners: string[]
}

type QueryResponse =
  | { data: { items: QueryIncidentData[]; total: number; page: number; pagesize: number } }
  | {
      error: unknown
      message: string
    }

// ---------------------
// Mock Data Types
// ---------------------

const makeMockIncident = (id: number): QueryIncidentData => ({
  incidentID: String(id),
  'Created At': Date.now(),
  'Updated At': Date.now(),
  Title: `Mock Incident #${id}`,
  Status: ['investigating', 'fixing', 'monitoring', 'resolved'][Math.floor(Math.random() * 4)] as
    | 'investigating'
    | 'fixing'
    | 'monitoring'
    | 'resolved',
  Priority: ['no-priority', 'low', 'medium', 'high', 'urgent'][Math.floor(Math.random() * 5)] as
    | 'no-priority'
    | 'low'
    | 'medium'
    | 'high'
    | 'urgent',
  Diagnosis: ['fan', 'hashboard', 'control_board', 'psu', 'temperature_sensor', 'firmware', 'overheating', 'other'][
    Math.floor(Math.random() * 8)
  ] as 'fan' | 'hashboard' | 'control_board' | 'psu' | 'temperature_sensor' | 'firmware' | 'overheating' | 'other',
  Category: ['hardware', 'software', 'network', 'power_supply', 'operational', 'environmental', 'other'][
    Math.floor(Math.random() * 7)
  ] as 'hardware' | 'software' | 'network' | 'power_supply' | 'operational' | 'environmental' | 'other',
  Assignee: `user_${(id % 10) + 1}`,
  Reporter: `user_${(id % 5) + 1}`,
  Farm: `farm_${(id % 4) + 1}`,
  Miners: Array.from(
    { length: Math.floor(Math.random() * 3 + 1) },
    () => `miner_${Math.floor(Math.random() * 20 + 1)}`,
  ),
})

// 1. POST /omnitable/incidents/query
app.post('/api/omnitable/incidents/query', async c => {
  let body: OmniTableQueryRequest
  try {
    body = OmniTableQueryRequestSchema.parse(await c.req.json())
  } catch (e: any) {
    return c.json({ error: e.errors, message: 'Invalid request body' }, 400)
  }

  const page = body.page ?? 1
  const pagesize = body.pagesize ?? 10
  const total = 42

  const items: QueryIncidentData[] = []
  for (let i = 0; i < pagesize; i++) {
    const seq = (page - 1) * pagesize + i + 1
    if (seq > total) break
    items.push(makeMockIncident(seq))
  }

  const response: QueryResponse = {
    data: {
      items,
      total,
      page,
      pagesize,
    },
  }
  return c.json(response)
})

// 2. POST /omnitable/incidents/create
app.post('/api/omnitable/incidents/create', async c => {
  let body: CreateIncidentData
  try {
    body = CreateIncidentDataSchema.parse(await c.req.json())
  } catch (e: any) {
    return c.json({ error: e.errors, message: 'Invalid request body' }, 400)
  }

  const newId = Math.floor(Math.random() * 10000) + 1
  const response: MutationResponse = { id: newId }
  return c.json(response)
})

// 3. POST /omnitable/incidents/update/:id
app.post('/api/omnitable/incidents/update/:id', async c => {
  const idParam = c.req.param('id')
  const incidentId = Number(idParam)
  if (Number.isNaN(incidentId)) {
    return c.json({ error: {}, message: 'Invalid incident ID' }, 400)
  }

  let body: UpdateIncidentData
  try {
    body = UpdateIncidentDataSchema.parse(await c.req.json())
  } catch (e: any) {
    return c.json({ error: e.errors, message: 'Invalid request body' }, 400)
  }

  const response: MutationResponse = { id: incidentId }
  return c.json(response)
})

// 4. POST /omnitable/incidents/delete/:id
app.post('/api/omnitable/incidents/delete/:id', c => {
  const idParam = c.req.param('id')
  const incidentId = Number(idParam)
  if (Number.isNaN(incidentId)) {
    return c.json({ error: {}, message: 'Invalid incident ID' }, 400)
  }

  const response: MutationResponse = { id: incidentId }
  return c.json(response)
})

app.all('*', c => c.text('Not Found', 404))

const port = Number(process.env.PORT ?? 8787)
console.log(`🚀 Mock server (Hono v4 + @hono/node-server) running at http://localhost:${port}/omnitable/...`)

serve({
  fetch: app.fetch,
  port,
})
