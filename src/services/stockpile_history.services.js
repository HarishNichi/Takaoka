import axios from '@/utils/api';
import { toastDisplay } from '@/helper';

export const StockpileHistoryServices = {
    getProductTypes: _getProductTypes,
    getProductNames: _getProductNames,
    getHistoryList: _getHistoryList,
    exportStockpileHistoryCSVList: _exportStockpileHistoryCSVList,
};

/**
 * Get product types
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getProductTypes(payload, callBackFun) {
    axios.post('/staff/stockpile/history/dropdown/product', payload)
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
 * Get product names
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getProductNames(payload, callBackFun) {
    axios.post('/staff/stockpile/history/dropdown/category', payload)
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
 * Get history list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getHistoryList(payload, callBackFun) {
    axios.post('/staff/stockpile/history', payload)
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

/**
 * Get Evacuees CSV list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _exportStockpileHistoryCSVList(payload, callBackFun) {
    axios.post('/staff/stockpile/history/export', payload)
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