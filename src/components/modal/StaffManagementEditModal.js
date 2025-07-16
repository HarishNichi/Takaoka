/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Formik } from "formik";
import * as Yup from "yup";
import _, { set } from "lodash";
import { TabView, TabPanel } from "primereact/tabview";
import { DepartmentManagementServices } from "@/services/dept_management_services";
import {
  Button,
  NormalTable,
  Input,
  Password,
  ValidationError,
  InputDropdown,
} from "@/components";
import {
  convertToSingleByte,
  getValueByKeyRecursively as translate,
} from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { CommonServices, StaffManagementService,EmployeeServices } from "@/services";
import { useAppSelector } from "@/redux/hooks";

const StaffManagementEditModal = React.memo(function StaffManagementEditModal(props) {
  const { localeJson, locale } = useContext(LayoutContext);
  const { open, close, currentEditObj } = props && props;
  // Getting storage data with help of reducers
  const layoutReducer = useAppSelector((state) => state.layoutReducer);

  const columnsData = [
    {
      selectionMode: "single",
      textAlign: "center",
      alignHeader: "center",
      minWidth: "4rem",
      maxWidth: "4rem",
      className: "action_class",
    },
    {
      field: "name",
      header: translate(localeJson, "department_list_column_header_name"),
      headerClassName: "custom-header",
      minWidth: "12rem",
      maxWidth: "12rem",
    },
  ];
  const columnsData2 = [
    {
      selectionMode: "multiple",
      textAlign: "center",
      alignHeader: "center",
      minWidth: "4rem",
      maxWidth: "4rem",
      className: "action_class",
    },
    {
      field: "name",
      header: translate(localeJson, "place_name"),
      headerClassName: "custom-header",
      minWidth: "12rem",
      maxWidth: "12rem",
    },
  ];
  const [tableLoading, setTableLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [employeeList, setEmployeeList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [columns, setColumns] = useState([]);
  const [columns1, setColumns1] = useState([]);
  const [eventList, setEventList] = useState([]);
  const [placeList, setPlaceList] = useState([]);
  const [getPayload, setPayload] = useState({
    filters: {
      start: 0,
      limit: 10,
      sort_by: "id",
      order_by: "asc",
    },
    search: "",
  });
  const [rowClick, setRowClick] = useState(true);
  const [selectedEvents, setSelectedEvents] = useState(null);
  const [selectedPlaces, setSelectedPlaces] = useState(null);
  const [filterLoading,setFilterLoading] = useState(false);
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
      .required(translate(localeJson, "staff_name_required")),
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

  /** Services */
  const { getStaffEventListWithActiveStatus } = CommonServices;
  const { getActivePlaceList } = StaffManagementService;
  const { getEmployeeList } = EmployeeServices;

  useEffect(() => {
    setSelectedEvents(currentEditObj?.event_id);
    setSelectedPlaces(currentEditObj?.place_id);
  }, [locale, props]);

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
      getEmployeeList(payload,onGetEmployeeDropdownList);
      fetchData();
      onGetDepartmentDropdownListOnMounting();
  }, [locale, props]);


  useEffect(() => {
    if (props.currentEditObj?.event_id) {
      let eventIds = props.currentEditObj?.event_id;
      let selectedEventValues = eventIds?.map((id) => findEventById(id));
      setSelectedEvents(selectedEventValues);
    }
    if (props.currentEditObj?.place_id) {
      let placeIds = props.currentEditObj?.place_id;
      let selectedPlaceValues = placeIds?.map((id) => findPlaceById(id));
      setSelectedPlaces(selectedPlaceValues);
    } else {
      setSelectedEvents([]);
      setSelectedPlaces([]);
    }
  }, [eventList, placeList, props]);
  const resetAndCloseForm = (callback) => {
    close();
    callback();
    props.refreshList();
  };

   const fetchData = () => {
    setTableLoading(true);

    const payload = {
        filters: {
            start: 0,
            limit: 10,
        },
    };

    // ✅ Replace with original getDeptList event fetch
    DepartmentManagementServices.getDeptList(payload, (response) => {
        if (response?.success && response.data?.list?.length) {
            const data = response.data.list;
            const sortedData = data.sort((a, b) => b.is_active - a.is_active);

            const preparedList = sortedData.map((obj, i) => ({
                index: payload.filters.start + i + 1,
                id: obj.id,
                name: locale === "en" && obj.name_en ? obj.name_en : obj.name,
                code: obj.code,
                is_active: obj.is_active,
            }));

            setEventList(preparedList);
            setColumns([...columnsData]);
            setTotalCount(response.data.total);
        } else {
            setEventList([]);
            setTotalCount(0);
        }

        setTableLoading(false);
    });

    // ✅ Keep place list fetch unchanged
    getActivePlaceList((response) => {
        if (response?.success && !_.isEmpty(response.data)) {
            const data = response.data.model.list;
            const sortedData = data.sort((a, b) => b.active_flg - a.active_flg);

            const preparedList = sortedData.map((obj, i) => ({
                index: getPayload.filters.start + i,
                id: obj.id,
                name: locale === "en" && obj.name_en ? obj.name_en : obj.name,
                is_active: obj.is_active,
                active_flg: obj.active_flg,
            }));

            setPlaceList(preparedList);
            setColumns1([...columnsData2]);
        } else {
            setPlaceList([]);
        }

        setTableLoading(false);
    });
};


  const findPlaceById = (id) => {
    return placeList.find((place) => place.id === id);
  };

  const findEventById = (id) => {
    return eventList.find((place) => place.id === id);
  };

  const rowClass = (data) => {
    return {
      "highlight-row-event":
        !data.is_active || data.is_active === false || data.is_active == false,
    };
  };

  const rowClassForClass = (data) => {
    console.log(data);
    return {
      "highlight-row-event": data.active_flg === 0 || data.active_flg == 0,
    };
  };

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
    setEmployeeList(employeeDropdownList); // You need to define `employeeList` state
  }
};

  // Fake API call function — replace with your real API function
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
    await getEmployeeList(payload, (response) => {
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
        const combined = [...employeeList.filter(e => e.id !== null), ...newEmployees];

        // Remove duplicates by 'id'
        const uniqueEmployees = _.uniqBy(combined, 'id');

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
            id: Number(obj.id), // Ensure id is a number
          };
          departmentDropdownList.push(departmentItem);
        });
        setDepartmentList(departmentDropdownList);
      };


  return (
    <>
      <Formik
        initialValues={props.currentEditObj}
        validationSchema={schema}
        enableReinitialize={true}
        onSubmit={(values, { resetForm }) => {
          values.event_id =
            selectedEvents.length > 0
              ? selectedEvents
                  .filter((item) => item && item.id)
                  .map((item) => item.id)
              : [];
          values.place_id =
            selectedPlaces.length > 0
              ? selectedPlaces
                  .filter((item) => item && item.id)
                  .map((item) => item.id)
              : [];
          values.tel = convertToSingleByte(values.tel);
          props.register(values);
          resetAndCloseForm(resetForm);
          setSelectedEvents([]);
          setSelectedPlaces([]);
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
          setFieldValue
        }) => (
          <div>
            <form onSubmit={handleSubmit}>
              <Dialog
                className={`new-custom-modal h-full`}
                header={
                  props.registerModalAction == "create"
                    ? translate(localeJson, "add_staff_management")
                    : translate(localeJson, "edit_staff_management")
                }
                visible={open}
                draggable={false}
                blockScroll={true}
                onHide={() => {
                  resetForm();
                  close();
                  setSelectedEvents([]);
                  setSelectedPlaces([]);
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
                          setSelectedEvents([]);
                          setSelectedPlaces([]);
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
                  <div className="modal-header">
                    {props.registerModalAction == "create"
                      ? translate(localeJson, "add_staff_management")
                      : translate(localeJson, "edit_staff_management")}
                  </div>
                  <TabView scrollable>
                    <TabPanel
                      header={translate(localeJson, "staff_information")}
                    >
                      <div className="">
                        <div className="modal-field-bottom-space">
                          {/* <Input
                            inputProps={{
                              inputParentClassName: `${
                                errors.name && touched.name && "p-invalid pb-1"
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
                              value: values && values.name,
                              onChange: handleChange,
                              onBlur: handleBlur,
                            }}
                          /> */}
                           <InputDropdown
                                              inputDropdownProps={{
                                                inputId: "employeeDropdown",
                                                ariaLabel: translate(localeJson, "name"),
                                                filter: true,
                                                // 🔗 Used with label htmlFor
                                                inputDropdownParentClassName:
                                                  "w-full",
                                                inputDropdownClassName:
                                                  "w-full",
                                                customPanelDropdownClassName: "w-10rem",
                          
                                                // ✅ Main fallback aria-label
                          
                                                // ✅ Proper label
                                                labelProps: {
                                                  text: translate(localeJson, "name"),
                                                  inputDropdownLabelClassName: "block",
                                                  htmlFor: "evacuationDropdown",
                                                },
                          
                                                // ✅ Value and options
                                                value: values && values.employee_code_id,
                                                options: employeeList,
                                                optionLabel: "name",
                                                optionValue: "id",
                                               onChange: (e)=>{
                                               const selected = employeeList.find(emp => emp.id === e.value);
                                                setFieldValue("name", selected.name);
                                                setFieldValue("employee_code_id", e.value);
                                               },
                                               onBlur: handleBlur,
                                               onFilter:onFilterSearch,
                                               loading: filterLoading,
                          
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
                                                      "name"
                                                    ),
                                                    title: translate(localeJson, "name"),
                                                  },
                                                  input: {
                                                    "aria-label": translate(
                                                      localeJson,
                                                      "name"
                                                    ),
                                                    title: translate(localeJson, "name"),
                                                  },
                                                  select: {
                                                    "aria-label": translate(
                                                      localeJson,
                                                      "name"
                                                    ),
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
                            errorBlock={
                              errors.name && touched.name && errors.name
                            }
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
                              errors.username &&
                              touched.username &&
                              errors.username
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
                              style: { width: "100%" },
                              passwordClass: "w-full",
                            }}
                          />
                          <ValidationError
                            errorBlock={
                              errors.password &&
                              touched.password &&
                              errors.password
                            }
                          />
                        </div>
                        <div className="modal-field-bottom-space">
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
                        <div className="modal-field-bottom-space">
                           {/* Department dropdown removed as per request */}
                        </div>
                      </div>
                    </TabPanel>
                    {layoutReducer?.layout?.config
                      ?.ADMIN_STAFF_MANAGAMENT_EVENT_MAP && (
                      <TabPanel
                        header={translate(localeJson, "department_information")}
                      >
                        <div className="">
                          <div className="">
                            <NormalTable
                              className={"custom-table-cell"}
                              selection={selectedEvents}
                              onSelectionChange={(e) =>
                                setSelectedEvents(e.value)
                              }
                              selectionMode={rowClick ? null : "checkbox"}
                              tableStyle={{ maxWidth: "100%" }}
                              showGridlines={"true"}
                              value={eventList}
                              columns={columnsData}
                              filterDisplay="menu"
                              rowClassName={rowClass}
                            />
                          </div>
                        </div>
                      </TabPanel>
                    )}
                    <TabPanel
                      header={translate(localeJson, "place_information")}
                    >
                      <div className="">
                        <div className="">
                          <NormalTable
                            className={"custom-table-cell"}
                            selection={selectedPlaces}
                            onSelectionChange={(e) =>
                              setSelectedPlaces(e.value)
                            }
                            selectionMode={rowClick ? null : "checkbox"}
                            tableStyle={{ maxWidth: "100%" }}
                            showGridlines={"true"}
                            value={placeList}
                            columns={columnsData2}
                            filterDisplay="menu"
                            rowClassName={rowClassForClass}
                          />
                        </div>
                      </div>
                    </TabPanel>
                  </TabView>
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
                            setSelectedEvents([]);
                            setSelectedPlaces([]);
                          },
                        }}
                        parentClass={"back-button"}
                      />
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
StaffManagementEditModal.displayName = 'StaffManagementEditModal';
export default StaffManagementEditModal;
