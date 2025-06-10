import axios from '@/utils/api';
import { toastDisplay } from '@/helper';

/* Identity and Access management (IAM) */
export const EventQuestionnaireServices = {
    getList: _getList,
    registerUpdateEvent: _registerUpdateEvent,
    getEventDetail: _getEventDetail,
    deleteEvent: _deleteEvent,
    updateEventData: _updateEventData,
    updateEventStatus: _updateEventStatus,
    getSingleEvent: _getSingleEvent,
    updateSingleEvent: _updateSingleEvent
};

/**
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getSingleEvent(payload, callBackFun) {
    axios.post('/user/event/default')
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
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getList(payload, callBackFun) {
    axios.post('/admin/events/list', payload)
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
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getEventDetail(payload, callBackFun) {
    axios.get('/admin/events/show', payload)
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
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _updateEventData(payload, callBackFun) {
    axios.put('/admin/events/update', payload)
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
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _updateSingleEvent(payload, callBackFun) {
    axios.put('/admin/events/update/default', payload)
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
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _updateEventStatus(payload, callBackFun) {
    axios.put('/admin/events/status/update', payload)
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
function _registerUpdateEvent(payload, callBackFun) {
    axios.post('/admin/events/create', payload)
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
 * delete Event
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _deleteEvent(payload, callBackFun) {
    axios.delete('/admin/events/delete', { data: { "id": payload.id } })
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