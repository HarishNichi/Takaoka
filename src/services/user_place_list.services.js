import axios from '@/utils/api';
import { toastDisplay } from '@/helper';

export const UserPlaceListServices = {
    getList: _getList,
    getActiveList: _getActiveList
};

/**
 * Get user places list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getList(payload, callBackFun) {
    axios.post('/user/place/list', payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
        })
        .catch((error) => {
            toastDisplay(error?.response);
        });
}

/**
 * Get user Active places list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getActiveList(payload, callBackFun) {
    axios.post('/user/place/detail', payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
        })
        .catch((error) => {
            callBackFun(false);
            toastDisplay(error?.response);
        });
}