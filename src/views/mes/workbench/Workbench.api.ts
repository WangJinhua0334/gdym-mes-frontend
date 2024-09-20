import {defHttp} from '/@/utils/http/axios';

enum Api {
  // homePageData = '/moplan/mesMoPlanTask/getWorkbenchBaseData',
  // getWorkCenterByWorkShopIdUrl = '/moplan/mesMoPlanTask/getWorkCenterByWorkShopId',
  // getWorkPostByWorkCenterIdUrl = '/moplan/mesMoPlanTask/getWorkPostByWorkCenterId',
  // commandData = '/command/basCommand/getCommandData',
  // taskList='/moplan/mesMoPlanTask/list',
  // taskByFlowCard='/moplan/mes',
  // workflowPath='/moplan/mesMoPlanTask/getWorkflowPath',
  // cutUserUrl = '/moplan/mesMoPlanTask/cutUser',
  checkUser = '/sys/user/checkUserPwdAndOrg',
  // findSnListByTaskId = '/moplan/mesMoSn/findSnListByTaskId',
  byIpAddress = '/workpost/basWorkPost/getByIpAddress',
  
  workflowPath = '/workbench/getMoWorkflowByMoPlanId',
  newworkflowPath = '/workbench/newGetMoWorkflowByMoPlanId',
  basCommandList = '/workbench/listEnable',
  moPlanTaskList = '/workbench/listByWkpId',
  moPlanTaskSnList = '/workbench/listSnByMoPlanTaskId',
  scan = '/workbench/scan',  //扫描

  moPlanStationProgress = '/workbench/getMoPlanStationProgress'




}

/**
 * 获取按钮数据接口
 * @param params
 */
// export const getHomePageData = (params) => {
//   return defHttp.get({url: Api.homePageData, params});
// }

/**
 * 获取按钮数据接口
 * @param params
 */
export const getBasCommandList = (params) => {
  return defHttp.get({url: Api.basCommandList, params});
}

/**
 * 获取任务列表
 * @param params
 */
export const getMoPlanTaskList = (params) => {
  return defHttp.get({url: Api.moPlanTaskList, params})
}
/**
 * 根据任务ID获取流转卡列表
 */
export const moPlanTaskSnList = (params) => {
  return defHttp.get({url: Api.moPlanTaskSnList, params})
}

/**
 * 根据流转卡获取任务信息
 * @param params
 */
// export const getTaskByFlowCard = (params) => {
//   return defHttp.get({url: Api.taskByFlowCard, params})
// }

/**
 * 获取工艺路线文件
 * @param params
 */
export const getWorkflowPath = (params) => {
  return defHttp.get({url: Api.workflowPath, params})
}

// 获取新的工艺线路文件
export const getNewWorkflowPath = (params) => {
  return defHttp.get({url: Api.newworkflowPath, params})
}

export const checkUser = (params) => {
  return defHttp.post({url: Api.checkUser, params})
}

/**
 * 根据ip地址匹配工位
 * @param params
 */
export const getByIpAddress = (params) => {
  return defHttp.get({url: Api.byIpAddress, params})
}

/**
 * 扫描
 * @param params
 */
export const getScan = (params) => {
  return defHttp.get({url: Api.scan, params})
}

/**
 * 单击工艺路线节点
 * @param params
 */
export const getMoPlanStationProgress = (params) => {
  return defHttp.get({url: Api.moPlanStationProgress, params})
}
// export const getWorkCenterByWorkShopId = (params) => {
//   return defHttp.get({url: Api.getWorkCenterByWorkShopIdUrl, params})
// }

// export const getWorkPostByWorkCenterId = (params) => {
//   return defHttp.get({url: Api.getWorkPostByWorkCenterIdUrl, params})
// }
