import React, { useContext, useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Formik } from "formik";
import * as Yup from "yup";
import _ from "lodash";

import {
  Button,
  Input,
  ValidationError,
  Password,
  InputDropdown,
} from "@/components";
import {
  convertToSingleByte,
  getValueByKeyRecursively as translate,
} from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import {
  HeadQuarterManagement,
  DepartmentManagementServices,
  EmployeeServices,
} from "@/services";

const HqEditModal = React.memo(function HqEditModal(props) {
  const { localeJson, locale } = useContext(LayoutContext);
  const { open, close } = props && props;

  // State for dropdowns
  const [employeeList, setEmployeeList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [filterLoading, setFilterLoading] = useState(false);
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

  const isEmail = (value) => {
    // Check if the value includes '@' and matches the email pattern
    return (
      !value.includes("@") ||
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value)
    );
  };
  const schema = Yup.object().shape({
    username: Yup.string()
      .required(translate(localeJson, "user_id_required"))
      .max(100, translate(localeJson, "user_id_max_100"))
      .test("is-email", translate(localeJson, "user_id_email"), isEmail),
    name: Yup.string()
      .required(translate(localeJson, "head_staff_name_required"))
      .max(100, translate(localeJson, "staff_name_max_required")),
    tel: Yup.string()
      .nullable()
      .test(
        "starts-with-zero",
        translate(localeJson, "phone_num_start"),
        (value) => {
          if (value) {
            value = convertToSingleByte(value);
            return value.charAt(0) === "0";
          }
          return true; // Return true for empty values or use .required() in schema to enforce non-empty strings
        }
      )
      .test("matches-pattern", translate(localeJson, "phone"), (value) => {
        if (value) {
          const singleByteValue = convertToSingleByte(value);
          return /^[0-9]{10,11}$/.test(singleByteValue);
        } else {
          return true;
        }
      }),
    password: Yup.string()
      .required(translate(localeJson, "new_password_required"))
      .min(8, translate(localeJson, "new_password_min_length"))
      .max(15, translate(localeJson, "new_password_max_length"))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]+$/,
        translate(localeJson, "new_password_format")
      ),
  });

  const resetAndCloseForm = (callback) => {
    callback();
    props.refreshList();
  };

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

  // Department dropdown functions
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
    onGetDepartmentDropdownListOnMounting();
  }, [locale, props]);

  return (
    <>
      <Formik
        initialValues={props.currentObj}
        validationSchema={schema}
        enableReinitialize={true}
        onSubmit={(values, { resetForm }) => {
          if (props.registerModalAction == "create") {
            values.tel = convertToSingleByte(values.tel);
            HeadQuarterManagement.create(values, (result) => {
              resetAndCloseForm(resetForm);
            });
          } else if (props.registerModalAction == "edit") {
            values.tel = convertToSingleByte(values.tel);
            HeadQuarterManagement.update(
              props.currentObj.id,
              { id: props.currentObj.id, ...values },
              () => {
                resetAndCloseForm(resetForm);
              }
            );
          }
          close();
          return false;
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
          setFieldValue,
        }) => (
          <div>
            <form onSubmit={handleSubmit}>
              <Dialog
                className={`new-custom-modal`}
                header={
                  props.registerModalAction == "create"
                    ? translate(localeJson, "headquarter_staff_registration")
                    : translate(localeJson, "headquarter_staff_edit")
                }
                visible={open}
                draggable={false}
                blockScroll={true}
                onHide={() => {
                  resetForm();
                  close();
                }}
                footer={
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
                      parentClass={"inline back-button"}
                    />
                    <Button
                      buttonProps={{
                        buttonClass: "w-8rem update-button",
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
                      parentClass={"inline update-button"}
                    />
                  </div>
                }
              >
                <div className={`modal-content staff_modal`}>
                  <div className="">
                    <div className="modal-header">
                      {props.registerModalAction == "create"
                        ? translate(
                            localeJson,
                            "headquarter_staff_registration"
                          )
                        : translate(localeJson, "headquarter_staff_edit")}
                    </div>
                    <div className="modal-field-bottom-space">
                      <InputDropdown
                        inputDropdownProps={{
                          inputId: "employeeDropdown",
                          ariaLabel: translate(localeJson, "name"),
                          filter: true,
                          inputDropdownParentClassName: "w-full",
                          inputDropdownClassName: "w-full",
                          customPanelDropdownClassName: "w-10rem",
                          labelProps: {
                            text: translate(localeJson, "name"),
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
                            const selected = employeeList.find(
                              (emp) => emp.id === e.value
                            );
                            setFieldValue("name", selected.name);
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
                              "aria-label": translate(localeJson, "name"),
                              title: translate(localeJson, "name"),
                            },
                            input: {
                              "aria-label": translate(localeJson, "name"),
                              title: translate(localeJson, "name"),
                            },
                            select: {
                              "aria-label": translate(localeJson, "name"),
                              title: translate(localeJson, "name"),
                            },
                            panel: {
                              "aria-live": "polite",
                              "aria-atomic": "true",
                            },
                          },
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
                            errors.username &&
                            touched.username &&
                            "p-invalid pb-1"
                          }`,
                          labelProps: {
                            text: translate(localeJson, "userId"),
                            inputLabelClassName: "block",
                            spanText: "*",
                            inputLabelSpanClassName: "p-error",
                            labelMainClassName: "modal-label-field-space",
                          },
                          inputClassName: "w-full",
                          id: "username",
                          name: "username",
                          value: values && values.username,
                          onChange: handleChange,
                          onBlur: handleBlur,
                        }}
                      />
                      <ValidationError
                        errorBlock={
                          errors.username && touched.username && errors.username
                        }
                      />
                    </div>
                    <div className="modal-field-bottom-space">
                      <Password
                        passwordProps={{
                          passwordParentClassName: `w-full ${
                            errors.password &&
                            touched.password &&
                            "p-invalid pb-1"
                          }`,
                          labelProps: {
                            text: translate(localeJson, "password"),
                            spanText: "*",
                            passwordLabelSpanClassName: "p-error",
                            passwordLabelClassName: "block",
                            labelMainClassName: "modal-label-field-space",
                          },
                          name: "password",
                          value: values.password,
                          onChange: handleChange,
                          onBlur: handleBlur,
                          passwordClassName: "w-full",
                        }}
                      />
                      <ValidationError
                        errorBlock={
                          errors.password && touched.password && errors.password
                        }
                      />
                    </div>
                    <div className="modal-field-bottom-space">
                      <InputDropdown
                        inputDropdownProps={{
                          inputId: "departmentDropdown",
                          ariaLabel: translate(localeJson, "department"),
                          inputDropdownParentClassName: "w-full",
                          inputDropdownClassName: "w-full",
                          customPanelDropdownClassName: "w-10rem",
                          labelProps: {
                            text: translate(localeJson, "department"),
                            inputDropdownLabelSpanClassName: "block",
                            htmlFor: "departmentDropdown",
                            labelMainClassName: "modal-label-field-space",
                          },
                          value: values && values.dept_id,
                          options: departmentList,
                          optionLabel: "name",
                          optionValue: "id",
                          onChange: (e) => {
                            setFieldValue("dept_id", e.value);
                          },
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
                    <div className="">
                      <Input
                        inputProps={{
                          inputParentClassName: `${
                            errors.tel && touched.tel && "p-invalid pb-1"
                          }`,
                          labelProps: {
                            text: translate(localeJson, "tel"),
                            inputLabelClassName: "block",
                            labelMainClassName: "modal-label-field-space",
                          },
                          inputClassName: "w-full",
                          id: "tel",
                          name: "tel",
                          value: values && values.tel,
                          onChange: handleChange,
                          onBlur: handleBlur,
                        }}
                      />
                      <ValidationError
                        errorBlock={errors.tel && touched.tel && errors.tel}
                      />
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
                </div>
              </Dialog>
            </form>
          </div>
        )}
      </Formik>
    </>
  );
});
HqEditModal.displayName = "HqEditModal";
export default HqEditModal;
