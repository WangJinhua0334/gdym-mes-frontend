import {defHttp} from '/@/utils/http/axios';
import { useMessage } from "/@/hooks/web/useMessage";

const { createConfirm } = useMessage();

enum Api {
    scan='/wip/product/scan',
    list='/productin/mesProductInDetail/list',
    
}


  export const scan = (params) =>
  defHttp.get({url: Api.scan, params});
  
  export const list = (params) =>
  defHttp.get({url: Api.list, params});