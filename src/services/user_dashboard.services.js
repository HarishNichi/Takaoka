import axios from '@/utils/api';
import { toastDisplay } from '@/helper';

export const UserDashboardServices = {
    getListByID: _getListByID,
    getEventListByID: _getEventListByID
};

/**
 * Get place information by place ID
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getListByID(payload, callBackFun) {
    const queryParams = new URLSearchParams(payload).toString();
    axios.post(`/place/detail`, payload)
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
 * Get place information by place ID
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getEventListByID(payload, callBackFun) {
    axios.post(`/user/event/dashboard`, payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
        })
        .catch((error) => {
            toastDisplay(error?.response);
        });
}