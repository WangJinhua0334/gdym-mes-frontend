import {defHttp} from "@/utils/http/axios";

enum Api {
  save = '/etl/ymAnnealing/annealingStart',
}

/**
 * 罩退开工页面表单提交
 */
export const saveOrUpdate = (params) => {
  return defHttp.post({url : Api.save, params });
};
