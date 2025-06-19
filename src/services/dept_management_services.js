import axios from "@/utils/api";
import { toastDisplay } from "@/helper";

export const DepartmentManagementServices = {
  getDeptList: _getDeptList,
  exportDepartmentCSV: _exportDepartmentCSV,
  importDepartmentCSV: _importDepartmentCSV,
  addDepartment: _addDepartment,
  updateDepartment: _updateDepartment,
  deleteDepartment: _deleteDepartment,

};

/**
 * Get Employee List
 * @param {*} payload
 * @param {*} callBackFun
 */
function _getDeptList(payload, callBackFun) {
  // ✅ MOCK RESPONSE
  setTimeout(() => {
    const mockData = {
      success: true,
      data: {
        total: 3,
        list: [
          {
            id: 1,
            name: "Human Resources",
            code: "HR001",
          },
          {
            id: 2,
            name: "Finance",
            code: "FIN002",
          },
          {
            id: 3,
            name: "IT Department",
            code: "IT003",
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
function _importDepartmentCSV(formData, callBackFun) {
  // ✅ MOCK RESPONSE
  setTimeout(() => {
    const mockResponse = {
      success: true,
      message: "Departments imported successfully.",
    };
    callBackFun(mockResponse);
  }, 1000);
}
function _exportDepartmentCSV(payload, callBackFun) {
  // ✅ MOCK RESPONSE
  setTimeout(() => {
    const mockResponse = {
      success: true,
      result: {
        filePath: "/mock/csv/DepartmentList.csv",
      },
    };
    callBackFun(mockResponse);
  }, 500);
}
function _addDepartment(payload, callBackFun) {
  // ✅ MOCK RESPONSE
  setTimeout(() => {
    const mockResponse = {
      success: true,
      message: "Department added successfully.",
      data: {
        id: Math.floor(Math.random() * 10000), // mock new ID
        ...payload,
      },
    };
    callBackFun(mockResponse);
  }, 700);
}
function _updateDepartment(id, payload, callBackFun) {
  setTimeout(() => {
    const mockResponse = {
      success: true,
      message: "Department updated successfully.",
      data: {
        id,
        ...payload,
      },
    };
    callBackFun(mockResponse);
  }, 700);
}
function _deleteDepartment(id, callBackFun) {
  // ✅ MOCK RESPONSE
  setTimeout(() => {
    callBackFun({
      success: true,
      message: "Department deleted successfully.",
      data: { id },
    });
  }, 500);
}