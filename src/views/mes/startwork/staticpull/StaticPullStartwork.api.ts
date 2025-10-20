import {defHttp} from "@/utils/http/axios";


enum Api {
  save = '/etl/picking/pickStart',
}

//精拉扫码开工页面新增页面表单提交
export const saveOrUpdate = (params) => {
  return defHttp.post({url : Api.save, params });
};
