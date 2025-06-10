import axios from '@/utils/api';
import { downloadBase64File, getYYYYMMDDHHSSSSDateTimeFormat, toastDisplay } from '@/helper';

/* Identity and Access management (IAM) */
export const ShortageSuppliesServices = {
    callExport: _calExport,
    getList: _getList,
};

/**
 * Export data
 */
function _calExport() {
    axios.get('/admin/material/supply/export')
        .then((response) => {
            if (response && response.data) {
                if (response.data?.result?.filePath) {
                    let date = getYYYYMMDDHHSSSSDateTimeFormat(new Date());
                    downloadBase64File(response.data.result.filePath, `Shortage_supplies_${date}.csv`);
                }
                toastDisplay(response);
            }
        })
        .catch((error) => {
            toastDisplay(error?.response);
        });
}

/**
 * Get dashboard list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getList(payload, callBackFun) {
    axios.post('/admin/material/supply/list', payload)
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