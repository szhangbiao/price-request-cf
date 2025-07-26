/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'

import mainRouter from './routes/index'
import apiRouter from './routes/api'

const app = new Hono()

// 使用全局中间件
app.use('*', logger())
app.use('*', cors())

// 挂载路由
app.route('/', mainRouter)
app.route('/api', apiRouter)

// 导出默认应用
export default app
