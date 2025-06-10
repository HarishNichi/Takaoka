import axios from "@/utils/api";

export const StaffDashBoardServices = {
  getList: _getStaffDashboardList,
  getEventList: _getStaffEventDashboardList
};

function _getStaffDashboardList(payload, callBackFun) {
  axios
    .post(`/staff/place/dashboard`, payload)
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

function _getStaffEventDashboardList(payload, callBackFun) {
  axios
    .post(`/staff/event/dashboard`, payload)
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