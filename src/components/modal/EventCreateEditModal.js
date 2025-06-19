import React, { useContext, useEffect, useState } from "react"
import { Dialog } from 'primereact/dialog';
import { Formik } from "formik";
import * as Yup from "yup";

import {
    getValueByKeyRecursively as translate,
    getGeneralDateTimeDisplayFormat
} from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import {
    NormalCheckBox,
    DateTime,
    Input,
    TextArea,
    ValidationError,
    Button
} from "@/components";

export default function EventCreateEditModal(props) {
    const { localeJson } = useContext(LayoutContext);
    const { open, close, onRegister, header, buttonText, modalAction, editObject } = props && props;

    const currentDate = new Date();
    let validation = {
        name: Yup.string()
            .required(translate(localeJson, 'questionnaire_name_is_required'))
            .max(100, translate(localeJson, 'questionnaire_name_max')),
        name_en: Yup.string()
            .max(100, translate(localeJson, 'questionnaire_name_en_max')),
        remarks: Yup.string()
            .max(255, translate(localeJson, 'questionnaire_remarks_is_max_required')),
        closing_date: Yup.date().nullable()
            .min(Yup.ref('opening_date'), translate(localeJson, "event_closing_date_min")),
        auto_checkin_flag: Yup.boolean().notRequired(),
    };
    if (props.modalAction == "create") {
        validation = {
            ...validation,
            opening_date: Yup.date().nullable()
                .min(currentDate, translate(localeJson, 'opening_date_not_past')),
        }
    } else {
        if (editObject.opening_date != '' && editObject.opening_date < currentDate) {
            validation = {
                ...validation,
                opening_date: Yup.date().nullable()
            }
        } else {
            validation = {
                ...validation,
                opening_date: Yup.date().nullable()
                    .min(currentDate, translate(localeJson, 'opening_date_not_past')),
            }
        }

    }
    const [disFlag, setDisFlag] = useState();
    const schema = Yup.object().shape(validation);
    const currentDate1 = new Date();
    currentDate1.setMonth(currentDate1.getMonth() + 1);
    const [initialValues, setInitialValues] = useState({
        name: "",
        name_en: "",
        remarks: "",
        opening_date: currentDate.toISOString().split('T')[0],
        closing_date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate()).toISOString().split('T')[0]
    })
    // Generate an array of dates before the current day
    const today = new Date();

    useEffect(() => {
        if (open) {
            if (modalAction == "create") {
                setInitialValues({
                    name: "",
                    name_en: "",
                    remarks: "",
                    opening_date: "",
                    closing_date: "",
                    auto_checkin_flag: 0,
                });
            } else {
                setInitialValues({
                    name: editObject.name ?? "",
                    name_en: editObject.name_en ?? "",
                    remarks: editObject.remarks ?? "",
                    opening_date: editObject.opening_date ?? "",
                    closing_date: editObject.closing_date || "",
                    auto_checkin_flag: editObject.auto_checkin_flag || 0,
                });
                setDisFlag(disFlagFunc())
            }

        }

    }, [open]);

    const invalidDates = Array.from({ length: today.getDate() - 1 }, (_, index) => {
        const day = index + 1;
        return new Date(today.getFullYear(), today.getMonth(), day);
    });

    const disFlagFunc = () => {
        let flg = false;
        if (modalAction != 'create') {
            if (editObject.opening_date != '' && editObject.opening_date != null && editObject.opening_date != undefined) {
                if (editObject.opening_date < currentDate && editObject.closing_date > currentDate) {
                    flg = true
                }
                if (editObject.opening_date < currentDate) {
                    flg = true
                }
                if (editObject.opening_date < currentDate) {
                    if (editObject.closing_date != '' && editObject.closing_date != null && editObject.closing_date != undefined) {
                        if (editObject.closing_date < currentDate) {
                            flg = false
                        }
                    }
                }
            }
        }
        return flg;
    }

    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={initialValues}
                enableReinitialize
                onSubmit={(values, actions) => {
                    if (values.opening_date) {
                        const openingDate = new Date(values.opening_date);
                        const sourceDate = new Date(values.opening_time);
                        if (!isNaN(sourceDate)) {
                            const minutes = sourceDate.getMinutes();
                            const hours = sourceDate.getHours();
                            const openingDateMinute = openingDate.getMinutes();
                            const openingDateHours = openingDate.getHours();
                            if (openingDateMinute == minutes && openingDateHours == hours) {
                                openingDate.setMinutes(minutes);
                                openingDate.setHours(hours);
                            }
                        }
                        values.opening_date_time = values.opening_date ? getGeneralDateTimeDisplayFormat(openingDate) : ""
                    }
                    if (values.closing_date) {
                        const closingDate = new Date(values.closing_date);
                        const sourceDate2 = new Date(values.closing_time);
                        if (!isNaN(sourceDate2)) {
                            const ClosingMinutes = sourceDate2.getMinutes();
                            const ClosingHours = sourceDate2.getHours();
                            const closingDateMinute = closingDate.getMinutes();
                            const closingDateHours = closingDate.getHours();
                            if (
                                closingDateMinute != ClosingMinutes &&
                                closingDateHours != ClosingHours
                            ) {
                                closingDate.setMinutes(ClosingMinutes);
                                closingDate.setHours(ClosingHours);
                            }
                        }
                        values.closing_date_time = values.opening_date ? getGeneralDateTimeDisplayFormat(closingDate) : ""
                    }
                    props.showOverFlow()
                    close();
                    onRegister(values);
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
                    <div>
                        <form onSubmit={handleSubmit}>
                            <Dialog
                                className="new-custom-modal"
                                header={header}
                                visible={open}
                                draggable={false}
                                blockScroll={true}
                                onHide={() => {
                                    close();
                                    resetForm()
                                }}
                                footer={
                                    <div className="text-center">
                                        <Button buttonProps={{
                                            buttonClass: "w-8rem back-button",
                                            text: translate(localeJson, 'cancel'),
                                            type: "reset",
                                            onClick: () => {
                                                close();
                                                resetForm()
                                            },
                                        }} parentClass={"inline back-button"} />
                                        <Button buttonProps={{
                                            buttonClass: "w-8rem update-button",
                                            type: "submit",
                                            text: buttonText,
                                            onClick: () => {
                                                handleSubmit();
                                            },
                                        }} parentClass={"inline update-button"} />
                                    </div>
                                }
                            >
                                <div className={`modal-content`}>
                                    <div className="">
                                        <div className="modal-header">
                                            {header}
                                        </div>
                                        <div className="modal-field-bottom-space">
                                            <Input
                                                inputProps={{
                                                    inputParentClassName: `${errors.name && touched.name && 'p-invalid pb-1'}`,
                                                    labelProps: {
                                                        text: translate(localeJson, 'questionnaires_name_jp'),
                                                        inputLabelClassName: "block",
                                                        spanText: "*",
                                                        inputLabelSpanClassName: "p-error",
                                                        labelMainClassName: "modal-label-field-space"
                                                    },
                                                    inputClassName: "w-full",
                                                    value: values.name,
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                    id:"name",
                                                    name: "name",
                                                }}
                                            />
                                            <ValidationError errorBlock={errors.name && touched.name && errors.name} />
                                        </div>
                                        <div className="modal-field-bottom-space">
                                            <Input
                                                inputProps={{
                                                    inputParentClassName: `${errors.name_en && touched.name_en && 'p-invalid pb-1'}`,
                                                    labelProps: {
                                                        text: translate(localeJson, 'questionnaires_name_en'),
                                                        inputLabelClassName: "block",
                                                        labelMainClassName: "modal-label-field-space"
                                                    },
                                                    inputClassName: "w-full",
                                                    value: values.name_en,
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                    name: "name_en",
                                                    id: "name_en",
                                                }}

                                            />
                                            <ValidationError errorBlock={errors.name_en && touched.name_en && errors.name_en} />
                                        </div>

                                        <div className="modal-field-bottom-space">
                                            <DateTime
                                                callOnActionFlag={true}
                                                callOnCancel={
                                                    () => {
                                                        setFieldValue(
                                                            "opening_date", ""
                                                        );
                                                    }
                                                }
                                                dateTimeProps={{
                                                    dateTimeParentClassName: `${errors.opening_date &&
                                                        touched.opening_date &&
                                                        "p-invalid pb-1 w-full input-align"
                                                        }`,
                                                    labelProps: {
                                                        text: translate(localeJson, 'opening_date_time'),
                                                        inputLabelClassName: "block",
                                                        labelMainClassName: "modal-label-field-space"
                                                    },
                                                    date: values.opening_date,
                                                    dateTimeClass: "w-full",
                                                    name: "opening_date",
                                                    inputId: "settingStartDate",
                                                    disabledDates: invalidDates,
                                                    showTime: "true",
                                                    dateClass: "w-full",
                                                    onChange: (evt) => {
                                                        setFieldValue(
                                                            "opening_date",
                                                            evt.target.value || ""
                                                        );
                                                    },
                                                    onBlur: handleBlur,
                                                    disabled: disFlag
                                                }}
                                            />
                                            <ValidationError
                                                errorBlock={
                                                    errors.opening_date &&
                                                    touched.opening_date &&
                                                    errors.opening_date
                                                }
                                            />
                                        </div>
                                        <div className="modal-field-bottom-space">
                                            <DateTime
                                                callOnActionFlag={true}
                                                callOnCancel={
                                                    () => {
                                                        setFieldValue(
                                                            "closing_date", ""
                                                        );
                                                    }
                                                }
                                                dateTimeProps={{
                                                    dateTimeParentClassName: `${errors.closing_date &&
                                                        touched.closing_date &&
                                                        "p-invalid pb-1 w-full input-align"
                                                        }`,
                                                    labelProps: {
                                                        text: translate(localeJson, 'closing_date_time'),
                                                        inputLabelClassName: "block",
                                                        labelMainClassName: "modal-label-field-space"
                                                    },
                                                    dateTimeClass: "w-full",
                                                    inputId: "settingStartDate",
                                                    name: "closing_date",
                                                    date: values.closing_date,
                                                    disabledDates: invalidDates,
                                                    showTime: "true",
                                                    dateClass: "w-full",
                                                    onChange: (evt) => {
                                                        setFieldValue("closing_date", evt.target.value || "")
                                                    },
                                                    onBlur: handleBlur,

                                                }}
                                            />
                                            <ValidationError
                                                errorBlock={
                                                    errors.closing_date &&
                                                    touched.closing_date &&
                                                    errors.closing_date
                                                }
                                            />
                                        </div>
                                        <div className="modal-field-bottom-space">
                                            <TextArea textAreaProps={{
                                                id: 'remarks',
                                                name: 'remarks',
                                                textAreaParentClassName: `${errors.remarks && touched.remarks && 'p-invalid pb-1'}`,
                                                labelProps: {
                                                    text: translate(localeJson, 'remarks'),
                                                    textAreaLabelClassName: "block",
                                                    labelMainClassName: "modal-label-field-space"
                                                },
                                                textAreaClass: "w-full",
                                                onChange: handleChange,
                                                onBlur: handleBlur,
                                                row: 5,
                                                cols: 40,
                                                value: values.remarks,
                                            }} />
                                            <ValidationError errorBlock={errors.remarks && touched.remarks && errors.remarks} />
                                        </div>
                                        <div className="text-center">
                                            <div className="modal-button-footer-space">
                                                <Button buttonProps={{
                                                    buttonClass: "w-full update-button",
                                                    type: "submit",
                                                    text: buttonText,
                                                    onClick: () => {
                                                        handleSubmit();
                                                    },
                                                }} parentClass={"update-button"} />
                                            </div>
                                            <div>
                                                <Button buttonProps={{
                                                    buttonClass: "w-full back-button",
                                                    text: translate(localeJson, 'cancel'),
                                                    type: "reset",
                                                    onClick: () => {
                                                        props.showOverFlow()
                                                        close();
                                                        resetForm()
                                                    },
                                                }} parentClass={"back-button"} />
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
}