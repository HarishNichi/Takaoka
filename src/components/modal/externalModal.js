import React, { useContext, useState, useRef, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Formik } from "formik";
import * as Yup from "yup";

import { gender_en, gender_jp, prefectures, prefectures_en } from "@/utils/constant";
import { Button, Input, ValidationError, InputDropdown, InputNumber, NormalCheckBox } from "@/components";

import {
  getValueByKeyRecursively as translate,
  getEnglishDateDisplayFormat,
  calculateAge,
  convertToSingleByte,
} from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";

// Assume getAddressFromZipCode is available in helper or service
import { getAddressFromZipCode } from "@/helper";
import { CommonServices } from "@/services/common.services";
import { DepartmentManagementServices } from "@/services/dept_management_services";


export default function External(props) {
  const { localeJson, locale } = useContext(LayoutContext);
  const {
    open,
    close,
    header,
    buttonText,
    setEvacueeValues,
    editObj,
    registerModalAction,
    evacuee,
    setIsRecording
  } = props && props;

  const formikRef = useRef();

  // Address autofill state
  const [postalCodePrefectureId, setPostalCodePrefectureId] = useState(null);
  const [fetchedZipCode, setFetchedZipCode] = useState("");
  const [haveRepAddress, setHaveRepAddress] = useState(false);
  const [repAddress, setRepAddress] = useState({});
  const [isMRecording, setMIsRecording] = useState(false);
  const [zipAddress, setZipAddress] = useState("");
  const [prefCount, setPrefCount] = useState(1);
  const handleRecordingStateChange = (isRecord) => {
    setMIsRecording(isRecord);
    setIsRecording(isRecord);
  };
  const handleRepAddress = (evacuees, setFieldValue) => {
    if (evacuees) {
      if(evacuees?.prefecture_id ){
        setFieldValue("prefecture_id", evacuees?.prefecture_id);
        setPostalCodePrefectureId(evacuees?.prefecture_id)
      }
      const re = /^[0-9-]+$/;
      let val;
      if (evacuees.postalCode === "" || re.test(evacuees.postalCode)) {
        val = evacuees.postalCode?.replace(/-/g, ""); // Remove any existing hyphens
        if (val.length > 3) {
          val = val.slice(0, 3) + val.slice(3);
        }
        setFieldValue("postalCode", val);
        setFetchedZipCode(val.replace(/-/g, ""));
      }
      if (val?.length >= 7) {
        getAddressFromZipCode(val, (response) => {
          if (response) {
            let address = response;
            const selectedPrefecture = prefectures.find(
              (prefecture) => prefecture.value == address.prefcode
            );
            setFieldValue("prefecture_id", selectedPrefecture?.value);
            setPostalCodePrefectureId(selectedPrefecture?.value)
            setFieldValue("address", address.address2 + address.address3 || "");
          } else {
            setFieldValue("prefecture_id", "");
            setFieldValue("address", "");
          }
        });
      }
      setFieldValue("address", evacuees.address);
      // setFieldValue("address2", evacuees.address2);
    }
  };

  // Helper to parse DOB for year/month/date fields
  function parseDOB(dob) {
    if (!dob) return { year: '', month: '', date: '' };
    const d = new Date(dob);
    return {
      year: d.getFullYear() || '',
      month: d.getMonth() + 1 || '',
      date: d.getDate() || '',
    };
  }

  const [departmentList, setDepartmentList] = useState([]);

  useEffect(() => {
    console.log("editObj", editObj);  
    // Fetch department list for dropdown
    const payload = {
      filters: {
        start: 0,
        limit: 100,
        sort_by: "name",
        order_by: "asc",
      },
    };
    DepartmentManagementServices.getDeptList(payload, (response) => {
      let departmentDropdownList = [
        {
          name: "--",
          id: null,
        },
      ];
      if (response?.success && response.data?.list) {
        response.data.list.forEach((obj) => {
          departmentDropdownList.push({
            name: obj.name,
            id: String(obj.id),
          });
        });
      }
      setDepartmentList(departmentDropdownList);
    });
  }, [editObj]);

  // Initial values mapping
  const initialValues =
    registerModalAction === "edit" && editObj
      ? {
          id: editObj.person_id || editObj.id || '',
          name: editObj.name || editObj.person_name || '',
          refugee_name: editObj.refugee_name || editObj.person_refugee_name || '',
          tel: editObj.tel || editObj.person_tel || '',
          postalCode: (editObj.postalCode || editObj.person_postal_code || '').replace(/-/g, ''),
          prefecture_id: editObj.prefecture_id ? Number(editObj.prefecture_id) : '',
          address: editObj.address || editObj.person_address || '',
          dob: {
            year: editObj.dob ? new Date(editObj.dob).getFullYear().toString() : '',
            month: editObj.dob ? (new Date(editObj.dob).getMonth() + 1).toString().padStart(2, '0') : '',
            date: editObj.dob ? new Date(editObj.dob).getDate().toString().padStart(2, '0') : '',
          },
          gender: editObj.gender || editObj.person_gender || '',
          department: editObj.department?.id
            ? String(editObj.department.id)
            : (editObj.department
                ? String(editObj.department)
                : (editObj.person_dept_id ? String(editObj.person_dept_id) : '')),
        }
      : {
          id: '',
          name: '',
          refugee_name: '',
          tel: '',
          postalCode: '',
          prefecture_id: '',
          address: '',
          dob: { year: '', month: '', date: '' },
          gender: '',
          department: '',
        };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required(translate(localeJson, "name_required"))
      .max(100, translate(localeJson, "name_max")),
    refugee_name: Yup.string()
      .required(translate(localeJson, "name_required"))
      .max(100, translate(localeJson, "name_max")),
    tel: Yup.string()
      .required(translate(localeJson, "phone_no_required"))
      .test(
        "starts-with-zero",
        translate(localeJson, "phone_num_start"),
        (value) => {
          if (value) {
            value = convertToSingleByte(value);
            return value.charAt(0) === "0";
          }
          return true;
        }
      )
      .test(
        "matches-pattern",
        translate(localeJson, "phone"),
        (value) => {
          if (value) {
            const singleByteValue = convertToSingleByte(value);
            return /^[0-9]{10,11}$/.test(singleByteValue);
          } else {
            return true;
          }
        }
      ),
    postalCode: Yup.string()
      .required(translate(localeJson, "postal_code_required"))
      .test("postal-code-format", translate(localeJson, "postal_code_length"), function (value) {
        if (!value) return false;
        // Allow both formats: 1234567 and 123-4567
        const cleanValue = value.replace(/-/g, '');
        return /^[0-9]{7}$/.test(cleanValue);
      })
      .test("testPostalCode", translate(localeJson, "zip_code_mis_match"), function (value) {
        const { prefecture_id } = this.parent;
        if (postalCodePrefectureId && prefecture_id) {
          return postalCodePrefectureId === prefecture_id;
        }
        return true;
      }),
    prefecture_id: Yup.string().required(translate(localeJson, "c_required")),
    address: Yup.string()
      .required(translate(localeJson, "c_address_is_required"))
      .max(190, translate(localeJson, "address_max_length")),
    dob: Yup.object().shape({
      year: Yup.string()
        .required(translate(localeJson, "dob_required"))
        .length(4, translate(localeJson, "year_length")),
      month: Yup.string()
        .required(translate(localeJson, "dob_required"))
        .length(2, translate(localeJson, "month_length")),
      date: Yup.string()
        .required(translate(localeJson, "dob_required"))
        .length(2, translate(localeJson, "date_length")),
    }).test(
      "valid-dob",
      translate(localeJson, "min_dob"),
      function (dob) {
        if (!dob || !dob.year || !dob.month || !dob.date) return false;
        const dateObj = new Date(Number(dob.year), Number(dob.month) - 1, Number(dob.date));
        const now = new Date();
        if (dateObj > now) return false;
        const minYear = now.getFullYear() - 120;
        if (dateObj.getFullYear() < minYear) return false;
        return true;
      }
    ),
    gender: Yup.string().required(translate(localeJson, "gender_required")),
    department: Yup.string().required(translate(localeJson, "department_name_required")),
  });

  const { getText } = CommonServices;

  return (
    <>
      <Formik
        innerRef={formikRef}
        validationSchema={validationSchema}
        initialValues={initialValues}
        enableReinitialize
        onSubmit={(values, actions) => {
          console.log("Form submitted with values:", values);
          // Transform values to match what parent component expects
          const transformedValues = {
            ...values,
            // Keep dob fields separate for parent component
            year: values.dob.year,
            month: values.dob.month,
            date: values.dob.date,
            // Remove the dob object since parent expects separate fields
            dob: undefined
          };
          console.log("Transformed values:", transformedValues);
          setEvacueeValues(transformedValues);
          close();
          actions.resetForm({ values: initialValues });
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
        }) => {
          // Debug: Log any validation errors
          if (Object.keys(errors).length > 0) {
            console.log("Form validation errors:", errors);
          }
          return (
          <div id="external">
            <form onSubmit={(e) => {
              console.log("Form onSubmit triggered");
              handleSubmit(e);
            }}>
              <Dialog
                className="custom-modal w-full lg:w-30rem md:w-7 sm:w-9"
                header={header}
                visible={open}
                draggable={false}
                blockScroll={true}
                onHide={() => {
                  close();
                  resetForm();
                }}
                footer={""}
              >
                <div className={`modal-content`}>
                  <div className="mt-3 mb-5 pl-5 pr-5">
                    {/* Name field */}
                    <div className="mt-4">
                      <Input
                        inputProps={{
                          inputParentClassName: `custom_input ${errors.name && touched.name && 'p-invalid pb-1'}`,
                          labelProps: {
                            text: translate(localeJson, 'name_kanji'),
                            inputLabelClassName: "block",
                            spanText: "*",
                            inputLabelSpanClassName: "p-error"
                          },
                          inputClassName: "w-full",
                          name: "name",
                          id: "name",
                          value: values.name,
                          onChange: handleChange,
                          onBlur: handleBlur,
                        }}
                      />
                      <ValidationError errorBlock={errors.name && touched.name && errors.name} />
                    </div>
                    {/* Refugee Name field */}
                    <div className="mt-4">
                      <Input
                        inputProps={{
                          inputParentClassName: `custom_input ${errors.refugee_name && touched.refugee_name && 'p-invalid pb-1'}`,
                          labelProps: {
                            text: translate(localeJson, 'refugee_name'),
                            inputLabelClassName: "block",
                            spanText: "*",
                            inputLabelSpanClassName: "p-error"
                          },
                          inputClassName: "w-full",
                          name: "refugee_name",
                          id: "refugee_name",
                          value: values.refugee_name,
                          onChange: handleChange,
                          onBlur: handleBlur,
                        }}
                      />
                      <ValidationError errorBlock={errors.refugee_name && touched.refugee_name && errors.refugee_name} />
                    </div>
                    {/* Telephone Field */}
                    <div className="mt-4">
                      <Input
                        inputProps={{
                          id: "tel",
                          name: "tel",
                          value: values.tel,
                          placeholder: translate(localeJson, "phone_number"),
                          labelProps: {
                            text: translate(localeJson, "phone_number"),
                            inputLabelClassName: "block",
                            spanText: "*",
                            inputLabelSpanClassName: "p-error"
                          },
                          onChange: handleChange,
                          onBlur: handleBlur,
                          inputClassName: "w-full",
                        }}
                      />
                      <ValidationError errorBlock={errors.tel && touched.tel && errors.tel} />
                    </div>
                    {/* Address Section Start */}
                    <div className="mt-4">
                      {evacuee?.length > 0 && !values.checked && (
                        <div className="w-full mb-1 mt-2">
                          <NormalCheckBox
                            checkBoxProps={{
                              checked: values.addressAsRep,
                              value: translate(localeJson, "rep_address"),
                              labelClass: `pl-2 ${locale == "en" ? "pt-1" : ""
                                }`,
                              onChange: (e) => {
                                setFieldValue("addressAsRep", e.checked)
                                setHaveRepAddress(e.checked);
                                if (e.checked == true) {
                                  handleRepAddress(
                                    repAddress[0],
                                    setFieldValue
                                  );
                                }
                                else {
                                  setFieldValue("postalCode", '');
                                  setFieldValue("address", '');
                                  // setFieldValue("address2", '');
                                  setFieldValue("prefecture_id", '');
                                  setPostalCodePrefectureId("")
                                }
                              },
                            }}
                            parentClass={
                              "flex approve-check align-items-center"
                            }
                          />
                        </div>
                      )}
                      <div className="outer-label pb-1 w-12">
                        <label>{translate(localeJson, "c_address")}</label>
                        <span className="p-error">*</span>
                      </div>
                      <Input
                        inputProps={{
                          inputParentClassName: `w-full custom_input ${errors.postalCode &&
                            touched.postalCode &&
                            "p-invalid"
                            }`,
                          labelProps: {
                            text: "",
                            spanText: "*",
                            inputLabelClassName: "block font-bold",
                            inputLabelSpanClassName: "p-error",
                            labelMainClassName: "pb-1",
                          },
                          inputClassName: "w-full",
                          id: "postalCode",
                          name: "postalCode",
                          inputMode: "numeric",
                          type: "text",
                          value: values.postalCode,
                          disabled:
                            values?.family_register_from == "0" ||
                              isMRecording || values.addressAsRep
                              ? true
                              : false,
                          placeholder: translate(localeJson, "post_letter"),
                          onChange: (evt) => {
                            const re = /^[0-9-]+$/;
                            let val = evt.target.value.replace(/-/g, "");
                            if (evt.target.value === "") {
                              setFieldValue("postalCode", evt.target.value);
                              setFetchedZipCode("")
                              return;
                            }
                            if (re.test(convertToSingleByte(val))) {
                              if (val?.length <= 7) {
                                val = evt.target.value.replace(/-/g, ""); // Remove any existing hyphens
                                setFieldValue("postalCode", val);
                                setFetchedZipCode(val.replace(/-/g, ""))
                              } else {
                                setFieldValue("postalCode", val.slice(0, 7));
                                setFetchedZipCode(val.slice(0, 7))
                                return;
                              }
                            }
                            if (val?.length == 7) {
                              let payload = convertToSingleByte(val);
                              getAddressFromZipCode(payload, (response) => {
                                if (response) {
                                  let address = response;
                                  setZipAddress(response);
                                  const selectedPrefecture =
                                    prefectures.find(
                                      (prefecture) =>
                                        prefecture.value == address.prefcode
                                    );
                                  setFieldValue(
                                    "prefecture_id",
                                    Number(selectedPrefecture?.value)
                                  );
                                  setPostalCodePrefectureId(Number(selectedPrefecture?.value))
                                  setFieldValue(
                                    "address",
                                    address.address2 + address.address3 ||
                                    ""
                                  );
                                  formikRef.current?.validateField("postalCode");
                                } else {
                                  setFieldValue("prefecture_id", "");
                                  setFieldValue("address", "");
                                  setPostalCodePrefectureId('')
                                }
                              })
                            }
                          },
                          onBlur: handleBlur,
                          inputRightIconProps: {
                            display: true,
                            audio: {
                              display: props.registerModalAction == 'create' ? true : (values?.family_register_from == "0" ? false : true),
                            },
                            icon: "",
                            isRecording: isMRecording,
                            onRecordValueChange: (rec) => {
                              const fromData = new FormData();
                              fromData.append("audio_sample", rec);
                              getText(fromData, (res) => {
                                if (res?.data?.content) {
                                  const re = /^[0-9-]+$/;
                                  if (re.test(res?.data?.content)) {
                                    let val = res?.data?.content?.substring(0, 7)
                                    setFieldValue(
                                      "postalCode",
                                      val
                                    );

                                    if (val?.length == 7) {
                                      let payload = convertToSingleByte(val);
                                      getAddressFromZipCode(payload, (response) => {
                                        if (response) {
                                          let address = response;
                                          setZipAddress(response);
                                          const selectedPrefecture =
                                            prefectures.find(
                                              (prefecture) =>
                                                prefecture.value == address.prefcode
                                            );
                                          setFieldValue(
                                            "prefecture_id",
                                            Number(selectedPrefecture?.value)
                                          );
                                          setPostalCodePrefectureId(Number(selectedPrefecture?.value))
                                          setFieldValue(
                                            "address",
                                            address.address2 + address.address3 ||
                                            ""
                                          );
                                          formikRef.current?.validateField("postalCode");
                                        } else {
                                          setFieldValue("prefecture_id", "");
                                          setFieldValue("address", "");
                                          setPostalCodePrefectureId('')
                                        }
                                      })
                                    }
                                  }
                                }
                              });
                            },
                            onRecordingStateChange:
                              handleRecordingStateChange,
                          },
                        }}
                      />
                      <ValidationError
                        errorBlock={
                          errors.postalCode &&
                          touched.postalCode &&
                          errors.postalCode
                        }
                      />
                      <InputDropdown
                        inputDropdownProps={{
                          inputDropdownParentClassName: `custom_input mt-2 ${errors.prefecture_id &&
                            touched.prefecture_id &&
                            "p-invalid"
                            }`,
                          labelProps: {
                            inputDropdownLabelClassName: "block font-bold",
                            spanText: "*",
                            inputDropdownLabelSpanClassName: "p-error",
                            labelMainClassName: "pb-2",
                          },
                          inputDropdownClassName: "w-full w-full",
                          name: "prefecture_id",
                          value: values.prefecture_id,
                          disabled:
                            values?.family_register_from == "0" || values.addressAsRep
                              ? true
                              : false,
                          placeholder: translate(
                            localeJson,
                            "prefecture_places"
                          ),
                          options:
                            locale == "ja" ? prefectures : prefectures_en,
                          optionLabel: "name",
                          onChange: (evt) => {
                            setFieldValue("prefecture_id", Number(evt.target.value));
                            if (values.postalCode) {
                              let payload = convertToSingleByte(values.postalCode);
                              getAddressFromZipCode(
                                payload, (res) => {
                                  
                                  if (res && res.prefcode != evt.target.value) {
                                    setPostalCodePrefectureId(Number(res.prefcode));
                                    // setFieldValue("prefecture_id", res.prefcode);
                                    setPrefCount(prefCount+1)
                                    // setErrors({ ...errors, postal_code: translate(localeJson, "zip_code_mis_match"), });
                                  }
                                  else {
                                    setPostalCodePrefectureId(Number(evt.target.value));
                                  }
                                  // validateForm();
                                })
                            }
                            else {
                              setPostalCodePrefectureId(Number(evt.target.value));
                            }
                          },
                          onBlur: handleBlur,
                          emptyMessage: translate(
                            localeJson,
                            "data_not_found"
                          ),
                        }}
                      />
                      <ValidationError
                        errorBlock={
                          errors.prefecture_id &&
                          touched.prefecture_id &&
                          errors.prefecture_id
                        }
                      />
                      <Input
                        inputProps={{
                          inputParentClassName: `w-full custom_input mt-2 mb-2 ${errors.address && touched.address && "p-invalid"
                            }`,
                          labelProps: {
                            spanText: "*",
                            inputLabelClassName: "block font-bold",
                            inputLabelSpanClassName: "p-error",
                            labelMainClassName: "pb-2",
                          },
                          inputClassName: "w-full",
                          id: "address",
                          name: "address",
                          value: values.address,
                          disabled:
                            values?.family_register_from == "0" ||
                              isMRecording || values.addressAsRep
                              ? true
                              : false,
                          placeholder: translate(localeJson, "city_ward"),
                          onChange: (evt) => {
                            setFieldValue("address", evt.target.value)
                            // setAddressCount(addressCount + 1)
                          },
                          onBlur: handleBlur,
                          inputRightIconProps: {
                            display: true,
                            audio: {
                              display: props.registerModalAction == 'create' ? true : (values?.family_register_from == "0" ? false : true),
                            },
                            icon: "",
                            isRecording: isMRecording,
                            onRecordValueChange: (rec) => {
                              const fromData = new FormData();
                              fromData.append("audio_sample", rec);
                              getText(fromData, (res) => {
                                if (res?.data?.content) {
                                  setFieldValue(
                                    "address",
                                    res?.data?.content
                                  );
                                }
                              });
                            },
                            onRecordingStateChange:
                              handleRecordingStateChange,
                          },
                        }}
                      />
                      <ValidationError
                        errorBlock={
                          errors.address && touched.address && errors.address
                        }
                      />
                      {/* <Input
                        inputProps={{
                          inputParentClassName: `w-full custom_input ${errors.address2 && touched.address2 && "p-invalid"
                            }`,
                          labelProps: {
                            spanText: "*",
                            inputLabelClassName: "block font-bold",
                            inputLabelSpanClassName: "p-error",
                            labelMainClassName: "pb-2",
                          },
                          inputClassName: "w-full",
                          id: "address2",
                          name: "address2",
                          value: values.address2,
                          disabled:
                            values?.family_register_from == "0" ||
                              isMRecording || values.addressAsRep
                              ? true
                              : false,
                          placeholder: translate(
                            localeJson,
                            "house_name_number"
                          ),
                          onChange: (evt) => {
                            setFieldValue("address2", evt.target.value)
                          },
                          onBlur: handleBlur,
                          inputRightIconProps: {
                            display: true,
                            audio: {
                              display: props.registerModalAction == 'create' ? true : (values?.family_register_from == "0" ? false : true),
                            },
                            icon: "",
                            isRecording: isMRecording,
                            onRecordValueChange: (rec) => {
                              const fromData = new FormData();
                              fromData.append("audio_sample", rec);
                              getText(fromData, (res) => {
                                if (res?.data?.content) {
                                  setFieldValue(
                                    "address2",
                                    res?.data?.content
                                  );
                                }
                              });
                            },
                            onRecordingStateChange:
                              handleRecordingStateChange,
                          },
                        }}
                      />
                      <ValidationError
                        errorBlock={
                          errors.address2 &&
                          touched.address2 &&
                          errors.address2
                        }
                      /> */}
                    </div>
                    {/* DOB fields */}
                    <div className="mt-4">
                        <div className="outer-label pb-1 w-12">
                          <label>{translate(localeJson, "c_dob")}</label>
                          <span className="p-error">*</span>
                        </div>
                        <div className="grid">
                          <div className="flex col-12 pb-0 pt-0">
                            <div className="pl-0 col-6 sm:col-6 md:col-6 lg:col-6 xl:col-6  pb-0 pr-0 pl-1">
                              <div className="flex align-items-baseline">
                                <Input
                                  inputProps={{
                                    inputParentClassName: `w-12 pr-2 line-height-18px`,
                                    labelProps: {
                                      text: "",
                                      inputLabelClassName: "block font-bold ",
                                      spanText: "*",
                                      inputLabelSpanClassName: "p-error",
                                      labelMainClassName: "pb-1 pt-1",
                                    },
                                    inputClassName: "w-full",
                                    id: "dob.year",
                                    name: "dob.year",
                                    inputMode: "numeric",
                                    value: values.dob.year,
                                    type: "text",
                                    disabled:
                                      values?.family_register_from == "0"
                                        ? true
                                        : false,
                                    onChange: (evt) => {
                                      const re = /^[0-9-]+$/;
                                      if (evt.target.value == "") {
                                        setFieldValue("dob.year", evt.target.value);
                                        setFieldValue("dob.month", "");
                                        setFieldValue("dob.date", "");
                                        setFieldValue("age", "");
                                        setFieldValue("age_m", "");
                                        return;
                                      }
                                      const enteredYear = parseInt(convertToSingleByte(evt.target.value));
                                      const currentYear =
                                        new Date().getFullYear();
                                      if (evt.target.value.length <= 3 && re.test(convertToSingleByte(evt.target.value))) {
                                        setFieldValue(
                                          "dob.year", evt.target.value
                                        );
                                      }
                                      let minYear = 1899;
                                      if (evt.target.value?.length <= 4 && re.test(convertToSingleByte(evt.target.value))) {
                                        if (
                                          evt.target.value.length == 4 &&
                                          enteredYear > minYear &&
                                          enteredYear <= currentYear
                                        ) {
                                          setFieldValue("dob.year", evt.target.value);
                                        }
                                      }
                                    },
                                    onBlur: handleBlur,
                                  }}
                                />
                                <div className="outer-label">
                                  <label className="">
                                    {translate(localeJson, "c_year")}
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="pl-0 col-3 sm:col-3 md:col-3 lg:col-3 xl:col-3 pb-0 pr-0 pl-1">
                              <div className="flex align-items-baseline">
                                <Input
                                  inputProps={{
                                    inputParentClassName: `w-12 pr-1 line-height-18px`,
                                    labelProps: {
                                      text: "",
                                      inputLabelClassName: "block font-bold",
                                      spanText: "*",
                                      inputLabelSpanClassName: "p-error",
                                      labelMainClassName: "pb-1 pt-1",
                                    },
                                    inputClassName: "w-full md:p-2 p-1",
                                    id: "dob.month",
                                    name: "dob.month",
                                    inputMode: "numeric",
                                    value: values.dob.month,
                                    disabled:
                                      values?.family_register_from == "0"
                                        ? true
                                        : false,
                                    onChange: (evt) => {
                                      const re = /^[0-9-]+$/;
                                      if (evt.target.value == "") {
                                        setFieldValue(
                                          "dob.month",
                                          evt.target.value
                                        );
                                        setFieldValue("dob.date", "");
                                        setFieldValue("age", "");
                                        setFieldValue("age_m", "");
                                        return;
                                      }
                                      let Month = (
                                        convertToSingleByte(evt.target.value)
                                      );
                                      const enteredMonth = parseInt(Month)
                                      const currentMonth =
                                        new Date().getMonth() + 1; // Month is zero-based, so add 1
                                      const currentYear =
                                        new Date().getFullYear();
                                      if (
                                        re.test(Month) &&
                                        evt.target.value?.length <= 2 &&
                                        enteredMonth > 0 &&
                                        enteredMonth <= 12 &&
                                        convertToSingleByte(values.dob.year)
                                      ) {
                                        if (
                                          enteredMonth > currentMonth &&
                                          convertToSingleByte(values.dob.year) == currentYear
                                        ) {
                                          return;
                                        }
                                        setFieldValue(
                                          "dob.month",
                                          evt.target.value
                                        );
                                      }
                                    },
                                    onBlur: handleBlur,
                                  }}
                                />
                                <div className="outer-label">
                                  <label className="font-bold">
                                    {translate(localeJson, "c_month")}
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="pl-0 col-3 sm:col-3 md:col-3 lg:col-3 xl:col-3 pb-0 pr-0 pl-1">
                              <div className="flex align-items-baseline">
                                <Input
                                  inputProps={{
                                    inputParentClassName: `w-12 pr-1 line-height-18px`,
                                    labelProps: {
                                      text: "",
                                      inputLabelClassName: "block font-bold",
                                      spanText: "*",
                                      inputLabelSpanClassName: "p-error",
                                      labelMainClassName: "pb-1 pt-1",
                                    },
                                    inputClassName: "w-full md:p-2 p-1",
                                    id: "dob.date",
                                    name: "dob.date",
                                    inputMode: "numeric",
                                    value: values.dob.date,
                                    disabled:
                                      values?.family_register_from == "0"
                                        ? true
                                        : false,
                                    onChange: (evt) => {
                                      console.log("evt", evt);
                                      const { value, name } = evt.target;
                                      const month = convertToSingleByte(values.dob.month);
                                      const year = convertToSingleByte(values.dob.year);
                                      const re = /^[0-9-]+$/;
                                      let maxDays = 31; // Default to 31 days
                                      if (value == "") {
                                        setFieldValue("dob.date", "");
                                        return
                                      }
                                      const currentYear =
                                        new Date().getFullYear();
                                      const currentMonth =
                                        new Date().getMonth() + 1;
                                      const currentDay = new Date().getDate();
                                      const enteredDay = parseInt(
                                        convertToSingleByte(evt.target.value)
                                      );
                                      if (
                                        name === "dob.date" &&
                                        value?.length <= 2 &&
                                        parseInt(convertToSingleByte(value)) > 0 &&
                                        year &&
                                        month &&
                                        re.test(convertToSingleByte(evt.target.value))
                                      ) {
                                        if (
                                          year == currentYear &&
                                          month == currentMonth &&
                                          enteredDay > currentDay
                                        ) {
                                          return;
                                        }
                                        if (month == 2) {
                                          // February
                                          maxDays =
                                            year % 4 === 0 &&
                                              (year % 100 !== 0 ||
                                                year % 400 === 0)
                                              ? 29
                                              : 28;
                                        } else if (
                                          [4, 6, 9, 11].includes(month)
                                        ) {
                                          // Months with 30 days
                                          maxDays = 30;
                                        }
                                        // Update the state only if the entered day is valid
                                        if (parseInt(convertToSingleByte(value)) <= maxDays) {
                                          setFieldValue(
                                            "dob.date",
                                            evt.target.value
                                          );
                                        }
                                      }
                                    },
                                    onBlur: handleBlur,
                                  }}
                                />
                                <div className="outer-label">
                                  <label className="font-bold pb-2 ">
                                    {translate(localeJson, "c_date")}
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 p-0  flex">
                          <ValidationError
                            errorBlock={
                              errors.dob?.year &&
                              touched.dob?.year &&
                              errors.dob?.year
                            }
                            parentClass="pr-1"
                          />
                          <ValidationError
                            errorBlock={
                              errors.dob?.month &&
                              touched.dob?.month &&
                              errors.dob?.month
                            }
                            parentClass="pr-1"
                          />
                          <ValidationError
                            errorBlock={
                              errors.dob?.date &&
                              touched.dob?.date &&
                              errors.dob?.date
                            }
                            parentClass="pr-1"
                          />
                        </div>
                      </div>
 
                    {/* Gender Field */}
                    <div className="mt-4">
                      <div className="outer-label pb-1 w-12">
                        <label>{translate(localeJson, "gender")}</label>
                      </div>
                      <InputDropdown
                        inputDropdownProps={{
                          name: "gender",
                          value: values.gender,
                          options:
                            locale == "ja" ? gender_jp : gender_en,
                          optionLabel: "name",
                          placeholder: translate(localeJson, "gender"),
                          onChange: (e) => setFieldValue("gender", e.value),
                          onBlur: handleBlur,
                          emptyMessage: translate(localeJson, "data_not_found"),
                          inputDropdownClassName: "w-full",
                        }}
                      />
                    </div>
                    {/* Department Dropdown */}
                    <div className="mt-4">
                      <div className="outer-label pb-1 w-12">
                        <label>{translate(localeJson, "department")}</label>
                      </div>
                      <InputDropdown
                        inputDropdownProps={{
                          name: "department",
                          value: values.department, // this is the id
                          options: departmentList,
                          optionLabel: "name",
                          optionValue: "id", // <--- match by id
                          placeholder: translate(localeJson, "department"),
                          onChange: (e) => setFieldValue("department", e.value),
                          onBlur: handleBlur,
                          emptyMessage: translate(localeJson, "data_not_found"),
                          inputDropdownClassName: "w-full",
                        }}
                      />
                    </div>
                    
                    {/* Buttons inside form content */}
                    <div className="text-center flex flex-column gap-2 mt-4 mb-4">
                      <Button
                        buttonProps={{
                          buttonClass: "w-full update-button",
                          type: "submit",
                          text: buttonText,
                          onClick: (e) => {
                            console.log("Submit button clicked");
                            console.log("Current form values:", values);
                            console.log("Current form errors:", errors);
                            handleSubmit(e);
                          },
                        }}
                        parentClass={"block update-button"}
                      />
                      <Button
                        buttonProps={{
                          buttonClass: "w-full back-button",
                          text: translate(localeJson, "cancel"),
                          onClick: () => {
                            resetForm();
                            close();
                          },
                        }}
                        parentClass={"block back-button"}
                      />
                    </div>
                  </div>
                </div>
                </Dialog>
            </form>
          </div>
        );
        }}
      </Formik>
    </>
  );
}