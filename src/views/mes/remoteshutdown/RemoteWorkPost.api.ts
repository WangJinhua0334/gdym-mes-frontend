import {defHttp} from '/@/utils/http/axios';
import { useMessage } from "/@/hooks/web/useMessage";
import { Modal } from 'ant-design-vue';

const { createConfirm } = useMessage();

enum Api {
  list = '/workbench/listRemote',
  remoteshutdown='/workpost/basWorkPost/remoteshutdown',
  remoteshutdownone='/workpost/basWorkPost/remoteshutdownone'
}

/**
 * 列表接口
 * @param params
 */
export const list = (params) =>
  defHttp.get({url: Api.list, params});

/**
 * 关机
 * @param params
 */
export const remoteshutdown = (params,handleSuccess) => {
  let url = Api.remoteshutdown;
  return defHttp.post({url: url, params}).then(() => {
    handleSuccess();
  });;
}

/**
 * 关机单个
 */
export const remoteshutdownone = (params,handleSuccess) => {
  Modal.confirm({
    title: '确认关机',
    content: '是否关机',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      return defHttp.delete({url: Api.remoteshutdownone, params}, {joinParamsToUrl: true}).then(() => {
        handleSuccess();
      });
    },
  });
  
}
