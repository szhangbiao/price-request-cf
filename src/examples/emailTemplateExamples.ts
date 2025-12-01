import { EmailService } from '../service/emailService';
import { PriceData } from '../types/price';

/**
 * 邮件模板使用示例
 * 
 * 本文件展示如何使用新的邮件模板系统
 */

// 创建邮件服务实例
const emailService = new EmailService();

// 示例价格数据
const samplePriceData: PriceData = {
    type: 1,  // 必需字段
    updateTime: new Date().toISOString(),
    source: '示例数据源',
    stocks: [
        {
            name: '上证指数',
            current: 3250.50,
            change: 15.30,
            percent: 0.47,
            volume: 250000000,
            amount: 350000000000,
        },
        {
            name: '深证成指',
            current: 11500.20,
            change: -25.80,
            percent: -0.22,
            volume: 180000000,
            amount: 280000000000,
        },
        {
            name: '创业板指',
            current: 2350.80,
            change: 8.50,
            percent: 0.36,
            volume: 120000000,
            amount: 150000000000,
        },
    ],
    gold: {
        variety: 'AU9999',
        latestpri: '450.50',
        openpri: '448.20',
        maxpri: '451.80',
        minpri: '447.50',
        limit: '+2.30',
        yespri: '448.20',
        totalvol: '12500',
        time: new Date().toISOString(),
    },
    exchangeRate: {
        currencyF: 'USD',
        currencyF_Name: '美元',
        currencyT: 'CNY',
        currencyT_Name: '人民币',
        currencyFD: '1',
        exchange: '7.2350',
        result: '7.2350',
        updateTime: new Date().toISOString(),
    },
};

/**
 * 示例 1: 使用默认模板发送邮件
 */
async function sendWithDefaultTemplate() {
    const result = await emailService.sendPriceHtmlEmail(
        'recipient@example.com',
        samplePriceData
        // 不指定模板类型，默认使用 'default'
    );

    console.log('默认模板发送结果:', result);
}

/**
 * 示例 2: 使用简洁模板发送邮件
 */
async function sendWithMinimalTemplate() {
    const result = await emailService.sendPriceHtmlEmail(
        'recipient@example.com',
        samplePriceData,
        'minimal'  // 指定使用简洁模板
    );

    console.log('简洁模板发送结果:', result);
}

/**
 * 示例 3: 批量发送，使用默认模板
 */
async function batchSendWithDefaultTemplate() {
    const recipients = [
        { email: 'user1@example.com', name: '用户1' },
        { email: 'user2@example.com', name: '用户2' },
        { email: 'user3@example.com', name: '用户3' },
    ];

    const result = await emailService.sendPriceUpdateToMultiple(
        recipients,
        samplePriceData
        // 不指定模板类型，默认使用 'default'
    );

    console.log('批量发送结果:', result);
}

/**
 * 示例 4: 批量发送，使用简洁模板
 */
async function batchSendWithMinimalTemplate() {
    const recipients = [
        { email: 'user1@example.com', name: '用户1' },
        { email: 'user2@example.com', name: '用户2' },
        { email: 'user3@example.com', name: '用户3' },
    ];

    const result = await emailService.sendPriceUpdateToMultiple(
        recipients,
        samplePriceData,
        'minimal'  // 所有收件人使用简洁模板
    );

    console.log('批量发送结果:', result);
}

/**
 * 示例 5: 根据条件选择模板
 */
async function sendWithConditionalTemplate(isMobile: boolean) {
    // 移动设备使用简洁模板，桌面设备使用默认模板
    const templateType = isMobile ? 'minimal' : 'default';

    const result = await emailService.sendPriceHtmlEmail(
        'recipient@example.com',
        samplePriceData,
        templateType
    );

    console.log(`使用${templateType}模板发送结果:`, result);
}

// 导出示例函数供测试使用
export {
    sendWithDefaultTemplate,
    sendWithMinimalTemplate,
    batchSendWithDefaultTemplate,
    batchSendWithMinimalTemplate,
    sendWithConditionalTemplate,
};
