import { toastDisplay } from "@/helper";
import axios from "@/utils/api";

export const StaffRegisterServices = {
  getList: _getRegisterCheckInList,
  create: _createRegisterCheckIn,
  bulkUpdateRegisterCheckIn: _bulkUpdateRegisterCheckIn
};

function _getRegisterCheckInList(payload, callBackFun) {
  axios
    .post(`/staff/register/checkin/list`, payload)
    .then((response) => {
      if (response) {
        callBackFun(response.data);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function _createRegisterCheckIn(payload, callBackFun) {
  axios
    .post("/staff/register/checkin", payload)
    .then((response) => {
      callBackFun(response);
      if (response) {
        toastDisplay(response);
      }
    })
    .catch((error) => {
      callBackFun(false);
      toastDisplay(error?.response);
    });
}

function _bulkUpdateRegisterCheckIn(payload, callBackFun) {
  axios
    .post(`/staff/register/checkin`, payload)
    .then((response) => {
      if (response) {
        callBackFun(response.data);
        toastDisplay(response);
      }
    })
    .catch((error) => {
      callBackFun(false);
      toastDisplay(error?.response);
    });
}