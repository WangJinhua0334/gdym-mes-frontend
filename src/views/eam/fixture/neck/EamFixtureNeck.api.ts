import {defHttp} from '/@/utils/http/axios';


enum Api {
    neck="/fixture/eamFixtureType/neck"
}

/**
 * 报废
 * @param params
 */
export const neck = (params) => {
    return defHttp.post({url: Api.neck, params});
}