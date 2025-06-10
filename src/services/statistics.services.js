import axios from '@/utils/api';
import { toastDisplay } from '@/helper';

/* Identity and Access management (IAM) */
export const StatisticsServices = {
    getList: _getList,
};

/**
 * Get statistics list
 * @param {*} callBackFun 
 */
function _getList(callBackFun) {
    axios.get('/admin/statistics')
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
        })
        .catch((error) => {
            toastDisplay(error?.response);
            callBackFun(false);
        });
}