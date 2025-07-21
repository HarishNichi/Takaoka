/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext, useMemo } from "react";
// import _ from 'lodash';

import {
  getEnglishDateDisplayFormat,
  getJapaneseDateDisplayYYYYMMDDFormat,
  getYYYYMMDDHHSSSSDateTimeFormat,
  hideOverFlow,
  showOverFlow,
  getValueByKeyRecursively as translate,
} from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import {
  Button,
  CustomHeader,
  Input,
  InputDropdown,
  NormalTable,
  ExternalModal,
} from "@/components";
import {
  EmployeeServices,
  StaffManagementService,
} from "@/services"; // <-- Added DepartmentManagementServices
import { DepartmentManagementServices } from "@/services/dept_management_services";
import _ from "lodash";

export default function EmployeeListPage() {
  const { locale, localeJson } = useContext(LayoutContext);
  const [employeeList, setEmployeeList] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [searchName, setSearchName] = useState("");
  const [searchDepartment, setSearchDepartment] = useState("");
  const [searchDepartmentId, setSearchDepartmentId] = useState(""); // <-- Added department ID state
  const [searchInCharge, setSearchInCharge] = useState("");
  const [searchShelter, setSearchShelter] = useState("");
  const [evacuationPlaceList, setEvacuationPlaceList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]); // <-- Added department list state
  const [editModalOpen, setEditModalOpen] = useState(false); // <-- Added edit modal state
  const [currentEmployee, setCurrentEmployee] = useState(null); // <-- Added current employee state

  const [getListPayload, setGetListPayload] = useState({
    filters: {
      start: 0,
      limit: 10,
      sort_by: "",
      order_by: "desc",
      employee_name: "",
      department: "",
      person_in_charge: "",
      evacuation_shelter: "",
    },
  });

  const columns = useMemo(() => [
    { field: "si_no", header: translate(localeJson, "si_no"), sortable: false, minWidth: "4rem", maxWidth: "6rem" },
    {
      field: "employee_code",
      header: translate(localeJson, "employee_code"),
      sortable: true,
      minWidth: "10rem",
      maxWidth: "14rem",
    },
    {
      field: "employee_name",
      header: translate(localeJson, "employee_name"),
      sortable: true,
      minWidth: "10rem",
      maxWidth: "14rem",
    },
    {
      field: "dob",
      header: translate(localeJson, "dob"),
      body: (row) =>
        locale === "ja"
          ? getJapaneseDateDisplayYYYYMMDDFormat(row.dob)
          : getEnglishDateDisplayFormat(row.dob),
      sortable: true,
      minWidth: "10rem",
      maxWidth: "14rem",
    },
    {
      field: "department",
      header: translate(localeJson, "department"),
      sortable: true,
      minWidth: "10rem",
      maxWidth: "14rem",
      body: (row) => {
        const dept = departmentList.find(dep => dep.id === row.department);
        return dept ? dept.name : row.department;
      },
    },
    {
      field: "person_in_charge",
      header: translate(localeJson, "person_in_charge"),
      sortable: true,
      minWidth: "10rem",
      maxWidth: "14rem",
    },
    {
      field: "evacuation_shelter",
      header: translate(localeJson, "evacuation_place"),
      sortable: true,
      minWidth: "8rem",
      maxWidth: "12rem",
    },
    {
      field: "language",
      header: translate(localeJson, "language"),
      minWidth: "6rem",
      maxWidth: "8rem",
      body: (row) => row.language,
    },
    {
      field: "actions",
      header: translate(localeJson, "common_action"),
      textAlign: "center",
      alignHeader: "center",
      className: "action_class",
      minWidth: "8rem",
      maxWidth: "12rem",
      body: (rowData) => (
        <div>
          <Button
            buttonProps={{
              text: translate(localeJson, "edit"),
              buttonClass: "edit-button",
              onClick: () => {
                // Find the department id by name (robust match)
                const dept = departmentList.find(
                  (d) => d.name && rowData.person_dept_id &&
                    d.name.trim().toLowerCase() === rowData.person_dept_id.trim().toLowerCase()
                );
                setCurrentEmployee({
                  ...rowData,
                  department: dept ? String(dept.id) : "",
                });
                setEditModalOpen(true);
                hideOverFlow();
              },
            }}
            parentClass="edit-button inline"
          />
        </div>
      ),
    },
  ], [locale]);

  const { getEmployeeList, exportEmployeeCSV, importData } = EmployeeServices;

  const fetchEmployees = async () => {
    setTableLoading(true);
    const payload = {
      filters: {
        ...getListPayload.filters,
        refugee_name: searchName,
        department: searchDepartmentId, // <-- Use department ID instead of name
        person_in_charge: searchInCharge,
        evacuation_shelter: searchShelter,
      },
    };
    getEmployeeList(payload, handleResponse);
  };

  const handleResponse = (res) => {
    if (res?.success) {
      const rows = res.data.list.map((emp, i) => ({
        si_no: i + getListPayload.filters.start + 1,
        employee_code: emp.employee_code,
        employee_name: emp.person_name,
        person_in_charge: "",
        evacuation_shelter: locale == "ja" ? emp.place_name : emp.place_name_en || emp.place_name,
        // For edit modal:
        id: emp.person_id,
        name: emp.person_name,
        refugee_name: emp.person_refugee_name,
        tel: emp.person_tel,
        postalCode: emp.person_postal_code ? String(emp.person_postal_code) : "",
        prefecture_id: emp.person_prefecture_id ? String(emp.person_prefecture_id) : "",
        address: emp.person_address,
        gender: emp.person_gender ? String(emp.person_gender) : "",
        dob: emp.person_dob,
        department: emp.person_dept_id, // for display (optional)
        person_dept_id: emp.person_dept_id, // <-- ensure this is present for modal matching
        language: locale, // <-- add language property
      }));
      setEmployeeList(rows);
      setTotalCount(res.data.total);
    }
    setTableLoading(false);
  };

  const handleExport = () => {
    exportEmployeeCSV(getListPayload, (res) => {
      if (res.success) {
        const downloadLink = document.createElement("a");
        downloadLink.href = res.result.filePath;
        downloadLink.download =
          "Employee_" + getYYYYMMDDHHSSSSDateTimeFormat(new Date()) + ".csv";
        downloadLink.click();
      }
    });
  };

  const handlePagination = (e) => {
    setGetListPayload((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        start: e.first,
        limit: e.rows,
      },
    }));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchEmployees();
  }, [getListPayload, locale]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Fetch evacuation places for dropdown
    onGetHistoryPlaceDropdownListOnMounting();
    // Fetch departments for dropdown
    onGetDepartmentDropdownListOnMounting();
  }, []);
  const onGetHistoryPlaceDropdownListOnMounting = () => {
    StaffManagementService.getActivePlaceList(onGetHistoryPlaceDropdownList);
  };

  const onGetHistoryPlaceDropdownList = (response) => {
    let historyPlaceCities = [
      {
        name: "--",
        id: null,
      },
    ];
    if (response.success && !_.isEmpty(response.data)) {
      const data = response.data.model.list;
      data.map((obj, i) => {
        let placeDropdownList = {
          name: response.locale == "ja" ? obj.name : obj.name_en || obj.name,
          name_en: obj.name_en || obj.name,
          name_ja: obj.name,
          id: obj.id,
        };
        historyPlaceCities.push(placeDropdownList);
      });
      setEvacuationPlaceList(historyPlaceCities);
    }
  };

  const onGetDepartmentDropdownListOnMounting = () => {
    const payload = {};
    DepartmentManagementServices.getUserDepartmentDropdown(
      payload,
      onGetDepartmentDropdownList
    );
  };

  const onGetDepartmentDropdownList = (response) => {
    let departmentDropdownList = [
      {
        name: "--",
        id: null,
      },
    ];
    let departments = Array.isArray(response.data) ? response.data : response.data?.list || [];
    departments.forEach((obj) => {
      let departmentItem = {
        name: obj.name,
        id: obj.id,
      };
      departmentDropdownList.push(departmentItem);
    });
    setDepartmentList(departmentDropdownList);
  };

  const onEditModalClose = () => {
    setEditModalOpen(false);
    setCurrentEmployee(null);
    showOverFlow();
  };

  const handleEditSubmit = (values) => {
    // Map Formik values to API payload
    const payload = {
      person_id: values.id,
      dept_id: values.department?.id || values.department, // handle both object or id
      refugee_name: values.refugee_name,
      name: values.name,
      postal_code: values.postalCode,
      prefecture_id: values.prefecture_id,
      address: values.address,
      tel: values.tel,
      gender: values.gender,
      dob: `${values.year}/${values.month.padStart(2, '0')}/${values.date.padStart(2, '0')}`,
      note: values.note || '', // if note is not in the form, can be omitted or set to ''
    };
    EmployeeServices.updateEmployee(payload, (res) => {
      if (res && res.success) {
        fetchEmployees();
        onEditModalClose();
      }
    });
  };

  return (
    <>
      {" "}
      <ExternalModal
        open={editModalOpen}
        close={onEditModalClose}
        header={translate(localeJson, "edit_employee")}
        buttonText={translate(localeJson, "update")}
        setEvacueeValues={handleEditSubmit}
        editObj={currentEmployee || {}}
        registerModalAction="edit"
      />
      <div className="grid">
        <div className="col-12">
          <div className="card">
            <div className="flex flex-wrap align-items-center justify-content-between">
              <div className="flex align-items-center gap-2 mb-2">
                <CustomHeader
                  headerClass="page-header1"
                  customParentClassName="mb-0"
                  header={translate(localeJson, "employee_list")}
                />
              </div>
              <div className="flex align-items-center gap-2" style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                {/* Only export button remains */}
                <Button
                  buttonProps={{
                    text: translate(localeJson, "export"),
                    export: true,
                    onClick: handleExport,
                    buttonClass: "evacuation_button_height export-button",
                  }}
                  parentClass="evacuation_button_height export-button"
                />
              </div>
            </div>

            <form>
              <div className="p-fluid formgrid grid mt-3">
                <div className="field col-12 md:col-3 lg:col-3">
                  <Input
                    inputProps={{
                      inputParentClassName: "w-full",
                      labelProps: {
                        text: translate(localeJson, "name"),
                        inputLabelClassName: "block",
                      },
                      inputClassName: "",
                      value: searchName,
                      onChange: (e) => setSearchName(e.target.value),
                    }}
                  />
                </div>

                <div className="field col-12 md:col-3 lg:col-3">
                  <InputDropdown
                    inputDropdownProps={{
                      inputId: "departmentDropdown",
                      ariaLabel: translate(localeJson, "department"),
                      inputDropdownParentClassName: "",
                      inputDropdownClassName: "",
                      customPanelDropdownClassName: "",

                      labelProps: {
                        text: translate(localeJson, "department"),
                        inputDropdownLabelClassName: "block",
                        htmlFor: "departmentDropdown",
                      },

                      value: searchDepartment,
                      options: departmentList,
                      optionLabel: "name",
                      onChange: (e) => {
                        setSearchDepartment(e.value);
                        setSearchDepartmentId(e.value?.id || ""); // <-- Store department ID
                      },

                      emptyMessage: (
                        <span
                          aria-live="polite"
                          aria-label={translate(localeJson, "data_not_found")}
                          className="sr-only"
                        >
                          {translate(localeJson, "data_not_found")}
                        </span>
                      ),
                      pt: {
                        trigger: {
                          "aria-label": translate(localeJson, "department"),
                          title: translate(localeJson, "department"),
                        },
                        input: {
                          "aria-label": translate(localeJson, "department"),
                          title: translate(localeJson, "department"),
                        },
                        select: {
                          "aria-label": translate(localeJson, "department"),
                          title: translate(localeJson, "department"),
                        },
                        panel: {
                          "aria-live": "polite",
                          "aria-atomic": "true",
                        },
                      },
                    }}
                  />
                </div>

                <div className="field col-12 md:col-3 lg:col-3">
                  <Input
                    inputProps={{
                      inputParentClassName: "w-full",
                      labelProps: {
                        text: translate(localeJson, "person_in_charge"),
                        inputLabelClassName: "block",
                      },
                      inputClassName: "",
                      value: searchInCharge,
                      onChange: (e) => setSearchInCharge(e.target.value),
                    }}
                  />
                </div>

                <div className="field col-12 md:col-3 lg:col-3">
                  <InputDropdown
                    inputDropdownProps={{
                      inputId: "evacuationDropdown",
                      ariaLabel: translate(localeJson, "evacuation_site"),
                      inputDropdownParentClassName: "",
                      inputDropdownClassName: "",
                      customPanelDropdownClassName: "",

                      // ✅ Main fallback aria-label

                      // ✅ Proper label
                      labelProps: {
                        text: translate(localeJson, "evacuation_site"),
                        inputDropdownLabelClassName: "block",
                        htmlFor: "evacuationDropdown",
                      },

                      // ✅ Value and options
                      value: searchShelter,
                      options: evacuationPlaceList,
                      optionLabel: "name",
                      onChange: (e) => setSearchShelter(e.value),

                      // ✅ Accessible message for no options
                      emptyMessage: (
                        <span
                          aria-live="polite"
                          aria-label={translate(localeJson, "data_not_found")}
                          className="sr-only"
                        >
                          {translate(localeJson, "data_not_found")}
                        </span>
                      ),
                      pt: {
                        trigger: {
                          // ✅ Fixes the issue
                          "aria-label": translate(
                            localeJson,
                            "evacuation_site"
                          ),
                          title: translate(localeJson, "evacuation_site"),
                        },
                        input: {
                          "aria-label": translate(
                            localeJson,
                            "evacuation_site"
                          ),
                          title: translate(localeJson, "evacuation_site"),
                        },
                        select: {
                          "aria-label": translate(
                            localeJson,
                            "evacuation_site"
                          ),
                          title: translate(localeJson, "evacuation_site"),
                        },
                        panel: {
                          "aria-live": "polite",
                          "aria-atomic": "true",
                        },
                      },
                    }}
                  />
                </div>
              </div>

              {/* 🔘 Search Button - OUTSIDE the grid, aligned right */}
              <div className="flex justify-content-end mt-3">
                <Button
                  buttonProps={{
                    buttonClass:
                      "w-full lg:w-9rem md:w-9rem sm:w-9rem search-button block text-center p-0",
                    text: translate(localeJson, "filter"),
                    type: "button",
                    onClick: fetchEmployees,
                  }}
                  parentClass={
                    "search-button w-full flex justify-content-end mb-3"
                  }
                />
              </div>
            </form>

            <NormalTable
            key={locale}
              lazy
              id="employee-list"
              totalRecords={totalCount}
              loading={tableLoading}
              size="small"
              stripedRows={true}
              paginator
              showGridlines
              value={employeeList}
              columns={columns}
              first={getListPayload.filters.start}
              rows={getListPayload.filters.limit}
              emptyMessage={translate(localeJson, "data_not_found")}
              onPageHandler={handlePagination}
              paginatorLeft={true}
              onSort={(e) =>
                setGetListPayload({
                  ...getListPayload,
                  filters: {
                    ...getListPayload.filters,
                    sort_by: e.sortField,
                    order_by:
                      getListPayload.filters.order_by === "desc"
                        ? "asc"
                        : "desc",
                  },
                })
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}
