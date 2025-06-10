import { downloadBase64File, timestampFile, toastDisplay } from "@/helper";
import axios from "@/utils/api";

export const StockpileService = {
    importData: _importData,
    exportData: _exportData,
    getList: _getList,
    create: _create,
    update: _update,
    delete: _delete,
    getCategoryAndProductList: _getCategoryAndProductList
};

/**
 * Import stockpile master data
 * @param {*} payload
 * @param {*} callBackFun
 */
function _importData(payload, callBackFun) {
    axios
        .post("/admin/stockpile/import", payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
                toastDisplay(response, 'import');
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            callBackFun(false);
            toastDisplay(error.response, 'import');
        });
}

/**
 * Export stockpile master data
 * @param {*} payload
 * @param {*} callBackFun
 */
function _exportData(payload, callBackFun) {
    axios
        .post("/admin/stockpile/export", payload)
        .then((response) => {
            if (response && response.data && response.data.result.filePath) {
                downloadBase64File(response.data.result.filePath, timestampFile("MasterStockpile"));
                toastDisplay(response);
            }
        })
        .catch((error) => {
            toastDisplay(error?.response);
        });
}

/**
 * Get stockpile master list
 * @param {*} payload
 * @param {*} callBackFun
 */
function _getList(payload, callBackFun) {
    axios
        .post("/admin/stockpile/list", payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            callBackFun(false);
        });
}

/**
 * Get stockpile category/product dropdown list
 * @param {*} payload
 * @param {*} callBackFun
 */
function _getCategoryAndProductList(callBackFun) {
    axios
        .get("/admin/stockpile/product/dropdown")
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data.data);
            }
        })
        .catch((error) => {
            toastDisplay(error?.response);
        });
}

/**
 * Create a new stockpile master
 * @param {*} payload
 * @param {*} callBackFun
 */
function _create(payload, callBackFun) {
    axios
        .post("/admin/stockpile", payload)
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
 * Update stockpile master by id
 * @param {*} payload
 * @param {*} callBackFun
 */
function _update(id, payload, callBackFun) {
    axios
        .post(`/admin/stockpile/update`, payload)
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
 * Get stockpile master details by id
 * @param {*} id
 * @param {*} callBackFun
 */
function _delete(id, callBackFun) {
    axios
        .delete(`/admin/stockpile/delete`, { data: { "product_id": id } })
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
            toastDisplay(response);
        })
        .catch((error) => {
            callBackFun(false);
            toastDisplay(error?.response);
        });
}