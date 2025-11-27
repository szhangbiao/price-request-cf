# 📧 邮件服务使用指南

## 概述

`EmailService` 使用 MailChannels API 发送邮件，与 Cloudflare Workers 深度集成。

**优势**：
- ✅ 免费额度：每天 10,000 封邮件
- ✅ 无需注册即可使用
- ✅ 支持 HTML 和纯文本邮件
- ✅ 专门的价格数据通知模板

---

## 🚀 快速开始

### 1. 基本使用

```typescript
import { EmailService } from './service/emailService';

// 创建邮件服务实例
const emailService = new EmailService(
  'noreply@yourdomain.com',  // 发件人邮箱
  '价格监控系统'              // 发件人名称
);

// 发送纯文本邮件
await emailService.sendTextEmail(
  'user@example.com',
  '测试邮件',
  '这是一封测试邮件'
);
```

### 2. 发送 HTML 邮件

```typescript
const htmlContent = `
  <h1>欢迎使用价格监控系统</h1>
  <p>这是一封 HTML 格式的邮件。</p>
`;

await emailService.sendHtmlEmail(
  'user@example.com',
  '欢迎邮件',
  htmlContent,
  '这是纯文本备用内容'  // 可选
);
```

### 3. 发送价格更新通知

```typescript
import { PriceData } from './types/price';

const priceData: PriceData = {
  type: 1,
  gold: {
    variety: '上海黄金AU9999',
    latestpri: '520.50',
    openpri: '518.00',
    maxpri: '522.00',
    minpri: '517.50',
    limit: '+2.50',
    yespri: '518.00',
    totalvol: '12345',
    time: '2025-11-27 15:00:00'
  },
  updateTime: new Date().toISOString(),
  source: 'api'
};

// 发送给单个用户
await emailService.sendPriceUpdateEmail(
  'user@example.com',
  priceData,
  '张三'  // 可选
);

// 发送给多个用户
const recipients = [
  { email: 'user1@example.com', name: '张三' },
  { email: 'user2@example.com', name: '李四' },
  { email: 'user3@example.com' }
];

const result = await emailService.sendPriceUpdateToMultiple(recipients, priceData);
console.log(`成功: ${result.success}, 失败: ${result.failed}`);
```

---

## 📝 在定时任务中使用

修改 `src/index.tsx` 中的 `scheduled` 函数：

```typescript
import { EmailService } from './service/emailService';

async scheduled(event: ScheduledEvent, env: CloudflareBindings, ctx: ExecutionContext) {
  console.log('定时任务触发，开始刷新价格数据...');
  
  try {
    const priceHandler = new PriceHandler(env);
    const data = await priceHandler.getPriceData('request_data', true);
    
    if (data) {
      console.log('价格数据已更新');
      
      // 发送邮件通知
      const emailService = new EmailService(
        'noreply@yourdomain.com',
        '价格监控系统'
      );
      
      // 方式1：发送给单个用户
      await emailService.sendPriceUpdateEmail(
        'admin@example.com',
        data,
        '管理员'
      );
      
      // 方式2：发送给多个用户
      const recipients = [
        { email: 'user1@example.com', name: '用户1' },
        { email: 'user2@example.com', name: '用户2' }
      ];
      await emailService.sendPriceUpdateToMultiple(recipients, data);
    }
  } catch (error) {
    console.error('定时任务执行出错:', error);
  }
}
```

---

## 🔧 配置环境变量（可选）

如果你想将发件人信息配置为环境变量，可以在 `.dev.vars` 中添加：

```bash
# 邮件配置
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=价格监控系统
```

然后在 `src/types/price.ts` 的 `Env` 接口中添加：

```typescript
export interface Env {
  // ... 其他配置
  
  // 邮件配置（可选）
  EMAIL_FROM?: string;
  EMAIL_FROM_NAME?: string;
}
```

使用时：

```typescript
const emailService = new EmailService(
  env.EMAIL_FROM || 'noreply@yourdomain.com',
  env.EMAIL_FROM_NAME || '价格监控系统'
);
```

---

## 📊 API 方法说明

### `sendTextEmail(to, subject, content, toName?)`
发送纯文本邮件

**参数**：
- `to`: 收件人邮箱
- `subject`: 邮件主题
- `content`: 邮件内容（纯文本）
- `toName`: 收件人姓名（可选）

**返回**：`Promise<boolean>` - 是否发送成功

---

### `sendHtmlEmail(to, subject, htmlContent, textContent?, toName?)`
发送 HTML 邮件

**参数**：
- `to`: 收件人邮箱
- `subject`: 邮件主题
- `htmlContent`: HTML 内容
- `textContent`: 纯文本内容（备用，可选）
- `toName`: 收件人姓名（可选）

**返回**：`Promise<boolean>` - 是否发送成功

---

### `sendPriceUpdateEmail(to, priceData, toName?)`
发送价格数据更新通知邮件（带精美模板）

**参数**：
- `to`: 收件人邮箱
- `priceData`: 价格数据对象
- `toName`: 收件人姓名（可选）

**返回**：`Promise<boolean>` - 是否发送成功

---

### `sendPriceUpdateToMultiple(recipients, priceData)`
批量发送价格更新通知

**参数**：
- `recipients`: 收件人列表 `Array<{ email: string; name?: string }>`
- `priceData`: 价格数据对象

**返回**：`Promise<{ success: number; failed: number }>` - 发送统计

---

### `sendTestEmail(to)`
发送测试邮件，用于验证邮件服务是否正常工作

**参数**：
- `to`: 收件人邮箱

**返回**：`Promise<boolean>` - 是否发送成功

---

## 🧪 测试邮件服务

创建一个测试 API 路由来测试邮件功能：

在 `src/routes/api.tsx` 中添加：

```typescript
import { EmailService } from '../service/emailService';

// 测试邮件发送
api.get('/test-email', async (c) => {
  const email = c.req.query('email');
  
  if (!email) {
    return c.json({ success: false, message: '请提供邮箱地址' }, 400);
  }
  
  const emailService = new EmailService();
  const result = await emailService.sendTestEmail(email);
  
  return c.json({
    success: result,
    message: result ? '测试邮件发送成功' : '测试邮件发送失败'
  });
});
```

然后访问：`http://localhost:8787/api/test-email?email=your@email.com`

---

## ⚠️ 注意事项

1. **发件人域名**：建议使用你自己的域名作为发件人邮箱，提高送达率
2. **SPF/DKIM 配置**：如果使用自定义域名，需要配置 DNS 记录以提高邮件可信度
3. **发送频率**：免费额度为每天 10,000 封，注意控制发送频率
4. **错误处理**：邮件发送可能失败，建议添加重试机制或日志记录

---

## 📚 更多资源

- [MailChannels 官方文档](https://mailchannels.zendesk.com/hc/en-us/articles/4565898358413-Sending-Email-from-Cloudflare-Workers-using-MailChannels-Send-API)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
