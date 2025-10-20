import {defHttp} from "@/utils/http/axios";


enum Api {
  save = '/etl/picking/pickEnd',
}

//冷轧扫码完工页面新增页面表单提交
export const saveOrUpdate = (params) => {
  return defHttp.post({url : Api.save, params });
};
