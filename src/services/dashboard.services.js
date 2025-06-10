import axios from '@/utils/api';
import { toastDisplay } from '@/helper';

/* Identity and Access management (IAM) */
export const DashboardServices = {
    getList: _getList,
    updateFullStatus: _updateFullStatus,
};

/**
 * Get dashboard list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getList(payload, callBackFun) {
    axios.post('/admin/dashboard', payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            callBackFun(false);
        });
}

/**
 * Update full status by id
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _updateFullStatus(payload, callBackFun) {
    axios.post('/admin/place/status/update/full', payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
                toastDisplay(response);
            }
        })
        .catch((error) => {
            toastDisplay(error?.response);
        });
}