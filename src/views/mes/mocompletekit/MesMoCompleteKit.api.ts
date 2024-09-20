import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  list = '/mocompletekit/mesMoCompleteKit/list',
  queryDistributeListByMoId = '/mocompletekit/mesMoCompleteKit/listDistributeByMoId',
  queryDistributedListByProdId = '/mocompletekit/mesMoCompleteKit/listDistributedByProdId',

  distribute = '/mocompletekit/mesMoCompleteKit/distribute',
  edit = '/mocompletekit/mesMoCompleteKit/edit',
  deleteOne = '/mocompletekit/mesMoCompleteKit/delete',
  deleteBatch = '/mocompletekit/mesMoCompleteKit/deleteBatch',

  exportXls = '/mocompletekit/mesMoCompleteKit/exportXls',
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
 * 工单物料齐套-分配列表接口
 * @param params
 */
export const queryDistributeListByMoId = (params) => defHttp.get({ url: Api.queryDistributeListByMoId, params });

/**
 * 工单物料齐套-分配列表接口
 */
//export const queryDistributeListByMoId = Api.queryDistributeListByMoId;

/**
 * 工单物料齐套-已分配物料列表接口
 * @param params
 */
export const queryDistributedListByProdId = (params) => defHttp.get({ url: Api.queryDistributedListByProdId, params });

/**
 * 工单物料齐套-编辑
 * @param params
 */
export const edit = (params) => {
  return defHttp.post({ url: Api.edit, params });
};

/**
 * 工单物料齐套-分配接口
 * @param params
 */
export const distribute = (params) => {
  return defHttp.post({ url: Api.distribute, params });
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
