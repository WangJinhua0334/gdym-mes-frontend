import { defHttp } from '/@/utils/http/axios';

enum Api {
  getAbnormalEvents = '/bi/AbnormalBoard/getAbnormalEvents', //异常事件
  getAbnormalHours = '/bi/AbnormalBoard/getAbnormalHours', //异常时长占比
  getAbnormalInfos = '/bi/AbnormalBoard/getAbnormalInfos', //异常信息
  getAbnormalTotal = '/bi/AbnormalBoard/getAbnormalTotal', //异常总汇数
  getAbnormalTypes = '/bi/AbnormalBoard/getAbnormalTypes', //异常类型排行占比
  getAbnormalWorkStationStatistics = '/bi/AbnormalBoard/getAbnormalWorkStationStatistics', //年度工位异常统计
}

export const getAbnormalEvents = (params) => defHttp.get({ url: Api.getAbnormalEvents, params });
export const getAbnormalHours = (params) => defHttp.get({ url: Api.getAbnormalHours, params });
export const getAbnormalInfos = (params) => defHttp.get({ url: Api.getAbnormalInfos, params });
export const getAbnormalTotal = (params) => defHttp.get({ url: Api.getAbnormalTotal, params });
export const getAbnormalTypes = (params) => defHttp.get({ url: Api.getAbnormalTypes, params });
export const getAbnormalWorkStationStatistics = (params) => defHttp.get({ url: Api.getAbnormalWorkStationStatistics, params });
