/**
 * 系统默认打印模板方案编码。
 * bas_template 中每个租户各有一条该编码的记录，(code, tenant_id) 唯一。
 * 打印链路一律通过编码解析模板，禁止硬编码 bas_template.id（雪花 ID 跨库迁移会变化）。
 */
export const SYSTEM_DEFAULT_TEMPLATE_CODE = 'SystemDefaultTemplate';
