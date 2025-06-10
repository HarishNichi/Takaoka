import axios from "@/utils/api";
import { toastDisplay } from "@/helper";

export const StaffSuppliesServices = {
  getList: _getStaffSuppliesList,
  create: _createStaffSupply,
};

function _getStaffSuppliesList(payload, callBackFun) {
  axios
    .post(`/staff/supplies`, payload)
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function _createStaffSupply(payload, callBackFun) {
  axios
    .post("/staff/supplies/store", payload)
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