import {defHttp} from '/@/utils/http/axios';
import { useMessage } from "/@/hooks/web/useMessage";

const { createConfirm } = useMessage();

enum Api {
    scan='/wip/product/scan',

    
}


  export const scan = (params) =>
  defHttp.get({url: Api.scan, params});
  
