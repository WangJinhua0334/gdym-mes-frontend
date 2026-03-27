import { defHttp } from '/@/utils/http/axios';

enum Api {
  coilprodreport = '/bi/report/mesFlowCardDetailReport', //工序加工的钢卷记录报表
  coilprodreportExportUrl = '/bi/report/mesFlowCardDetailReportExportXls',     // 工序加工的钢卷记录报表
  edit = '/mes/flowCardDetail/editFlowCardDetail', // 编辑流转卡详情信息
  delete = '/mes/flowCardDetail/delete', // 删除工序加工记录（mes_flow_card_detail）
}

export const coilProdReport = (params) => defHttp.get({ url: Api.coilprodreport, params });

/**
 * 导出api
 * @param params
 */
export const coilProdReportExportUrl = Api.coilprodreportExportUrl;

/**
 * 编辑保存报表记录
 * @param params
 */
export const coilProdReportEdit = (params) => defHttp.post({ url: Api.edit, params });

/**
 * 删除工序加工记录（与后端 mes_flow_card_detail:delete 权限对应）
 */
export const mesFlowCardDetailDelete = (params: { id: string | number }) =>
  defHttp.delete({ url: Api.delete, params }, { joinParamsToUrl: true });
