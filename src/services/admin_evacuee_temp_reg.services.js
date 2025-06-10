import { downloadBase64File, timestampFile, toastDisplay } from "@/helper";
import axios from "@/utils/api";

export const AdminEvacueeTempServices = {
    exportData: _exportData,
    getEvacueeTempList: _getEvacueeTempList,
    getTempFamilyEvacueesDetail: _getTempFamilyEvacueesDetail,
    exportTempFamilyEvacueesCSVList: _exportTempFamilyEvacueesCSVList,
    bulkDelete: _bulkDelete
};


/**
 * Export place data
 * @param {*} payload
 * @param {*} callBackFun
 */
function _exportData(payload) {
    axios
        .post("/admin/management/export", payload)
        .then((response) => {
            if (response && response.data && response.data.result.filePath) {
                downloadBase64File(response.data.result.filePath, timestampFile("Admin"));
                toastDisplay(response);
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
function _getEvacueeTempList(payload, callBackFun) {
    axios
        .post("/admin/temp/evacuations/list", payload)
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
 * Get Evacuees Family Data
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getTempFamilyEvacueesDetail(payload, callBackFun) {
    axios.post(`/admin/temp/evacuations/detail`, payload)
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
 * Get Evacuees CSV list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _exportTempFamilyEvacueesCSVList(payload, callBackFun) {
    axios.post('/admin/temp/evacuation/export', payload)
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
 * Get Event Attendees checkout
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _bulkDelete(payload, callBackFun) {
    axios.post('/admin/temp/evacuations/delete', payload)
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