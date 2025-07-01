import React, { useState, useEffect, useContext } from "react";
// import _ from 'lodash';

import {
  getEnglishDateDisplayFormat,
  getJapaneseDateDisplayYYYYMMDDFormat,
  getYYYYMMDDHHSSSSDateTimeFormat,
  getValueByKeyRecursively as translate,
} from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import {
  Button,
  CustomHeader,
  Input,
  InputDropdown,
  NormalTable,
} from "@/components";
import { EmployeeServices, StaffManagementService } from "@/services"; // <-- Make sure this service exists
import _ from "lodash";

export default function EmployeeListPage() {
  const EVAC_SITE_ID = "evacuationSiteDropdown";
  const { locale, localeJson } = useContext(LayoutContext);
  const [employeeList, setEmployeeList] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [searchName, setSearchName] = useState("");
  const [searchDepartment, setSearchDepartment] = useState("");
  const [searchInCharge, setSearchInCharge] = useState("");
  const [searchShelter, setSearchShelter] = useState("");
  const [evacuationPlaceList, setEvacuationPlaceList] = useState([]);

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

  const columns = [
    { field: "si_no", header: translate(localeJson, "si_no"), sortable: false },
    {
      field: "employee_code",
      header: translate(localeJson, "employee_code"),
      sortable: true,
    },
    {
      field: "employee_name",
      header: translate(localeJson, "employee_name"),
      sortable: true,
    },
    {
      field: "dob",
      header: translate(localeJson, "dob"),
      body: (row) =>
        locale === "ja"
          ? getJapaneseDateDisplayYYYYMMDDFormat(row.dob)
          : getEnglishDateDisplayFormat(row.dob),
      sortable: true,
    },
    {
      field: "department",
      header: translate(localeJson, "department"),
      sortable: true,
    },
    {
      field: "person_in_charge",
      header: translate(localeJson, "person_in_charge"),
      sortable: true,
    },
    {
      field: "evacuation_shelter",
      header: translate(localeJson, "evacuation_place"),
      sortable: true,
    },
  ];

  const { getEmployeeList, exportEmployeeCSV } = EmployeeServices;

  const fetchEmployees = async () => {
    setTableLoading(true);
    const payload = {
      filters: {
        ...getListPayload.filters,
        employee_name: searchName,
        department: searchDepartment,
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
        employee_code: emp.code,
        employee_name: emp.name,
        dob: emp.dob,
        department: emp.department,
        person_in_charge: emp.person_in_charge,
        evacuation_shelter: emp.evacuation_shelter,
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

  return (
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
            <div>
              <Button
                buttonProps={{
                  text: translate(localeJson, "export"),
                  export: true,
                  onClick: handleExport,
                  buttonClass: "export-button",
                }}
                parentClass="export-button"
              />
            </div>
          </div>

          <form>
            <div className="p-fluid formgrid grid">
              <div className="field col-12 md:col-6 lg:col-3">
                <Input
                  inputProps={{
                    inputParentClassName: "w-full",
                    labelProps: {
                      text: translate(localeJson, "name"),
                      inputLabelClassName: "block",
                    },
                    inputClassName: "w-full",
                    value: searchName,
                    onChange: (e) => setSearchName(e.target.value),
                  }}
                />
              </div>

              <div className="field col-12 md:col-6 lg:col-3">
                <Input
                  inputProps={{
                    inputParentClassName: "w-full",
                    labelProps: {
                      text: translate(localeJson, "department"),
                      inputLabelClassName: "block",
                    },
                    inputClassName: "w-full",
                    value: searchDepartment,
                    onChange: (e) => setSearchDepartment(e.target.value),
                  }}
                />
              </div>

              <div className="field col-12 md:col-6 lg:col-3">
                <Input
                  inputProps={{
                    inputParentClassName: "w-full",
                    labelProps: {
                      text: translate(localeJson, "person_in_charge"),
                      inputLabelClassName: "block",
                    },
                    inputClassName: "w-full",
                    value: searchInCharge,
                    onChange: (e) => setSearchInCharge(e.target.value),
                  }}
                />
              </div>

              <div className="field col-12 md:col-6 lg:col-3">
                <label
                  id={`${EVAC_SITE_ID}`}
                  htmlFor={EVAC_SITE_ID}
                  className="sr-only"
                >
                  {translate(localeJson, "evacuation_site")}
                </label>
                <InputDropdown
                  inputDropdownProps={{
                    inputId: EVAC_SITE_ID,
                    inputDropdownParentClassName:
                      "w-full lg:w-14rem md:w-14rem sm:w-10rem",
                    labelProps: {
                      text: translate(localeJson, "evacuation_site"),
                      inputDropdownLabelClassName: "block",
                    },
                    inputDropdownClassName:
                      "w-full lg:w-14rem md:w-14rem sm:w-10rem",
                    customPanelDropdownClassName: "w-10rem",
                    value: searchShelter,
                    options: evacuationPlaceList,
                    optionLabel: "name",
                    onChange: (e) => setSearchShelter(e.value),
                    emptyMessage: (
                      <span
                        aria-live="polite"
                        aria-label={translate(localeJson, "data_not_found")}
                        className="sr-only"
                      >
                        {translate(localeJson, "data_not_found")}
                      </span>
                    ),
                    ariaLabel: translate(localeJson, "evacuation_site"),
                    pt: {
                      input: {
                        "aria-label": translate(localeJson, "evacuation_site"),
                        placeholder: translate(localeJson, "evacuation_site"),
                        title: translate(localeJson, "evacuation_site"),
                      },
                      select: {
                        "aria-label": translate(localeJson, "evacuation_site"), // ✅ now correct
                        title: translate(localeJson, "evacuation_site"),
                      },
                      trigger: {
                        "aria-label": translate(localeJson, "evacuation_site"),
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
                    getListPayload.filters.order_by === "desc" ? "asc" : "desc",
                },
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
