import axios from '@/utils/api';
import { toastDisplay } from '@/helper';

/* Identity and Access management (IAM) */
export const HistoryServices = {
    getList: _getList,
    getPlaceDropdownList: _getPlaceDropdownList,
    exportPlaceHistoryCSVList: _exportPlaceHistoryCSVList,
    registerEmailConfiguration: _registerEmailConfiguration,
    getEmailConfiguration: _getEmailConfiguration,
    getPrefectureList: _getPrefectureList,
    getLineNotificationHistoryList: _getLineNotificationHistoryList,
    getLineNotificationHistoryDetailsList: _getLineNotificationHistoryDetailsList,
};

/**
 * Get History list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getList(payload, callBackFun) {
    axios.post('/admin/place/history/list', payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
        })
        .catch((error) => {
            callBackFun(false);
        });
}

/**
 * Get History list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _exportPlaceHistoryCSVList(payload, callBackFun) {
    axios.post('/admin/place/history/export', payload)
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
 * Register Email Configuration
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _registerEmailConfiguration(payload, callBackFun) {
    axios.post('/admin/place/history/email/configuration', payload)
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
 * Get Email Configuration
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getEmailConfiguration(payload, callBackFun) {
    axios.get('/admin/place/history/email/configuration', payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
        })
        .catch((error) => {
            console.error(error);
        });
}

/**
 * Get Place Dropdown List
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getPlaceDropdownList(payload, callBackFun) {
    axios.get('/admin/place/history/dropdown/list', payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
}

/**
 * Get Prefecture Dropdown List
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getPrefectureList(payload, callBackFun) {
    axios.get('/admin/place/history/prefecture', payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
}

/**
 * Get Line Notification History List
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getLineNotificationHistoryList(payload, callBackFun) {
    axios.post('/admin/line/history', payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
        })
        .catch((error) => {
            callBackFun(false);
            toastDisplay(error?.response);
            console.error('Error fetching data:', error);
        });
}


/**
 * Get Line Notification History List
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getLineNotificationHistoryDetailsList(payload, callBackFun) {
    axios.post('/admin/line/history/details', payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
        })
        .catch((error) => {
            callBackFun(false);
            toastDisplay(error?.response);
            console.error('Error fetching data:', error);
        });
}