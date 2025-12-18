/**
 * 静态资源路由
 * 使用 Cloudflare Assets 绑定处理静态文件
 */

import { Hono } from 'hono';

const staticRouter = new Hono<{ Bindings: Env }>();

// 处理根路径下的静态文件（如 /theme.js, /favicon.ico 等）
staticRouter.get('/:filename{.+\\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$}', async (c) => {
  const filename = c.req.param('filename');

  try {
    // 使用相对路径访问 ASSETS 绑定中的文件
    const response = await c.env.ASSETS.fetch(new Request(`/${filename}`));

    if (response.status === 404) {
      return c.notFound();
    }

    // 设置适当的缓存头
    const headers = new Headers(response.headers);
    headers.set('Cache-Control', 'public, max-age=3600');

    return new Response(response.body, {
      status: response.status,
      headers
    });
  } catch (error) {
    console.error('Static file error:', error);
    return c.notFound();
  }
});

// 处理 /static/ 路径下的文件
staticRouter.get('/static/*', async (c) => {
  const url = new URL(c.req.url);
  const assetPath = url.pathname.replace('/static', '');

  try {
    // 使用相对路径
    const response = await c.env.ASSETS.fetch(new Request(assetPath));

    if (response.status === 404) {
      return c.notFound();
    }

    const headers = new Headers(response.headers);
    headers.set('Cache-Control', 'public, max-age=86400'); // 24小时缓存

    return new Response(response.body, {
      status: response.status,
      headers
    });
  } catch (error) {
    console.error('Static asset error:', error);
    return c.notFound();
  }
});

export default staticRouter;