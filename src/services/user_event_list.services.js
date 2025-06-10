import axios from '@/utils/api';
import { toastDisplay } from '@/helper';

export const UserEventListServices = {
    getEventsList: _getEventsList,
    createUserEvent: _createUserEvent
};

/**
 * Get user events list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _getEventsList(payload, callBackFun) {
    axios.post('/user/event/list', payload)
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
 * Get user events list
 * @param {*} payload 
 * @param {*} callBackFun 
 */
function _createUserEvent(payload, callBackFun) {
    axios.post('/user/event/checkin/manual', payload)
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