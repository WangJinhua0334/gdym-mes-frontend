import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  list = '/productin/mesProductIn/list',
  save = '/productin/mesProductIn/add',
  edit = '/productin/mesProductIn/edit',
  deleteOne = '/productin/mesProductIn/delete',
  deleteBatch = '/productin/mesProductIn/deleteBatch',
  importExcel = '/productin/mesProductIn/importExcel',
  exportXls = '/productin/mesProductIn/exportXls',
  mesProductInDetailList = '/productin/mesProductIn/queryMesProductInDetailByMainId',
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
export const queryMesProductInDetail = Api.mesProductInDetailList;
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
 * 子表列表接口
 * @param params
 */
export const mesProductInDetailList = (params) => defHttp.get({ url: Api.mesProductInDetailList, params }, { isTransformResponse: false });
