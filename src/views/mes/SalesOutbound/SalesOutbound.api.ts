import {defHttp} from "@/utils/http/axios";



enum Api {
  list = '/mo/mesMoPlan/list',
  save = '/temporarywork/mesTemporaryWork/add',
  edit = '/temporarywork/mesTemporaryWork/edit',
  deleteOne = '/temporarywork/mesTemporaryWork/delete',
  deleteBatch = '/temporarywork/mesTemporaryWork/deleteBatch',
  exportXls = '/temporarywork/mesTemporaryWork/exportXls',
  confirm = '/temporarywork/mesTemporaryWork/confirm',
  audit = '/temporarywork/mesTemporaryWork/audit',
  cancelAudit = '/temporarywork/mesTemporaryWork/cancelAudit',
  close = '/temporarywork/mesTemporaryWork/close',

  /**编辑界面工序任务列表查询 */
  listMoPlanTaskByMoPlanId = '/mo/mesMoPlan/listMoPlanTaskByMoPlanId',

  /**编辑界面数据查询 */
  getEditData = '/mo/mesMoPlan/getEditData',
}

//销售发货列表查询接口
export const list = (params) => defHttp.get({ url: Api.list, params });


/**
 * 保存或者更新
 * @param params
 */
export const saveOrUpdate = (params, isUpdate) => {
  const url = isUpdate ? Api.edit : Api.save;
  return defHttp.post({ url: url, params });
};

export const getEditData = (params) => defHttp.get({ url: Api.getEditData, params });
export const listMoPlanTaskByMoPlanId = Api.listMoPlanTaskByMoPlanId;
