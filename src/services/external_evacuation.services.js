import axios from '@/utils/api';
import { toastDisplay } from '@/helper';

/* Identity and Access management (IAM) */
export const ExternalEvacuationServices = {
    exportExternalEvacueesCSVList: _exportExternalEvacueesCSVList,
    getPlaceDropdownList: _getPlaceDropdownList,
    getList: _getList,
    getExternalEvacueesDetail: _getExternalEvacueesDetail,
    getChartScreenData: _getChartScreenData,
    bulkDelete:_bulkDelete
};

/**
 * Get External Evacuees CSV list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _exportExternalEvacueesCSVList(payload, callBackFun) {
    axios.post('/admin/external/family/export', payload)
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

/**
 * Get Place Dropdown List
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getPlaceDropdownList(payload, callBackFun) {
    axios.get('/admin/external/family/place/dropdown/list', payload)
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
 * Get External Evacuees list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getList(payload, callBackFun) {
    axios.post('/admin/external/family/list', payload)
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

/**
 * Get External Evacuees Detail
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getExternalEvacueesDetail(payload, callBackFun) {
    axios.post('/admin/external/family/detail', payload)
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

/**
 * Get Chart Screen Data
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getChartScreenData(payload, callBackFun) {
    axios.get('/admin/external/family', payload)
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

function _bulkDelete(payload, callBackFun) {
    axios.post('/admin/external/family/delete', payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
                toastDisplay(response);
            }
        })
        .catch((error) => {
            callBackFun(false);
            toastDisplay(error?.response);
        });
}