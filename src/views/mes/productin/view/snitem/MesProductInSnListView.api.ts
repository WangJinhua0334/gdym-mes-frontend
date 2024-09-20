import {defHttp} from '/@/utils/http/axios';
import { useMessage } from "/@/hooks/web/useMessage";

const { createConfirm } = useMessage();

enum Api {
    list='/productin/mesProductInDetailItem/list',
    
}
  
  export const list = (params) =>
  defHttp.get({url: Api.list, params});