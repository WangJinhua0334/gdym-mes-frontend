import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  list = '/lwmsstock/mesLwmsStock/list',
  lwmsStockDetailList = '/lwmsrecord/mesLwmsRecord/list',
  save = '/lwmsstock/mesLwmsStock/add',
  edit = '/lwmsstock/mesLwmsStock/edit',
  deleteOne = '/lwmsstock/mesLwmsStock/delete',
  deleteBatch = '/lwmsstock/mesLwmsStock/deleteBatch',
  importExcel = '/lwmsstock/mesLwmsStock/importExcel',
  exportXls = '/lwmsstock/mesLwmsStock/exportXls',
  queryWhBinIdTree = '/lwmsstock/mesLwmsStock/queryWhBinIdTree',
  queryByLwmsSn = '/lwmsstock/mesLwmsStock/queryByLwmsSn',
  putStock = '/lwmsstock/mesLwmsStock/putStock',
  outStock = '/lwmsstock/mesLwmsStock/outStock',
  putNoCodeStock = '/lwmsstock/mesLwmsStock/putNoCodeStock',
  outNoCodeStock = '/lwmsstock/mesLwmsStock/outNoCodeStock',
  queryWhBinIdByLwmsSn = '/lwmsstock/mesLwmsStock/queryWhBinIdByLwmsSn',
  queryStockByMoCodeInStock = '/lwmsstock/mesLwmsStock/queryStockByMoCodeInStock',
  queryStockByMoCodeNoStock = '/lwmsstock/mesLwmsStock/queryStockByMoCodeNoStock',
}
/**
 * 导出api
 * @param params
 */
export const getExportUrl = Api.exportXls;
/**
 * 导入api
 */
export const getImportUrl = Api.importExcel;
/**
 * 通过sn查询接口
 * @param params
 */
export const queryByLwmsSn = (lwmsSn: string) => defHttp.get({ url: Api.queryByLwmsSn, params: { lwmsSn } });
/**
 * 库位树查询
 * @param params
 */
export const queryWhBinIdTree = () => defHttp.get({ url: Api.queryWhBinIdTree});

/**
 * 查询库位树
 * @param params
 */
export const queryWhBinIdByLwmsSn = (lwmsSn: string | undefined | null) => () => defHttp.get({ url: Api.queryWhBinIdByLwmsSn, params: { lwmsSn } });
/**
 * 列表接口
 * @param params
 */
export const list = (params) => defHttp.get({ url: Api.list, params });
/**
 * 列表接口
 * @param params
 */
export const lwmsStockDetailList = (params) => defHttp.get({ url: Api.lwmsStockDetailList, params });

/**
 * 删除单个
 */
export const deleteOne = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.deleteOne, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
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
      return defHttp.delete({ url: Api.deleteBatch, data: params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
  });
};
/**
 * 保存或者更新
 * @param params
 */
export const saveOrUpdate = (params, isUpdate) => {
  let url = isUpdate ? Api.edit : Api.save;
  return defHttp.post({ url: url, params });
};
/**
 * 入库
 * @param params
 */
export const putStock = (params) => {
  return defHttp.post({ url: Api.putStock, params });
};
/**
 * 无码入库
 * @param params
 */
export const putNoCodeStock = (params) => {
  return defHttp.post({ url: Api.putNoCodeStock, params });
};
/**
 * 出库
 * @param params
 */
export const outStock = (params) => {
  return defHttp.post({ url: Api.outStock, params });
};
/**
 * 无码入库
 * @param params
 */
export const outNoCodeStock = (params) => {
  return defHttp.post({ url: Api.outNoCodeStock, params });
};
/**
 * 通过工单查询已入库条码
 * @param params
 */
export const queryStockByMoCodeInStock = (moCode) => {
  return defHttp.get({ url: Api.queryStockByMoCodeInStock, params: { moCode } });
};
/**
 * 通过工单查询未入库条码
 * @param params
 */
export const queryStockByMoCodeNoStock = (moCode) => {
  return defHttp.get({ url: Api.queryStockByMoCodeNoStock, params: { moCode } });
};
