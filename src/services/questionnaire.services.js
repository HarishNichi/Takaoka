import axios from '@/utils/api';
import { toastDisplay } from '@/helper';

/* Identity and Access management (IAM) */
export const QuestionnaireServices = {
    getList: _getList,
    registerQuestionnaire: _registerQuestionnaire,
    getIndividualList: _getIndividualList,
    registerIndividualQuestionnaire: _registerIndividualQuestionnaire,
};

/**
 * Get History list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getList(payload, callBackFun) {
    axios.post('/admin/questionnaire', payload)
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
 * Get History list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getIndividualList(payload, callBackFun) {
    axios.post('/admin/individual/questionnaire', payload)
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
 * Get Evacuees CSV list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _registerQuestionnaire(payload, callBackFun) {
    axios.post('/admin/questionnaire/upsert', payload)
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
 * Get Evacuees CSV list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _registerIndividualQuestionnaire(payload, callBackFun) {
    axios.post('/admin/individual/questionnaire/upsert', payload)
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