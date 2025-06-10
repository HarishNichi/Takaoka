import axios from '@/utils/api';
import { downloadBase64File, timestampFile, toastDisplay } from '@/helper';


/* Identity and Access management (IAM) */
export const StockPileSummaryServices = {
    getSummaryList: _getSummaryList,
    getPlaceDropdownList: _getPlaceDropdownList,
    exportStockPileSummaryCSVList: _exportStockPileSummaryCSVList,
    getStockPileEmailData: _getStockPileEmailData,
    getStockPileEmailUpdate: _getStockPileEmailUpdate,
    importData: _importData,
    exportData: _exportData,
    getPlaceList: _getPlaceList,
    bulkDelete: _bulkDelete
};

/**
 * Get History list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getSummaryList(payload, callBackFun) {
    axios.post('/admin/stockpile/summary', payload)
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
function _exportStockPileSummaryCSVList(payload, callBackFun) {
    axios.post('/admin/stockpile/summary/export', payload)
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
            callBackFun(false);
            toastDisplay(error?.response);
        });
}

/**
 * Get StockPile Email Data
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getStockPileEmailData(payload, callBackFun) {
    const queryParams = new URLSearchParams(payload).toString();
    axios.get(`admin/stockpile/summary/mail/detail?${queryParams}`)
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
 * Get StockPile Email Data
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getStockPileEmailUpdate(payload, callBackFun) {
    axios.post('admin/stockpile/summary/mail', payload)
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

/**
 * Import data
 * @param {*} payload
 * @param {*} callBackFun
 */
function _importData(payload, callBackFun) {
    axios
        .post("/admin/stockpile/dashboard/import", payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
                toastDisplay(response, 'import');
            }
        })
        .catch((error) => {
            callBackFun(false);
            toastDisplay(error?.response, 'import');
        });
}

/**
 * Export place data
 * @param {*} payload
 * @param {*} callBackFun
 */
function _exportData() {
    axios
        .post("/admin/stockpile/dashboard/export")
        .then((response) => {
            if (response && response.data && response.data.result.filePath) {
                downloadBase64File(response.data.result.filePath, timestampFile("StockPileDetailsExport"));
            }
        })
        .catch((error) => {
            toastDisplay(error?.response);
        });
}

/**
 * Get place list
 * @param {*} payload
 * @param {*} callBackFun
 */
function _getPlaceList(callBackFun) {
    const payload = {
        "filters": {
            "sort_by": "refugee_name",
            "order_by": "asc"
        },
        "search": "",
        "map": true
    };
    axios
        .post("/user/place/list", payload)
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
 * Bulk delete
 * @param {*} payload
 * @param {*} callBackFun
 */
function _bulkDelete(payload, callBackFun) {
    axios
        .post("/admin/stockpile/summary/inventory/delete", payload)
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