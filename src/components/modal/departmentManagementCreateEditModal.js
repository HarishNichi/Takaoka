import React, { useContext, useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Formik } from "formik";
import * as Yup from "yup";

import { Input, Button, ValidationError, InputDropdown } from "@/components";
import {
  convertToSingleByte,
  getValueByKeyRecursively as translate,
} from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { DepartmentManagementServices } from "@/services/dept_management_services";
import _ from "lodash";
import { EmployeeServices } from "@/services";

const DepartmentCreateEditModal = React.memo(function DepartmentCreateEditModal(props) {
  const { localeJson,locale } = useContext(LayoutContext);
  const { open, close, registerModalAction, currentObj, refreshList } = props;

    const [getListPayload, setGetListPayload] = useState({
      filters: {
        start: 0,
        limit: 100,
        sort_by: "",
        order_by: "desc",
        employee_name: "",
        department: "",
        person_in_charge: "",
        evacuation_shelter: "",
      },
    });
     const [employeeList, setEmployeeList] = useState([]);
     const [filterLoading, setFilterLoading] = useState(false);

  /* -------------------- Validation Schema -------------------- */
  const schema = Yup.object().shape({
    employee_code_id: Yup.string()
      .required(translate(localeJson, "employee_required")),
    name: Yup.string()
      .required(translate(localeJson, "department_name_required")),
    code: Yup.string()
      .required(translate(localeJson, "department_code_required"))
  });

    // Employee dropdown functions
    const onGetEmployeeDropdownList = (response) => {
      let employeeDropdownList = [
        {
          name: "--",
          id: null,
        },
      ];
  
      if (response.success && !_.isEmpty(response.data)) {
        const data = response.data.list;
        data.forEach((employee) => {
          const dropdownItem = {
            name:
              response.locale === "ja"
                ? employee.person_name
                : employee.person_refugee_name || employee.person_name,
            id: employee.employee_code_id,
          };
          employeeDropdownList.push(dropdownItem);
        });
        setEmployeeList(employeeDropdownList);
      }
    };
  
    const fetchEmployeeList = async (searchValue) => {
      const payload = {
        filters: {
          ...getListPayload.filters,
          refugee_name: searchValue,
          department: "",
          person_in_charge: "",
          evacuation_shelter: "",
        },
      };
      setFilterLoading(true);
      await EmployeeServices.getEmployeeList(payload, (response) => {
        const data = response?.data?.list || [];
  
        // Build new employees from API response
        const newEmployees = data.map((employee) => ({
          name:
            response.locale === "ja"
              ? employee.person_name
              : employee.person_refugee_name || employee.person_name,
          id: employee.employee_code_id,
        }));
  
        // Combine old list (excluding default "--" option) + new employees
        const combined = [
          ...employeeList.filter((e) => e.id !== null),
          ...newEmployees,
        ];
  
        // Remove duplicates by 'id'
        const uniqueEmployees = _.uniqBy(combined, "id");
  
        // Final list with "--" option at top
        setEmployeeList([{ name: "--", id: null }, ...uniqueEmployees]);
        setFilterLoading(false);
      });
      setFilterLoading(false);
    };
  
    // Debounced version to avoid spamming API
    const debouncedFetch = _.debounce((value) => {
      console.log("Debounced fetch called with value:", value);
      if (value && value.length >= 2) {
        fetchEmployeeList(value);
      }
    }, 500); // wait 500ms after typing stops
  
    const onFilterSearch = (event) => {
      console.log("onFilterSearch", event);
      debouncedFetch(event.filter);
    };

      // Initialize data on mount
      useEffect(() => {
        const payload = {
          filters: {
            ...getListPayload.filters,
            refugee_name: "",
            department: "",
            person_in_charge: "",
            evacuation_shelter: "",
          },
        };
        EmployeeServices.getEmployeeList(payload, onGetEmployeeDropdownList);
      }, [locale, props]);

  /* -------------------- Render -------------------- */
  return (
    <Formik
      initialValues={currentObj}
      validationSchema={schema}
      enableReinitialize={true}
      onSubmit={(values, { resetForm }) => {
        const payload = {
          name: convertToSingleByte(values.name),
          code: convertToSingleByte(values.code),
          employee_code_id: values.employee_code_id
        };

       if (registerModalAction === "create") {
    props.onRegister(payload);
    resetForm();
  } else if (registerModalAction === "edit") {
    props.onRegister({ ...payload, id: currentObj.id });
    resetForm();
  }
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        resetForm,
        setFieldValue
      }) => (
        <form onSubmit={handleSubmit}>
          <Dialog
            className="new-custom-modal"
            header={
              registerModalAction === "create"
                ? translate(localeJson, "add_department")
                : translate(localeJson, "edit_department")
            }
            visible={open}
            draggable={false}
            blockScroll={true}
            onHide={() => {
              resetForm();
              close();
            }}
            footer={
              /* ---- Footer Buttons (desktop) ---- */
              <div className="text-center">
                <Button
                  buttonProps={{
                    buttonClass: "w-8rem back-button",
                    text: translate(localeJson, "cancel"),
                    onClick: () => {
                      resetForm();
                      close();
                    },
                  }}
                  parentClass="inline back-button"
                />
                <Button
                  buttonProps={{
                    buttonClass: "w-8rem update-button",
                    type: "submit",
                    text:
                      registerModalAction === "create"
                        ? translate(localeJson, "submit")
                        : translate(localeJson, "update"),
                  }}
                  parentClass="inline update-button"
                />
              </div>
            }
          >
            {/* ---- Form Fields ---- */}
            <div className="modal-content">
                 <div className="modal-field-bottom-space">
                                    <InputDropdown
                                      inputDropdownProps={{
                                        inputId: "employeeDropdown",
                                        ariaLabel: translate(localeJson, "employee_name"),
                                        filter: true,
                                        inputDropdownParentClassName: "w-full",
                                        inputDropdownClassName: "w-full",
                                        customPanelDropdownClassName: "w-10rem",
                                        labelProps: {
                                          text: translate(localeJson, "employee_name"),
                                          inputDropdownLabelClassName: "block",
                                          htmlFor: "employeeDropdown",
                                          spanText: "*",
                                          inputDropdownLabelSpanClassName: "p-error",
                                          labelMainClassName: "modal-label-field-space",
                                        },
                                        value: values && values.employee_code_id,
                                        options: employeeList,
                                        optionLabel: "name",
                                        optionValue: "id",
                                        onChange: (e) => {
                                          setFieldValue("employee_code_id", e.value);
                                        },
                                        onBlur: handleBlur,
                                        onFilter: onFilterSearch,
                                        loading: filterLoading,
                                        emptyMessage: (
                                          <span
                                            aria-live="polite"
                                            aria-label={translate(
                                              localeJson,
                                              "data_not_found"
                                            )}
                                            className="sr-only"
                                          >
                                            {translate(localeJson, "data_not_found")}
                                          </span>
                                        ),
                                        pt: {
                                          trigger: {
                                            "aria-label": translate(localeJson, "employee_name"),
                                            title: translate(localeJson, "employee_name"),
                                          },
                                          input: {
                                            "aria-label": translate(localeJson, "employee_name"),
                                            title: translate(localeJson, "employee_name"),
                                          },
                                          select: {
                                            "aria-label": translate(localeJson, "employee_name"),
                                            title: translate(localeJson, "employee_name"),
                                          },
                                          panel: {
                                            "aria-live": "polite",
                                            "aria-atomic": "true",
                                          },
                                        },
                                      }}
                                    />
                                    <ValidationError
                                      errorBlock={errors.employee_code_id && touched.employee_code_id && errors.employee_code_id}
                                    />
                                  </div>
              <div className="modal-field-bottom-space">
                <Input
                  inputProps={{
                    inputParentClassName: `${
                      errors.name && touched.name ? "p-invalid pb-1" : ""
                    }`,
                    labelProps: {
                      text: translate(localeJson, "name"),
                      inputLabelClassName: "block",
                      spanText: "*",
                      inputLabelSpanClassName: "p-error",
                      labelMainClassName: "modal-label-field-space",
                    },
                    inputClassName: "w-full",
                    id: "name",
                    name: "name",
                    value: values.name,
                    onChange: handleChange,
                    onBlur: handleBlur,
                  }}
                />
                <ValidationError
                  errorBlock={errors.name && touched.name && errors.name}
                />
              </div>

              <div className="modal-field-bottom-space">
                <Input
                  inputProps={{
                    inputParentClassName: `${
                      errors.code && touched.code ? "p-invalid pb-1" : ""
                    }`,
                    labelProps: {
                      text: translate(localeJson, "department_id"),
                      inputLabelClassName: "block",
                      spanText: "*",
                      inputLabelSpanClassName: "p-error",
                      labelMainClassName: "modal-label-field-space",
                    },
                    inputClassName: "w-full",
                    id: "code",
                    name: "code",
                    value: values.code,
                    onChange: handleChange,
                    onBlur: handleBlur,
                  }}
                />
                <ValidationError errorBlock={errors.code} />
              </div>

              <div className="text-center">
                <div className="modal-button-footer-space">
                  <Button
                    buttonProps={{
                      buttonClass: "w-full update-button",
                      type: "submit",
                      text:
                        props.registerModalAction == "create"
                          ? translate(localeJson, "submit")
                          : translate(localeJson, "update"),
                      severity: "primary",
                      onClick: () => {
                        handleSubmit();
                      },
                    }}
                    parentClass={"update-button"}
                  />
                </div>
                <div>
                  <Button
                    buttonProps={{
                      buttonClass: "w-full back-button",
                      text: translate(localeJson, "cancel"),
                      onClick: () => {
                        resetForm();
                        close();
                      },
                    }}
                    parentClass={"back-button"}
                  />
                </div>
              </div>
            </div>
          </Dialog>
        </form>
      )}
    </Formik>
  );
});
DepartmentCreateEditModal.displayName = 'DepartmentCreateEditModal';
export default DepartmentCreateEditModal;
