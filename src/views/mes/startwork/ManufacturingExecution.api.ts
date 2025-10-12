import {defHttp} from "@/utils/http/axios";


enum Api {
  list = '/mo/mesMo/list',
  save = '/mo/mesMo/add',
}

//酸洗扫码开工页面新增页面表单提交
export const saveOrUpdate = (params) => {
  return defHttp.post({url : Api.save, params });
};
