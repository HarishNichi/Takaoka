/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from "react";
import { useMemo } from 'react';
import _ from "lodash";
import {
  hideOverFlow,
  showOverFlow,
  getValueByKeyRecursively as translate,
} from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import {
  Button,
  CustomHeader,
  Input,
  NormalTable,
  AdminManagementDeleteModal,
  AdminManagementDetailModal,
  AdminManagementImportModal,
  DepartmentCreateEditModal,
} from "@/components";
import { useAppSelector } from "@/redux/hooks";
import { DepartmentManagementServices } from "@/services/dept_management_services";
export default function DepartmentanagementPage() {
  // Global variant
  const { localeJson, locale, setLoader } = useContext(LayoutContext);
  const AuthReducer = useAppSelector((state) => state.authReducer);
  // Local variant
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteObj, setDeleteObj] = useState(null);
  const [editStaffOpen, setEditStaffOpen] = useState(false);
  const [registerModalAction, setRegisterModalAction] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [currentObj, setCurrentObj] = useState({});
  const [columnValues, setColumnValues] = useState([]);
  const [searchField, setSearchField] = useState("");
  const [detailId, setDetailId] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [tableLoading, setTableLoading] = useState(false);
  const [listPayload, setListPayload] = useState({
    filters: {
      start: "0",
      limit: 10,
      sort_by: "updated_at",
      order_by: "desc",
    },
    search: "",
  });
  const columnNames = useMemo(() => [
  {
    field: "slno",
    header: translate(localeJson, "header_slno"),
    headerClassName: "sno_class",
    textAlign: "center",
    minWidth: "4rem",
    maxWidth: "6rem",
  },
  {
    field: "name",
    header: translate(localeJson, "name"),
    minWidth: "10rem",
    maxWidth: "14rem",
    body: (rowData) => (
      <p
        className="text-link-class "
      >
        {rowData.name}
      </p>
    ),
  },
  {
    field: "code",
    header: translate(localeJson, "department_id"),
    minWidth: "10rem",
    maxWidth: "14rem",
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
              setCurrentObj(rowData);
              setRegisterModalAction("edit");
              setEditStaffOpen(true);
              hideOverFlow();
            },
          }}
          parentClass="edit-button inline"
        />
        <Button
          buttonProps={{
            text: translate(localeJson, "delete"),
            buttonClass: "delete-button ml-2",
            onClick: () => openDeleteDialog(rowData),
          }}
          parentClass="delete-button inline"
        />
      </div>
    ),
  },
], [localeJson, locale]);



  const onImportModalClose = () => {
    setImportModalOpen(false);
    showOverFlow();
  };
  const onStaffEditClose = () => {
    setEditStaffOpen(false);
    showOverFlow();
  };
  const onRegister = (formData) => {
    setLoader(true);
    if (registerModalAction === "create") {
      DepartmentManagementServices.addDepartment(formData, (res) => {
        if (res.success) {
          listApiCall();
          setEditStaffOpen(false);
          showOverFlow();
        }
        setLoader(false);
      });
    } else if (registerModalAction === "edit") {
      DepartmentManagementServices.updateDepartment(
        formData,
        (res) => {
          if (res.success) {
            listApiCall();
            setEditStaffOpen(false);
            showOverFlow();
          }
          setLoader(false);
        }
      );
    }
  };
  const listApiCall = () => {
    setTableLoading(true);
    DepartmentManagementServices.getDeptList(listPayload, (res) => {
      const rows = res?.data?.model?.list || [];
      const total = res?.data?.model?.total || 0;
      const tempList = rows.map((row, idx) => ({
        ...row,
        slno: idx + Number(listPayload.filters.start) + 1,
      }));
      setColumnValues(tempList);
      setTotalCount(total);
      setLoader(false);
      setTableLoading(false);
    });             
  };
  useEffect(() => {
    setTableLoading(true);
    const fetchData = async () => {
      await listApiCall();
    };
    fetchData();
  }, [locale, listPayload]);
  /**
   * Pagination handler
   * @param {*} e
   */
  const onPaginationChange = async (e) => {
    setTableLoading(true);
    if (!_.isEmpty(e)) {
      const newStartValue = e.first; // Replace with your desired page value
      const newLimitValue = e.rows; // Replace with your desired limit value
      await setListPayload((prevState) => ({
        ...prevState,
        filters: {
          ...prevState.filters,
          start: newStartValue,
          limit: newLimitValue,
        },
      }));
    }
  };
  const openDeleteDialog = (rowdata) => {
    setDeleteId(rowdata.id);
    setDeleteObj({
      firstLabel: translate(localeJson, "name"),
      firstValue: rowdata.name,
      secondLabel: translate(localeJson, "department_id"),
      secondValue: rowdata.code,
    });
    setDeleteOpen(true);
    hideOverFlow();
  };
  const onDeleteClose = (status = "") => {
    setLoader;
    if (status == "confirm") {
      DepartmentManagementServices.deleteDepartment(deleteId, (res) => {
        if (res.success) {
          listApiCall();
          setDeleteOpen(false);
          showOverFlow();
        }
      });
    }
    setDeleteOpen(false);
    showOverFlow();
  };
  return (
    <React.Fragment>
      
      <AdminManagementDeleteModal
        open={deleteOpen}
        close={onDeleteClose}
        refreshList={listApiCall}
        deleteObj={deleteObj}
      />
      <DepartmentCreateEditModal
        open={editStaffOpen}
        close={onStaffEditClose}
        registerModalAction={registerModalAction}
        currentObj={currentObj}
        refreshList={listApiCall}
        onRegister={onRegister}
      />
      {detailId && (
        <AdminManagementDetailModal
          open={detailOpen}
          close={() => {
            setDetailOpen(false);
            showOverFlow();
            setDetailId(null);
          }}
          detailId={detailId}
        />
      )}
      <div className="grid">
        <div className="col-12">
          <div className="card">
            <CustomHeader
              headerClass={"page-header1"}
              header={translate(localeJson, "department_management")}
            />
            <div>
              <div className="flex justify-content-end flex-wrap">
                {/* <Button
                  buttonProps={{
                    type: "submit",
                    rounded: "true",
                    import: true,
                    onClick: () => {
                      setImportModalOpen(true);
                      hideOverFlow();
                    },
                    buttonClass: "evacuation_button_height import-button",
                    text: translate(localeJson, "import"),
                  }}
                  parentClass={"mr-1 mt-1 import-button"}
                /> */}
                <Button
                  buttonProps={{
                    type: "submit",
                    rounded: "true",
                    export: true,
                    buttonClass: "evacuation_button_height export-button",
                    text: translate(localeJson, "export"),
                    onClick: () => {
                      DepartmentManagementServices.exportDepartmentCSV(
                        listPayload,
                        (res) => {
                          if (res?.success && res.result?.filePath) {
                            const downloadLink = document.createElement("a");
                            downloadLink.href = res.result.filePath;
                            downloadLink.download =
                              "department_list_" +
                              new Date().toISOString() +
                              ".csv";
                            downloadLink.style.display = "none"; //
                            document.body.appendChild(downloadLink); // for Firefox
                            downloadLink.click();
                            document.body.removeChild(downloadLink);
                          }
                        }
                      );
                    },
                  }}
                  parentClass={"mr-1 mt-1 export-button"}
                />
                <Button
                  buttonProps={{
                    type: "submit",
                    rounded: "true",
                    create: true,
                    buttonClass: "evacuation_button_height create-button",
                    text: translate(localeJson, "create_department"),
                    onClick: () => {
                      setCurrentObj({
                        username: "",
                        name: "",
                        password: "",
                        tel: "",
                      });
                      setRegisterModalAction("create");
                      setEditStaffOpen(true);
                      hideOverFlow();
                    },
                  }}
                  parentClass={"mt-1 create-button"}
                />
              </div>
            </div>
            <div>
              <div>
                <div>
                  <div class="flex justify-content-end gap-3 lg:gap-2 md:gap-2 sm:gap-2 flex-wrap float-right modal-field-top-space modal-field-bottom-space">
                    <Input
                      inputProps={{
                        inputParentClassName:
                          "w-full lg:w-17rem md:w-20rem sm:w-14rem",
                        labelProps: {
                          text: translate(localeJson, "name"),
                          inputLabelClassName: "block",
                        },
                        inputClassName:
                          "w-full lg:w-17rem md:w-20rem sm:w-14rem",
                        id: "householdNumber",
                        name: "householdNumber",
                        onChange: (e) => {
                          setSearchField(e.target.value);
                        },
                      }}
                    />
                    <div className="flex align-items-end">
                      <Button
                        buttonProps={{
                          buttonClass: "w-12 search-button",
                          text: translate(localeJson, "search_text"),
                          icon: "pi pi-search",
                          onClick: () => {
                            setListPayload({
                              ...listPayload,
                              search: searchField,
                            });
                          },
                        }}
                        parentClass={"search-button"}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <NormalTable
                key={locale}
                  stripedRows={true}
                  className={"custom-table-cell"}
                  showGridlines={"true"}
                  columns={columnNames}
                  value={columnValues}
                  filterDisplay="menu"
                  emptyMessage={translate(localeJson, "data_not_found")}
                  paginator={true}
                  paginatorLeft={true}
                  lazy
                  totalRecords={totalCount}
                  loading={tableLoading}
                  first={listPayload.filters.start}
                  rows={listPayload.filters.limit}
                  onPageHandler={(e) => onPaginationChange(e)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
