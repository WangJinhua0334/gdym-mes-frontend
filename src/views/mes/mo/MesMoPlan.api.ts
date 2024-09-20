import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  /**列表查询 */
  list = '/mo/mesMoPlan/list',
  /**实体查询 */
  queryById = '/mo/mesMoPlan/queryById',
  /**导出 */
  exportXls = '/mo/mesMoPlan/exportXls',
  /**是否开启齐套检查 */
  queryIsCompleteKitCheck = '/mo/mesMoPlan/queryIsCompleteKitCheck',
  /**新增界面数据查询 */
  getAddData = '/mo/mesMoPlan/getAddData',
  /**新增界面工序任务列表查询 */
  listMoPlanTaskByMoId = '/mo/mesMoPlan/listMoPlanTaskByMoId',
  /**新增 */
  add = '/mo/mesMoPlan/add',
  /**编辑界面数据查询 */
  getEditData = '/mo/mesMoPlan/getEditData',
  /**编辑界面工序任务列表查询 */
  listMoPlanTaskByMoPlanId = '/mo/mesMoPlan/listMoPlanTaskByMoPlanId',
  /**编辑 */
  edit = '/mo/mesMoPlan/edit',
  /**删除 */
  deleteOne = '/mo/mesMoPlan/delete',
  /**批量删除 */
  deleteBatch = '/mo/mesMoPlan/deleteBatch',

  /**分配流转卡界面数据查询 */
  getProductCreateSnData = '/mo/mesMoPlan/getProductCreateSnData',
  /**分配流转卡界面子列表数据查询 */
  listMaterialCreateSnData = '/mo/mesMoPlan/listMaterialCreateSnData',
  /**根据流转卡ID求和数量 */
  getSumQtyByIds = '/mo/mesMoSn/getSumQtyByIds',
  /**分配流转卡 */
  createSn = '/mo/mesMoPlan/createSn',

  /**绑定流转卡子列表数据查询 */
  listMaterialBindSnData = '/mo/mesMoPlan/listMaterialBindSnData',
  /**绑定条码 */
  bindSn = '/mo/mesMoPlan/bindSn',
  /**手动绑定条码 */
  manualBindSn = '/mo/mesMoPlan/manualBindSn',
  /**删除条码 */
  deleteSn = '/mo/mesMoPlan/deleteSn',

  /**工序任务子表分页查询 */
  pageMoPlanTask = '/mo/mesMoPlan/pageMoPlanTask',

  /**下载导入模板 */
  exportTemplateXls = '/mo/mesMoPlan/exportTemplateXls',
  /**批量导入流转卡信息 */
  importSn = '/mo/mesMoPlan/importSn',

  /*获取系统编码*/
  fillRule = '/sys/fillRule/executeRuleByCode/',

  urgentWork = '/mo/mesMoPlan/urgentWork',
}

/**
 * 导出api
 * @param params
 */
export const getExportUrl = Api.exportXls;

/**
 * 导出模板api
 */
export const getExportTemplateXlsUrl = Api.exportTemplateXls;

/**
 * 列表接口
 * @param params
 */
export const list = (params) => defHttp.get({ url: Api.list, params });
/**
 * 实体查询接口
 * @param params
 */
export const queryById = (params) => defHttp.get({ url: Api.queryById, params });

/**
 * 是否开启齐套检查接口接口
 * @param params
 */
export const moCompleteKitCheck = (params) => defHttp.get({ url: Api.queryIsCompleteKitCheck, params });

/**
 * 新增界面数据查询
 * @param params
 */
export const getAddData = (params) => defHttp.get({ url: Api.getAddData, params });
export const listMoPlanTaskByMoId = Api.listMoPlanTaskByMoId;
/**
 * 新增
 * @param params
 */
export const add = (params, handleSuccess) =>
  defHttp.post({ url: Api.add, params }).then(() => {
    handleSuccess();
  });
/**
 * 编辑界面数据查询
 * @param params
 */
export const getEditData = (params) => defHttp.get({ url: Api.getEditData, params });
export const listMoPlanTaskByMoPlanId = Api.listMoPlanTaskByMoPlanId;
/**
 * 编辑
 * @param params
 */
export const edit = (params, handleSuccess) =>
  defHttp.post({ url: Api.edit, params }).then(() => {
    handleSuccess();
  });
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
  const url = isUpdate ? Api.edit : Api.add;
  return defHttp.post({ url: url, params });
};

/**
 * 分配流转卡界面数据查询
 * @param params
 */
export const getProductCreateSnData = (params) => defHttp.get({ url: Api.getProductCreateSnData, params });
export const listMaterialCreateSnData = Api.listMaterialCreateSnData;

/**
 * 工单条码数量求和
 * @param params
 * @returns 条码数量
 */
export const getSumQtyByIds = (params) => defHttp.get({ url: Api.getSumQtyByIds, params });

/**
 * 分配流转卡
 * @param params
 */
export const createSn = (params) => defHttp.post({ url: Api.createSn, params });

/**
 * 绑定流转卡子列表查询
 */
export const listMaterialBindSnData = (params) => defHttp.get({ url: Api.listMaterialBindSnData, params });

/**
 * 绑定流转卡-手动
 * @param params
 */
export const manualBindSn = (params) => defHttp.post({ url: Api.manualBindSn, params });

/**
 * 绑定流转卡-扫描
 * @param params
 */
export const bindSn = (params) => defHttp.put({ url: Api.bindSn, params }, { joinParamsToUrl: true });


/**
 * 发送催工消息
 * @param params
 */
export const urgentWork = (params) => defHttp.put({ url: Api.urgentWork, params }, { joinParamsToUrl: true });

/**
 * 导入api
 */
export const getImportSnUrl = Api.importSn;

/**
 * 删除流转卡
 */
export const deleteSn = (params) => {
  return defHttp.delete({ url: Api.deleteSn, params }, { joinParamsToUrl: true });
};

/**工序任务子表分页查询 */
export const pageMoPlanTask = (params) => defHttp.get({ url: Api.pageMoPlanTask, params });

/**获取系统编码
 * @param code 系统规则编码
 */
export const fillRule = (code) => defHttp.put({ url: Api.fillRule + code });
