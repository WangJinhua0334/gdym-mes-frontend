import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  /**列表查询 */
  list = '/mo/mesMoSn/list',
  /**列表导出 */
  exportXls = '/mo/mesMoSn/exportXls',
  /**创建唯一码 */
  createSeq = '/mo/mesMoSn/createSeq',

  /**工单唯一码列表查询 */
  querySeqPageList = '/mo/mesMoSn/querySeqPageList',
  /**流转卡打印记录列表查询 */
  queryPrintRecordPageList = '/mo/mesMoSn/queryPrintRecordPageList',
  /**流转卡按物料ID查询分组 */
  queryMoSnPrintMapByIds = '/mo/mesMoSn/queryMoSnPrintMapByIds',
  /**删除接口 */
  deleteByIds = '/mo/mesMoSn/deleteByIds',
}

/**
 * 导出api
 * @param params
 */
export const getExportUrl = Api.exportXls;

/**
 * 列表接口
 * @param params
 */
export const list = (params) => defHttp.get({ url: Api.list, params });

/**
 * 创建唯一码
 * @param params
 */
export const createSeq = (params) => defHttp.put({ url: Api.createSeq, params }, { joinParamsToUrl: true });

/**
 * 工单唯一码列表接口
 * @param params
 */
export const querySeqPageList = (params) => defHttp.get({ url: Api.querySeqPageList, params });

/**
 * 流转卡打印记录列表接口
 * @param params
 */
export const queryPrintRecordPageList = (params) => defHttp.get({ url: Api.queryPrintRecordPageList, params });

/**
 * 流转卡按物料ID查询分组
 * @param params
 */
export const queryMoSnPrintMapByIds = (params) => defHttp.get({ url: Api.queryMoSnPrintMapByIds, params });

/**
 * 批量删除
 * @param params
 */
export const batchDelete = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({ url: Api.deleteByIds, data: params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
  });
};
