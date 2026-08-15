import { defHttp } from '/@/utils/http/axios';
import { useUserStore } from '/@/store/modules/user';
import { SYSTEM_DEFAULT_TEMPLATE_CODE } from '/@/enums/printTemplateEnum';

/**
 * 获取当前用户配置的打印模板方案编码（bas_user_extend.print_template_number）。
 * 未配置或查询失败时回退到系统默认模板编码。
 */
export async function getPrintTemplateCode(): Promise<string> {
  try {
    const data = await defHttp.get(
      {
        url: '/userextend/basUserExtend/queryByUsername',
        params: { username: useUserStore().getUserInfo?.username },
      },
      { errorMessageMode: 'none' }
    );
    return data?.printTemplateNumber || SYSTEM_DEFAULT_TEMPLATE_CODE;
  } catch (error) {
    return SYSTEM_DEFAULT_TEMPLATE_CODE;
  }
}

/**
 * 按模板方案编码 + 模板类型解析积木报表 reportId。
 * 编码在租户内唯一，后端按当前租户过滤。
 */
export async function getReportIdByTemplateCode(code: string, type: string): Promise<string> {
  return await defHttp.get({
    url: '/template/basTemplate/getReportIdByCode',
    params: { code, type },
  });
}

/**
 * 模板方案编码换模板方案 ID。
 * 仅用于仍要求传 ID 的历史接口（如 /mo/mesMoSn/queryMoSnPrintMapByIds），
 * 换出的 ID 只作运行时临时值，禁止落库或硬编码。
 */
export async function getTemplateIdByCode(code: string): Promise<string> {
  return await defHttp.get({
    url: '/template/basTemplate/getIdByCode',
    params: { code },
  });
}
