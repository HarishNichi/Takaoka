import React, { useContext } from "react";
import { Dialog } from "primereact/dialog";
import { Formik } from "formik";
import * as Yup from "yup";

import { gender_en, gender_jp } from "@/utils/constant";
import { Button, Input, ValidationError, InputDropdown, InputNumber } from "@/components";

import {
  getValueByKeyRecursively as translate,
  getEnglishDateDisplayFormat,
  calculateAge,
  convertToSingleByte,
} from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";

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
  } = props && props;

  // eslint-disable-next-line no-irregular-whitespace
  const katakanaRegex = /^[\u30A1-\u30F6ー　\u0020]*$/;
  const minDOBDate = new Date();
  const tempDate = new Date(editObj.dob ?? "");
  minDOBDate.setFullYear(minDOBDate.getFullYear() - 125); // Set the maximum allowed birth date to 125 years ago
  const initialValues =
    registerModalAction == "edit"
      ? {
        ...editObj,
        year: tempDate.getFullYear(),
        month: tempDate.getMonth() + 1,
        date: tempDate.getDate()
      }
      : {
        id: evacuee && evacuee.length > 0 ? evacuee.length + 1 : 1,
        name: "",
        name_kanji: "",
        dob: "",
        year: "",
        month: "",
        date: "",
        gender: null,
      };
  const schema = Yup.object().shape({
    name: Yup.string().nullable()
      .max(100, translate(localeJson, "name_max")),
    name_kanji: Yup.string()
      .required(translate(localeJson, "name_required_changed"))
      .max(100, translate(localeJson, "external_popup_name_kanji")),
    year: Yup.string().required(
      translate(localeJson, "dob_required")
    ).min(4,
      translate(localeJson, "min_dob")
    ),
    month: Yup.string().required(
      translate(localeJson, "dob_required")
    ),
    date: Yup.string().required(
      translate(localeJson, "dob_required")
    ),
    // Add other fields and validations as needed
    age: Yup.number().required(translate(localeJson, "age_required")),
    gender: Yup.string().required(translate(localeJson, "gender_required"))
  });

  return (
    <>
      <Formik
        validationSchema={schema}
        initialValues={initialValues}
        enableReinitialize
        onSubmit={(values, actions) => {
          values.year = convertToSingleByte(values.year);
          values.month = convertToSingleByte(values.month);
          values.date = convertToSingleByte(values.date);
          values.dob = new Date(convertToSingleByte(values.year), convertToSingleByte(values.month) - 1, convertToSingleByte(values.date));
          values.dob = getEnglishDateDisplayFormat(values.dob);
          setEvacueeValues(values);
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
        }) => (
          <div id="external">
            <form onSubmit={handleSubmit}>
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
                    <div className="">
                      <Input
                        inputProps={{
                          inputParentClassName: `custom_input ${errors.name_kanji && touched.name_kanji && 'p-invalid pb-1'}`,
                          labelProps: {
                            text: translate(localeJson, 'name_kanji'),
                            inputLabelClassName: "block",
                            spanText: "*",
                            inputLabelSpanClassName: "p-error"
                          },
                          inputClassName: "w-full",
                          name: "name_kanji",
                          id: "name_kanji",
                          value: values.name_kanji,
                          onChange: handleChange,
                          onBlur: handleBlur,
                        }}
                      />
                      <ValidationError
                        errorBlock={errors.name_kanji && touched.name_kanji && errors.name_kanji}
                      />
                    </div>
                    <div className="mt-3">
                      <Input
                        inputProps={{
                          inputParentClassName: `custom_input ${errors.name && touched.name && 'p-invalid pb-1'}`,
                          labelProps: {
                            text: translate(localeJson, 'c_refugee_name'),
                            inputLabelClassName: "block",
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
                      <ValidationError
                        errorBlock={errors.name && touched.name && errors.name}
                      />
                    </div>
                    <div className="mt-4 ">
                      <div className="grid">
                        <div className="col-12 py-0 px-2">
                          <div className="custom-label pb-1 w-12">
                            <label>{translate(localeJson, "c_dob")}</label>
                            <span className="p-error">*</span>
                          </div>
                        </div>
                        <div className="flex col-12 pb-0 py-0 px-2 ">
                          <div className="pl-0 col-6 pt-0 sm:col-6 md:col-6 lg:col-6 xl:col-6">
                            <div className="flex align-items-baseline">
                              <Input
                                inputProps={{
                                  inputParentClassName: `w-12 pr-2 line-height-18px`,
                                  labelProps: {
                                    text: "",
                                    inputLabelClassName: "block font-bold",
                                    spanText: "*",
                                    inputLabelSpanClassName: "p-error",
                                    labelMainClassName: "pb-1 pt-1",
                                  },
                                  inputClassName: "w-full",
                                  id: "year",
                                  name: "year",
                                  value: values.year,
                                  inputMode: "numeric",
                                  type: "text",
                                  onChange: (evt) => {
                                    const re = /^[0-9-]+$/;
                                    if (evt.target.value == "") {
                                      setFieldValue("year", evt.target.value);
                                      setFieldValue("month", "");
                                      setFieldValue("date", "");
                                      setFieldValue("age", "");
                                      return;
                                    }
                                    const enteredYear = parseInt(convertToSingleByte(evt.target.value));
                                    const currentYear =
                                      new Date().getFullYear();
                                    if (evt.target.value.length <= 3 && re.test(convertToSingleByte(evt.target.value))) {
                                      setFieldValue(
                                        "year", evt.target.value
                                      );
                                    }
                                    let minYear = 1899;
                                    if (evt.target.value?.length <= 4 && re.test(convertToSingleByte(evt.target.value))) {
                                      if (
                                        evt.target.value.length == 4 &&
                                        enteredYear > minYear &&
                                        enteredYear <= currentYear
                                      ) {
                                        setFieldValue("year", evt.target.value);
                                      }
                                    }
                                  },
                                  onBlur: (evt) => {
                                    handleBlur(evt)
                                    setFieldValue("age", calculateAge(convertToSingleByte(values.year), convertToSingleByte(values.month), convertToSingleByte(values.date)));
                                  },
                                }}
                              />
                              <div className="outer-label">
                                <label className="">
                                  {translate(localeJson, "c_year")}
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="pl-0 pt-0 col-3 sm:col-3 md:col-3 lg:col-3 xl:col-3 pb-0 pr-0 pl-1">
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
                                  inputClassName: "w-full",
                                  id: "month",
                                  name: "month",
                                  value: values.month,
                                  onChange: (evt) => {
                                    const re = /^[0-9-]+$/;
                                    if (evt.target.value == "") {
                                      setFieldValue(
                                        "month",
                                        evt.target.value
                                      );
                                      setFieldValue("date", "");
                                      setFieldValue("age", "");
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
                                      enteredMonth <= 12
                                    ) {
                                      if (
                                        enteredMonth > currentMonth &&
                                        convertToSingleByte(values.year) == currentYear
                                      ) {
                                        return;
                                      }
                                      setFieldValue(
                                        "month",
                                        evt.target.value
                                      );
                                    }
                                  },
                                  onBlur: (evt) => {
                                    handleBlur(evt)
                                    setFieldValue("age", calculateAge(convertToSingleByte(values.year), convertToSingleByte(values.month), convertToSingleByte(values.date)));
                                  },
                                }}
                              />
                              <div className="outer-label">
                                <label className="font-bold">
                                  {translate(localeJson, "c_month")}
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="pl-0 pt-0 col-3 sm:col-3 md:col-3 lg:col-3 xl:col-3 pb-0 pr-0 pl-1">
                            <div className="flex align-items-baseline">
                              <Input
                                inputProps={{
                                  inputParentClassName: `w-12 pr-2 line-height-18px`,
                                  labelProps: {
                                    text: "",
                                    inputLabelClassName: "block font-bold",
                                    spanText: "*",
                                    inputLabelSpanClassName: "p-error",
                                    labelMainClassName: "pb-1 pt-1",
                                  },
                                  inputClassName: "w-full",
                                  id: "date",
                                  name: "date",
                                  value: values.date,
                                  inputMode: "numeric",
                                  onChange: (evt) => {
                                    const { value, name } = evt.target;
                                    const month = convertToSingleByte(values.month);
                                    const year = convertToSingleByte(values.year);
                                    const re = /^[0-9-]+$/;
                                    let maxDays = 31; // Default to 31 days
                                    if (value == "") {
                                      setFieldValue("dob.date", "");
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
                                      name === "date" &&
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
                                          "date",
                                          evt.target.value
                                        );
                                      }
                                    }
                                  },
                                  onBlur: (evt) => {
                                    handleBlur(evt);
                                    setFieldValue("age", calculateAge(convertToSingleByte(values.year), convertToSingleByte(values.month), convertToSingleByte(values.date)));
                                  },
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
                    </div>
                    <div>
                      <ValidationError
                        errorBlock={
                          (errors.year && touched.year && errors.year)
                          || (errors.month && touched.month && errors.month)
                          || (errors.date && touched.date && errors.date)
                        }
                      />
                    </div>
                    <div className="mt-3 ">
                      <InputNumber inputNumberProps={{
                        inputNumberParentClassName: `custom_input ${errors.age && touched.age && "p-invalid pb-1"
                          }`,
                        labelProps: {
                          text: translate(localeJson, "c_age"),
                          inputNumberLabelClassName: "block",
                          spanText: "*",
                          inputNumberLabelSpanClassName: "p-error"
                        },
                        inputNumberClassName: "w-full ",
                        id: "age",
                        name: "age",
                        value: values.age,
                        disabled: true,
                        onChange: (evt) => {
                          setFieldValue("age", evt.value);
                        },
                        onValueChange: (evt) => {
                          setFieldValue("age", evt.value);
                        },
                        onBlur: handleBlur,
                      }} />
                      <ValidationError
                        errorBlock={errors.age && touched.age && errors.age}
                      />
                    </div>
                    <div className="mt-3">
                      <InputDropdown inputDropdownProps={{
                        inputDropdownParenClassName: `custom_input ${errors.gender && touched.gender && "p-invalid pb-1"
                          }`,
                        labelProps: {
                          text: translate(localeJson, 'gender_external_modal'),
                          inputDropdownLabelClassName: "block",
                          inputDropdownLabelSpanClassName: "p-error",
                          spanText: "*"
                        },
                        inputDropdownClassName: "w-full ",
                        name: "gender",
                        value: values.gender,
                        options: locale == "ja" ? gender_jp : gender_en,
                        optionLabel: "name",
                        onChange: handleChange,
                        onBlur: handleBlur,
                        emptyMessage: translate(localeJson, "data_not_found"),
                      }}
                      />
                      <ValidationError
                        errorBlock={
                          errors.gender && touched.gender && errors.gender
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="text-center flex flex-column pr-5 pl-5">
                  <Button
                    buttonProps={{
                      buttonClass: "w-full update-button",
                      type: "submit",
                      text: buttonText,
                      onClick: () => {
                        handleSubmit();
                      },
                    }}
                    parentClass={"block update-button"}
                  />

                  <Button
                    buttonProps={{
                      buttonClass: "w-full back-button mt-2",
                      text: translate(localeJson, "cancel"),
                      type: "reset",
                      onClick: () => {
                        close();
                        resetForm();
                      },
                    }}
                    parentClass={"block back-button"}
                  />
                </div>
              </Dialog>
            </form>
          </div>
        )}
      </Formik>
    </>
  );
}