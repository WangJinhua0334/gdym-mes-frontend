import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

export enum Api {
  list = '/sampaql/basSamplingAql/list',
  save = '/sampaql/basSamplingAql/add',
  edit = '/sampaql/basSamplingAql/edit',
  deleteOne = '/sampaql/basSamplingAql/delete',
  deleteBatch = '/sampaql/basSamplingAql/deleteBatch',
  importExcel = '/sampaql/basSamplingAql/importExcel',
  importExcelStandAql = '/sampaql/basSamplingAql/importExcelStandAql',
  downLoadAqlTemplate = '/sampaql/basSamplingAql/downLoadAqlTemplate',
  exportXls = '/sampaql/basSamplingAql/exportXls',
  basSamplingAcReList = '/sampaql/basSamplingAql/queryBasSamplingAcReByMainId',
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
 * 子表单查询接口
 * @param params
 */
export const queryBasSamplingAcRe = Api.basSamplingAcReList;
/**
 * 列表接口
 * @param params
 */
export const list = (params) => {
  if (params['schemaId']) {
    return defHttp.get({ url: Api.list, params });
  }
  return Promise.resolve({});
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
 * 子表列表接口
 * @param params
 */
export const basSamplingAcReList = (params) => defHttp.get({ url: Api.basSamplingAcReList, params }, { isTransformResponse: false });
