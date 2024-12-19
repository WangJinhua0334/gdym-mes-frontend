import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';

const { createConfirm } = useMessage();

enum Api {
  scan = '/wip/product/scan',
  save = '/productin/mesProductIn/add',
}

export const scan = (params) => defHttp.get({ url: Api.scan, params });

/**
 * 保存或者更新
 * @param params
 */
export const save = (params) => {
  return defHttp.post({ url: Api.save, params });
};
