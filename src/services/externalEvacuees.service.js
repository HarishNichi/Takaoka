import { downloadBase64File, timestampFile, toastDisplay } from "@/helper";
import axios from "@/utils/api";

/* Identity and Access management (IAM) */
export const ExternalEvacueesService = {
    exportData: _exportData,
    getList: _getList,
    getEvacueeList: _getEvacueeList
};

/**
 * Export place data
 * @param {*} payload
 * @param {*} callBackFun
 */
function _exportData(payload) {
    axios
        .post("/staff/external/family/export", payload)
        .then((response) => {
            if (response && response.data && response.data.result.filePath) {
                downloadBase64File(response.data.result.filePath, timestampFile("ExternalEvacuees"));
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
function _getList(payload, callBackFun) {
    axios
        .post("/staff/external/family/list", payload)
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
 * Get Evacuee list
 * @param {*} payload
 * @param {*} callBackFun
 */
function _getEvacueeList(payload, callBackFun) {
    axios
        .post("/staff/external/family/detail", payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
        })
        .catch((error) => {
            toastDisplay(error?.response);
        });
}