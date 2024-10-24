import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  list = '/wip/productwoke/workHoursPageList',
  exportUrl = '/wip/productwoke/workHourExportXls',
  batchExamine = '/wip/productwoke/batchExamine',
  batchRefuseExamine = '/wip/productwoke/batchRefuseExamine',
  edit = '/wip/productwoke/editHour',
}

/**
 *
 * @param params 查询报工工时记录
 * @returns
 */
export const list = (params) => defHttp.get({ url: Api.list, params });
/**
 * 导出报工记录api
 * @param params
 */
export const exportUrl = Api.exportUrl;

/**
 * 保存或者更新
 * @param params
 */
export const saveOrUpdate = (params, isUpdate) => {
  const url = Api.edit;
  return defHttp.post({ url: url, params });
};

/**
 * 批量审核
 * @param params
 */
export const batchExamine = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认审核',
    content: '是否审核选中的数据，已审核的数据会跳过处理',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.post({ url: Api.batchExamine, data: params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
  });
};

/**
 * 批量审核
 * @param params
 */
export const batchRefuseExamine = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认弃审',
    content: '是否弃审选中的数据，未审核的数据会跳过处理',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.post({ url: Api.batchRefuseExamine, data: params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
  });
};
