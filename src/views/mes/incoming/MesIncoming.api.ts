import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();
//来料单接口地址
enum Api {
  //来料单查询接口
  list ='/mes/inComing/querySteelCoilInfoByCoilNo',
  //list = '/incoming/mesIncoming/list',
  save = '/incoming/mesIncoming/add',
  edit = '/incoming/mesIncoming/edit',
  deleteOne = '/incoming/mesIncoming/delete',
  deleteBatch = '/incoming/mesIncoming/deleteBatch',
  importExcel = '/incoming/mesIncoming/importExcel',
  exportXls = '/incoming/mesIncoming/exportXls',
  returnMat = '/incoming/mesIncoming/returnMat',
  stock = '/incoming/mesIncoming/stock',
  waitInsp = '/incoming/mesIncoming/waitInsp',
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
 * 列表接口
 * @param params
 */
export const list = (params) => defHttp.get({ url: Api.list, params });

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
 * 退货
 * @param params
 */
export const returnMat = (params) => {
  return defHttp.post({ url: Api.returnMat, params });
};

/**
 * 入库
 * @param params
 */
export const stock = (params) => {
  return defHttp.post({ url: Api.stock, params });
};

/**
 * 批量删除
 * @param params
 */
export const waitInsp = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认推送IQC',
    content: '是否推送选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.put({ url: Api.waitInsp, data: params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
  });
};
