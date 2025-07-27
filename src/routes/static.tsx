/**
 * 静态资源路由
 * 处理所有静态文件的请求
 */

import { Hono } from 'hono';
import { getThemeScript, themeConfig } from '../service/themeService';

const staticRouter = new Hono();

// 主题切换 JavaScript 文件
staticRouter.get('/theme.js', (c) => {
  const script = getThemeScript();
  
  return c.text(script, 200, {
    'Content-Type': themeConfig.contentType,
    'Cache-Control': themeConfig.cacheControl
  });
});

// 可以在这里添加更多静态资源路由
// staticRouter.get('/app.js', (c) => { ... });
// staticRouter.get('/styles.css', (c) => { ... });

export default staticRouter;