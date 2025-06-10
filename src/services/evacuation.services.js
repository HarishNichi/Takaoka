import axios from '@/utils/api';
import { toastDisplay } from '@/helper';

/* Identity and Access management (IAM) */
export const EvacuationServices = {
    getList: _getList,
    getPlaceDropdownList: _getPlaceDropdownList,
    exportEvacueesCSVList: _exportEvacueesCSVList,
    getFamilyEvacueesDetail: _getFamilyEvacueesDetail,
    evacuationCheckout: _evacuationCheckout,
    eventAttendeesCheckout: _eventAttendeesCheckout,
    getFamilyEvacueesAttendeesDetail: _getFamilyEvacueesAttendeesDetail,
    bulkDelete: _bulkDelete
};

/**
 * Get History list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getList(payload, callBackFun) {
    axios.post('/admin/evacuations', payload)
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
function _exportEvacueesCSVList(payload, callBackFun) {
    axios.post('/admin/evacuation/export', payload)
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
 * Get Evacuees Family Data
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getFamilyEvacueesDetail(payload, callBackFun) {
    axios.post(`/admin/evacuation/detail`, payload)
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
 * Get Evacuees Family Attendees Data
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getFamilyEvacueesAttendeesDetail(payload, callBackFun) {
    axios.post('/admin/attendees/detail', payload)
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
function _evacuationCheckout(payload, callBackFun) {
    axios.post('/admin/evacuation/checkout', payload)
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
 * Get Event Attendees checkout
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _eventAttendeesCheckout(payload, callBackFun) {
    axios.post('/user/event/manual/checkout', payload)
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
 * Get Event Attendees checkout
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _bulkDelete(payload, callBackFun) {
    axios.post('/admin/evacuations/bulk/delete', payload)
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
