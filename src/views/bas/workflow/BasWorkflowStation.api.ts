import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  basWorkflowStationList = '/workflow/basWorkflowStation/list',
  basWorkflowStationSave = '/workflow/basWorkflowStation/add',
  basWorkflowStationEdit = '/workflow/basWorkflowStation/edit',
  basWorkflowStation = '/workflow/basWorkflowStation/getById',
  basWorkflowChildStationList = '/workflow/basWorkflowStation/listByPid',
  basWfsActionList = '/workflow/basWorkflowStation/listBasWfsActionByMainId',
  basWfsActionSave = '/workflow/basWorkflowStation/addBasWfsAction',
  basWfsActionEdit = '/workflow/basWorkflowStation/editBasWfsAction',
  basWfsActionDelete = '/workflow/basWorkflowStation/deleteBasWfsAction',
  basWfsActionDeleteBatch = '/workflow/basWorkflowStation/deleteBatchBasWfsAction',
  basWfsProductList = '/workflow/basWorkflowStation/listBasWfsProductByMainId',
  basWfsProductSave = '/workflow/basWorkflowStation/addBasWfsProduct',
  basWfsProductEdit = '/workflow/basWorkflowStation/editBasWfsProduct',
  basWfsProductDelete = '/workflow/basWorkflowStation/deleteBasWfsProduct',
  basWfsProductDeleteBatch = '/workflow/basWorkflowStation/deleteBatchBasWfsProduct',
  basWfsWorkPostList = '/workflow/basWorkflowStation/listBasWfsWorkPostByMainId',
  basWfsWorkPostSave = '/workflow/basWorkflowStation/addBasWfsWorkPost',
  basWfsWorkPostEdit = '/workflow/basWorkflowStation/editBasWfsWorkPost',
  basWfsWorkPostDelete = '/workflow/basWorkflowStation/deleteBasWfsWorkPost',
  basWfsWorkPostDeleteBatch = '/workflow/basWorkflowStation/deleteBatchBasWfsWorkPost',
  basWfsSopList = '/workflow/basWorkflowStation/listBasWfsSopByMainId',
  basWfsSopSave = '/workflow/basWorkflowStation/addBasWfsSop',
  basWfsSopEdit = '/workflow/basWorkflowStation/editBasWfsSop',
  basWfsSopDelete = '/workflow/basWorkflowStation/deleteBasWfsSop',
  basWfsSopDeleteBatch = '/workflow/basWorkflowStation/deleteBatchBasWfsSop',
  basWfsResourceList = '/workflow/basWorkflowStation/listBasWfsResourceByMainId',
  basWfsResourceSave = '/workflow/basWorkflowStation/addBasWfsResource',
  basWfsResourceEdit = '/workflow/basWorkflowStation/editBasWfsResource',
  basWfsResourceDelete = '/workflow/basWorkflowStation/deleteBasWfsResource',
  basWfsResourceDeleteBatch = '/workflow/basWorkflowStation/deleteBatchBasWfsResource',
  basWfsTestItemList = '/workflow/basWorkflowStation/listBasWfsTestItemByMainId',
  basWfsTestItemSave = '/workflow/basWorkflowStation/addBasWfsTestItem',
  basWfsTestItemEdit = '/workflow/basWorkflowStation/editBasWfsTestItem',
  basWfsTestItemDelete = '/workflow/basWorkflowStation/deleteBasWfsTestItem',
  basWfsTestItemDeleteBatch = '/workflow/basWorkflowStation/deleteBatchBasWfsTestItem',

  basStationListByIds = '/station/basStation/listByIds',
}
/**
 * 列表接口
 * @param params
 */
export const basWorkflowStationList = (params) => {
  if (params['workflowId']) {
    //  || params['flag'] == 'sd'
    return defHttp.get({ url: Api.basWorkflowStationList, params });
  }
  return Promise.resolve({});
};
/**
 * 保存或者更新
 * @param params
 */
export const basWorkflowStationSaveOrUpdate = (params) => {
  return defHttp.post({ url: Api.basWorkflowStationEdit, params });
};

export const basWorkflowStation = (params) => {
  return defHttp.get({ url: Api.basWorkflowStation, params });
};

export const basWorkflowChildStationList = (params) => {
  return defHttp.get({ url: Api.basWorkflowChildStationList, params });
};

/**
 * 列表接口
 * @param params
 */
export const basWfsActionList = (params) => {
  if (params['wfsId']) {
    return defHttp.get({ url: Api.basWfsActionList, params });
  }
  return Promise.resolve({});
};

/**
 * 删除单个
 */
export const basWfsActionDelete = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.basWfsActionDelete, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
/**
 * 批量删除
 * @param params
 */
export const basWfsActionDeleteBatch = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({ url: Api.basWfsActionDeleteBatch, data: params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
  });
};
/**
 * 保存或者更新
 * @param params
 */
export const basWfsActionSaveOrUpdate = (params, isUpdate) => {
  let url = isUpdate ? Api.basWfsActionEdit : Api.basWfsActionSave;
  return defHttp.post({ url: url, params });
};
/**
 * 导入
 */
export const basWfsActionImportUrl = '/workflow/basWorkflowStation/importBasWfsAction';

/**
 * 导出
 */
export const basWfsActionExportXlsUrl = '/workflow/basWorkflowStation/exportBasWfsAction';
/**
 * 列表接口
 * @param params
 */
export const basWfsProductList = (params) => {
  if (params['wfsId']) {
    return defHttp.get({ url: Api.basWfsProductList, params });
  }
  return Promise.resolve({});
};

/**
 * 删除单个
 */
export const basWfsProductDelete = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.basWfsProductDelete, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
/**
 * 批量删除
 * @param params
 */
export const basWfsProductDeleteBatch = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({ url: Api.basWfsProductDeleteBatch, data: params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
  });
};
/**
 * 保存或者更新
 * @param params
 */
export const basWfsProductSaveOrUpdate = (params, isUpdate) => {
  let url = isUpdate ? Api.basWfsProductEdit : Api.basWfsProductSave;
  return defHttp.post({ url: url, params });
};
/**
 * 导入
 */
export const basWfsProductImportUrl = '/workflow/basWorkflowStation/importBasWfsProduct';

/**
 * 导出
 */
export const basWfsProductExportXlsUrl = '/workflow/basWorkflowStation/exportBasWfsProduct';
/**
 * 列表接口
 * @param params
 */
export const basWfsWorkPostList = (params) => {
  if (params['wfsId']) {
    return defHttp.get({ url: Api.basWfsWorkPostList, params });
  }
  return Promise.resolve({});
};

/**
 * 删除单个
 */
export const basWfsWorkPostDelete = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.basWfsWorkPostDelete, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
/**
 * 批量删除
 * @param params
 */
export const basWfsWorkPostDeleteBatch = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({ url: Api.basWfsWorkPostDeleteBatch, data: params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
  });
};
/**
 * 保存或者更新
 * @param params
 */
export const basWfsWorkPostSaveOrUpdate = (params, isUpdate) => {
  let url = isUpdate ? Api.basWfsWorkPostEdit : Api.basWfsWorkPostSave;
  return defHttp.post({ url: url, params });
};
/**
 * 导入
 */
export const basWfsWorkPostImportUrl = '/workflow/basWorkflowStation/importBasWfsWorkPost';

/**
 * 导出
 */
export const basWfsWorkPostExportXlsUrl = '/workflow/basWorkflowStation/exportBasWfsWorkPost';
/**
 * 列表接口
 * @param params
 */
export const basWfsSopList = (params) => {
  if (params['wfsId']) {
    return defHttp.get({ url: Api.basWfsSopList, params });
  }
  return Promise.resolve({});
};

/**
 * 删除单个
 */
export const basWfsSopDelete = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.basWfsSopDelete, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
/**
 * 批量删除
 * @param params
 */
export const basWfsSopDeleteBatch = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({ url: Api.basWfsSopDeleteBatch, data: params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
  });
};
/**
 * 保存或者更新
 * @param params
 */
export const basWfsSopSaveOrUpdate = (params, isUpdate) => {
  let url = isUpdate ? Api.basWfsSopEdit : Api.basWfsSopSave;
  return defHttp.post({ url: url, params });
};
/**
 * 导入
 */
export const basWfsSopImportUrl = '/workflow/basWorkflowStation/importBasWfsSop';

/**
 * 导出
 */
export const basWfsSopExportXlsUrl = '/workflow/basWorkflowStation/exportBasWfsSop';
/**
 * 列表接口
 * @param params
 */
export const basWfsResourceList = (params) => {
  if (params['wfsId']) {
    return defHttp.get({ url: Api.basWfsResourceList, params });
  }
  return Promise.resolve({});
};

/**
 * 删除单个
 */
export const basWfsResourceDelete = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.basWfsResourceDelete, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
/**
 * 批量删除
 * @param params
 */
export const basWfsResourceDeleteBatch = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({ url: Api.basWfsResourceDeleteBatch, data: params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
  });
};
/**
 * 保存或者更新
 * @param params
 */
export const basWfsResourceSaveOrUpdate = (params, isUpdate) => {
  let url = isUpdate ? Api.basWfsResourceEdit : Api.basWfsResourceSave;
  return defHttp.post({ url: url, params });
};
/**
 * 导入
 */
export const basWfsResourceImportUrl = '/workflow/basWorkflowStation/importBasWfsResource';

/**
 * 导出
 */
export const basWfsResourceExportXlsUrl = '/workflow/basWorkflowStation/exportBasWfsResource';

/**
 * 列表接口
 * @param params
 */
export const basWfsTestItemList = (params) => {
  if (params['wfsId']) {
    return defHttp.get({ url: Api.basWfsTestItemList, params });
  }
  return Promise.resolve({});
};

/**
 * 删除单个
 */
export const basWfsTestItemDelete = (params, handleSuccess) => {
  return defHttp.delete({ url: Api.basWfsTestItemDelete, params }, { joinParamsToUrl: true }).then(() => {
    handleSuccess();
  });
};
/**
 * 批量删除
 * @param params
 */
export const basWfsTestItemDeleteBatch = (params, handleSuccess) => {
  createConfirm({
    iconType: 'warning',
    title: '确认删除',
    content: '是否删除选中数据',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({ url: Api.basWfsTestItemDeleteBatch, data: params }, { joinParamsToUrl: true }).then(() => {
        handleSuccess();
      });
    },
  });
};
/**
 * 保存或者更新
 * @param params
 */
export const basWfsTestItemSaveOrUpdate = (params, isUpdate) => {
  let url = isUpdate ? Api.basWfsTestItemEdit : Api.basWfsTestItemSave;
  return defHttp.post({ url: url, params });
};
/**
 * 导入
 */
export const basWfsTestItemImportUrl = '/workflow/basWorkflowStation/importBasWfsTestItem';

/**
 * 导出
 */
export const basWfsTestItemExportXlsUrl = '/workflow/basWorkflowStation/exportBasWfsTestItem';

/**
 * 根据ID查询工序列表
 * @param params 工序ID列表
 * @returns 工序列表
 */
export const basStationListByIds = (params) => {
  return defHttp.get({ url: Api.basStationListByIds, params });
};
