import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  list = '/lwmslot/mesLwmsLot/list',
  save = '/lwmslot/mesLwmsLot/add',
  edit = '/lwmslot/mesLwmsLot/edit',
  deleteOne = '/lwmslot/mesLwmsLot/delete',
  deleteBatch = '/lwmslot/mesLwmsLot/deleteBatch',
  importExcel = '/lwmslot/mesLwmsLot/importExcel',
  exportXls = '/lwmslot/mesLwmsLot/exportXls',
  generateBatchNo = '/lwmslot/mesLwmsLot/generateBatchNo',
  binding = '/lwmslot/mesLwmsLot/binding',
  getSnQty = '/lwmslot/mesLwmsLot//getSnQty',
  generateLwmsSn = '/lwmslot/mesLwmsLot/generateLwmsSn',
  jmreport = '/jmreport/exportPdf',
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
 * 条码绑定
 * @param params
 */
export const getSnQty = (sn) => {
  return defHttp.get({ url: Api.getSnQty, params: { sn } });
};
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
 * 条码绑定
 * @param params
 */
export const binding = (params) => {
  return defHttp.post({ url: Api.binding, params });
};

/**
 * 生成条码
 * @param params
 */
export const generateLwmsSn = (params) => {
  return defHttp.post({ url: Api.generateLwmsSn, params });
};

/**
 * 生成条码
 * @param params
 */
export const jmreport = (params) => {
  return defHttp.post({ url: Api.jmreport, params });
};

/**
 * 生成批次号
 * @param params
 */
export const generateBatchNo = () => {
  return defHttp.get({ url: Api.generateBatchNo, params: {} });
};
