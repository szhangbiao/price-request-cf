import { PriceData } from '../../types/price';

/**
 * 邮件模板类型枚举
 */
export enum TemplateType {
    DEFAULT = 'default',
    MINIMAL = 'minimal',
}

/**
 * 邮件模板数据接口
 */
export interface EmailTemplateData {
    priceData: PriceData;
    updateTime: string;
}

/**
 * 邮件模板接口
 * 所有邮件模板都必须实现此接口
 */
export interface IEmailTemplate {
    /**
     * 生成完整的 HTML 邮件内容
     * @param data 模板数据
     * @returns HTML 字符串
     */
    generateHtml(data: EmailTemplateData): string;

    /**
     * 获取模板名称
     */
    getName(): string;

    /**
     * 获取模板描述
     */
    getDescription(): string;
}
