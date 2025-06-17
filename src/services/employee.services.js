import axios from "@/utils/api";
import { toastDisplay } from "@/helper";

export const EmployeeServices = {
  getEmployeeList: _getEmployeeList,
  exportEmployeeCSV: _exportEmployeeCSV,
};

/**
 * Get Employee List
 * @param {*} payload
 * @param {*} callBackFun
 */
function _getEmployeeList(payload, callBackFun) {
  // ✅ MOCK RESPONSE
  setTimeout(() => {
    const mockData = {
      success: true,
      data: {
        total: 3,
        list: [
          {
            code: "EMP001",
            name: "Tanaka Ichiro",
            dob: "1990-01-01",
            department: "HR",
          },
          {
            code: "EMP002",
            name: "Sato Yuki",
            dob: "1985-06-12",
            department: "Finance",
          },
          {
            code: "EMP003",
            name: "Kobayashi Hana",
            dob: "1992-03-25",
            department: "IT",
          },
        ],
      },
    };
    callBackFun(mockData);
  }, 500);

  // 📝 REAL API (Uncomment when backend is ready)
  /*
  axios
    .post("/employee/list", payload)
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
      }
    })
    .catch((error) => {
      toastDisplay(error?.response);
    });
  */
}

/**
 * Export Employee List to CSV
 * @param {*} payload
 * @param {*} callBackFun
 */
function _exportEmployeeCSV(payload, callBackFun) {
  // ✅ MOCK RESPONSE
  setTimeout(() => {
    const mockResponse = {
      success: true,
      result: {
        filePath: "/mock/csv/EmployeeList.csv",
      },
    };
    callBackFun(mockResponse);
  }, 500);

  // 📝 REAL API (Uncomment when backend is ready)
  /*
  axios
    .post("/employee/export", payload)
    .then((response) => {
      if (response && response.data) {
        callBackFun(response.data);
      }
    })
    .catch((error) => {
      toastDisplay(error?.response);
    });
  */
}
