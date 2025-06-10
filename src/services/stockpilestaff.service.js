import { downloadBase64File, timestampFile, toastDisplay } from "@/helper";
import axios from "@/utils/api";

export const StockpileStaffService = {
    importData: _importData,
    exportData: _exportData,
    getList: _getList,
    update: _update,
    create: _create,
    dropdown: _dropdown,
    getPlaceNamesByCategory: _getPlaceNamesByCategory,
    deleteByID: _deleteByID
};

/**
 * Import stockpile master data
 * @param {*} payload
 * @param {*} callBackFun
 */
function _importData(payload, callBackFun) {
    axios
        .post("/staff/stockpile/import", payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
                toastDisplay(response, "import");
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            callBackFun(false);
            toastDisplay(error.response, "import");
        });
}

/**
 * Export stockpile master data
 * @param {*} payload
 * @param {*} callBackFun
 */
function _exportData(payload, callBackFun) {
    axios
        .post("/staff/stockpile/summary/export", payload)
        .then((response) => {
            if (response && response.data && response.data.result.filePath) {
                downloadBase64File(response.data.result.filePath, timestampFile("StaffStockpile"));
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
        .post("/staff/stockpile/summary", payload)
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
        .post("/staff/stockpile/create", payload)
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
function _update(payload, callBackFun) {
    axios
        .post(`/staff/stockpile/summary/update`, payload)
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
 * Get Category dropdown data
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _dropdown(payload, callBackFun) {
    axios.post(`/staff/stockpile/dropdown/category`, payload)
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
 * Get place names by category
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getPlaceNamesByCategory(payload, callBackFun) {
    axios.post(`/staff/stockpile/dropdown/product`, payload)
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
 * Delete product by ID
 * @param {*} payload
 * @param {*} callBackFun
 */
function _deleteByID(payload, callBackFun) {
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