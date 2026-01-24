import { defHttp } from '/@/utils/http/axios';

enum Api {
  coilprodreport = '/bi/report/mesFlowCardDetailReport', //工序加工的钢卷记录报表
  coilprodreportExportUrl = '/bi/report/mesFlowCardDetailReportExportXls',     // 工序加工的钢卷记录报表
}

export const coilprodreport = (params) => defHttp.get({ url: Api.coilprodreport, params });

/**
 * 导出api
 * @param params
 */
export const coilprodreportExportUrl = Api.coilprodreportExportUrl;
