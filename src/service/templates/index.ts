import { IEmailTemplate, TemplateType } from './types';
import { DefaultTemplate } from './DefaultTemplate';
import { MinimalTemplate } from './MinimalTemplate';

// 导出所有模板类
export { DefaultTemplate } from './DefaultTemplate';
export { MinimalTemplate } from './MinimalTemplate';
export { BaseTemplate } from './BaseTemplate';
export * from './types';

/**
 * 模板工厂函数
 * 根据模板类型创建对应的模板实例
 */
export function createEmailTemplate(type: TemplateType = TemplateType.DEFAULT): IEmailTemplate {
    switch (type) {
        case TemplateType.MINIMAL:
            return new MinimalTemplate();
        case TemplateType.DEFAULT:
        default:
            return new DefaultTemplate();
    }
}

/**
 * 获取所有可用的模板
 */
export function getAllTemplates(): IEmailTemplate[] {
    return [
        new DefaultTemplate(),
        new MinimalTemplate(),
    ];
}
