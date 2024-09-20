import {defHttp} from '/@/utils/http/axios';


enum Api {
    scrap="/measuring/eamMeasuringType/scrap"
}

/**
 * 报废
 * @param params
 */
export const scrap = (params) => {
    return defHttp.post({url: Api.scrap, params});
}