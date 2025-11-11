import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

export enum Api {
  // ========================半成品生产工单=========================
  // 查询所有的半成品生产工单
  list = '/mo/workOrder/semi/list',

  // 模糊查询生产工单号
  fuzzyQueryByOrderNo = '/mo/workOrder/semi/fuzzyQueryByOrderNo',

  // 表单查询（工单号、生产类型、状态）
  formQuery = '/mo/workOrder/semi/formQuery',

  // 根据 orderNo 查询对应的明细信息（钢卷信息）
  workOrderDetailList = '/mo/workOrderDetail/semi/listByOrderNo',

  // 模糊查询钢卷号
  fuzzyQueryByCoilNo = '/mo/workOrderDetail/semi/fuzzyQueryByCoilNo',


  /**新增 */
  save = '/mo/mesMo/add',
  /**编辑 */
  edit = '/mo/mesMo/edit',
  /**工单查询 */
  getMoById = '/mo/mesMo/queryById',
  /**删除 */
  deleteOne = '/mo/mesMo/delete',
  /**批量删除 */
  deleteBatch = '/mo/mesMo/deleteBatch',
  /**导入 */
  importExcel = '/mo/mesMo/importExcel',
  /**导出 */
  exportXls = '/mo/mesMo/exportXls',
  /**审核 */
  audit = '/mo/mesMo/audit',
  /**弃审 */
  cancelAudit = '/mo/mesMo/cancelAudit',
  /**暂停 */
  stop = '/mo/mesMo/stop',
  /**恢复 */
  resume = '/mo/mesMo/resume',
  /**关闭 */
  close = '/mo/mesMo/close',
  /**开启 */
  open = '/mo/mesMo/open',

  /**是否开启工单齐套检查 */
  moCompleteKitCheck = '/mo/mesMo/queryIsCompleteKitCheck',

  /**查询分配流转卡数据 */
  getCreateSnData = '/mo/mesMo/getCreateSnData',
  /**分配流转卡 */
  createSn = '/mo/mesMo/createSn',
  /**查询下发生产任务数据 */
  //getDispatchData = '/mo/mesMo/getDispatchData',
  /**下发生产任务 */
  //dispatch = '/mo/mesMo/dispatch',

  /**工单流转卡分页查询 */
  mesMoSnPage = '/mo/mesMo/pageMesMoSnByMainId',
  /**工单BOM分页查询 */
  mesMoBomPage = '/mo/mesMo/pageMesMoBomByMainId',

  /**工单BOM列表查询 */
  mesMoBomList = '/mo/mesMo/queryMesMoBomByMainId',
  /**工单工序列表查询 */
  mesMoStationList = '/mo/mesMo/queryMesMoStationByMainId',
  /**工单工序Bom列表查询 */
  mesMoStationBomList = '/mo/mesMo/queryMesMoStationBomByMainId',

  /**根据产品ID查询默认版本BOM明细列表 */
  defaultVerBomDetailListByProdId = '/productbom/basProductBom/queryDefaultVerBomDetailList',
  /**根据产品BOM ID查询BOM明细列表 */
  bomDetailListByBomId = '/productbom/basProductBomDetail/queryBomDetailList',
  /**根据产品ID查询工艺列表 */
  workFlowListByProdId = '/workflow/basWorkflow/listByProdId',
  /**根据工艺ID查询节点列表（不包含工序组节点） */
  workFlowStationListByMainId = '/workflow/basWorkflowStation/listNoStationGroupByMainId',
  /**根据工艺节点ID查询工艺工序物料列表 */
  workFlowStationProductListByMainIds = '/workflow/basWorkflowStation/listBasWfsProductByMainIds',
  /*获取系统编码*/
  fillRule = '/sys/fillRule/executeRuleByCode/',
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

// ======================================= 半成品生产工单 =================================
/**
 * 查询所有的半成品生产工单
 */
export const list = (params) => defHttp.get({ url: Api.list, params });

/**
 * 模糊查询生产工单号
 */
export const fuzzyQueryByOrderNo = (params) => defHttp.get({ url: Api.fuzzyQueryByOrderNo, params });

/**
 * 表单查询（工单号、生产类型、状态）
 */
export const formQuery = (params) => defHttp.get({ url: Api.formQuery, params });

/**
 * 根据 orderNo 查询对应的明细信息（钢卷信息）
 */
export const workOrderDetailList = ( params) => defHttp.get({ url: Api.workOrderDetailList, params });

/**
 * 模糊查询钢卷号
 */
export const fuzzyQueryByCoilNo = (params) => defHttp.get({ url: Api.fuzzyQueryByCoilNo, params });

/**审核 */
export const audit = (params, handleSuccess) => {
  return defHttp.put({ url: Api.audit, params }, { joinParamsToUrl: true }).then(() => {
    if (handleSuccess) {
      handleSuccess();
    }
  });
};

/**弃审 */
export const cancelAudit = (params, handleSuccess) => {
  return defHttp.put({ url: Api.cancelAudit, params }, { joinParamsToUrl: true }).then(() => {
    if (handleSuccess) {
      handleSuccess();
    }
  });
};

/**暂停 */
export const stop = (params, handleSuccess) => {
  return defHttp.put({ url: Api.stop, params }, { joinParamsToUrl: true }).then(() => {
    if (handleSuccess) {
      handleSuccess();
    }
  });
};

/**恢复 */
export const resume = (params, handleSuccess) => {
  return defHttp.put({ url: Api.resume, params }, { joinParamsToUrl: true }).then(() => {
    if (handleSuccess) {
      handleSuccess();
    }
  });
};

/**关闭 */
export const close = (params, handleSuccess) => {
  return defHttp.put({ url: Api.close, params }, { joinParamsToUrl: true }).then(() => {
    if (handleSuccess) {
      handleSuccess();
    }
  });
};

/**开启 */
export const open = (params, handleSuccess) => {
  return defHttp.put({ url: Api.open, params }, { joinParamsToUrl: true }).then(() => {
    if (handleSuccess) {
      handleSuccess();
    }
  });
};

/**是否开启工单齐套检查 */
export const moCompleteKitCheck = (params) => defHttp.get({ url: Api.moCompleteKitCheck, params });

/**查询分配流转卡数据 */
export const getCreateSnData = (params) => defHttp.get({ url: Api.getCreateSnData, params });

/**
 * 分配流转卡
 * @param params
 */
export const createSn = (params) => defHttp.post({ url: Api.createSn, params });

/**查询下发生产任务数据 */
//export const getDispatchData = (params) => defHttp.get({ url: Api.getDispatchData, params });

/**
 * 下发生产任务
 * @param params
 */
//export const dispatch = (params) => defHttp.post({ url: Api.dispatch, params });

/**根据产品ID查询默认版本BOM明细列表 */
export const defaultVerBomDetailListByProdId = (params) => defHttp.get({ url: Api.defaultVerBomDetailListByProdId, params });
/**根据工艺节点ID查询工艺工序物料列表 */
export const bomDetailListByBomId = (params) => defHttp.get({ url: Api.bomDetailListByBomId, params });
/**根据产品ID查询工艺列表 */
export const workFlowListByProdId = (params) => defHttp.get({ url: Api.workFlowListByProdId, params });
/**根据工艺ID查询节点列表（不包含工序组节点） */
export const workFlowStationListByMainId = (params) => defHttp.get({ url: Api.workFlowStationListByMainId, params });
/**根据工艺节点ID查询工艺工序物料列表 */
export const workFlowStationProductListByMainIds = (params) => defHttp.get({ url: Api.workFlowStationProductListByMainIds, params });

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
  const url = isUpdate ? Api.edit : Api.save;
  return defHttp.post({ url: url, params });
};

/**
 * 子表单查询接口
 * @param params
 */
export const queryMesMoBom = Api.mesMoBomList;

/**
 * 子表单查询接口
 * @param params
 */
export const queryMesMoStation = Api.mesMoStationList;

/**
 * 子表单查询接口
 * @param params
 */
export const queryMesMoStationBom = Api.mesMoStationBomList;

/**
 * 子表列表接口
 * @param params
 */
export const mesMoBomList = (params) => defHttp.get({ url: Api.mesMoBomList, params }, { isTransformResponse: false });

/**
 * 子表列表接口
 * @param params
 */
export const mesMoStationList = (params) => defHttp.get({ url: Api.mesMoStationList, params }, { isTransformResponse: false });

/**
 * 子表列表接口
 * @param params
 */
export const mesMoStationBomList = (params) => defHttp.get({ url: Api.mesMoStationBomList, params }, { isTransformResponse: false });

/**
 * 工单流转卡分页查询
 * @param params 参数
 * @returns 结果
 */
export const mesMoSnPage = (params) => defHttp.get({ url: Api.mesMoSnPage, params });

/**
 * 工单BOM分页查询
 * @param params 参数
 * @returns 结果
 */
export const mesMoBomPage = (params) => defHttp.get({ url: Api.mesMoBomPage, params });

/**获取系统编码
 * @param code 系统规则编码
 */
export const fillRule = (code) => defHttp.put({ url: Api.fillRule + code });

export const mesMoCoil = (params) => defHttp.get({ url: Api.mesMoCoil, params });
