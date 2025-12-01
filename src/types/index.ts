
/**
 * API 响应基础接口
 */
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
// 导出所有类型定义
export * from './price';