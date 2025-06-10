import React, { useContext } from "react"
import { Dialog } from 'primereact/dialog';
import { Formik } from "formik";
import * as Yup from "yup";

import { Button, Calendar, Input, InputDropdown, ValidationError, InputNumber } from "@/components"; 
import {
    convertToSingleByte,
    getValueByKeyRecursively as translate
} from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";

export default function StaffStockpileEdit(props) {
    const { localeJson } = useContext(LayoutContext);
    const { open, close, header, buttonText, onUpdate } = props && props;

    const schema = Yup.object().shape({
        category: Yup.string()
            .required(translate(localeJson, 'type_required'))
            .max(200, translate(localeJson, 'stockpile_page_create_update_category_max')),
        product_name: Yup.string()
            .required(translate(localeJson, 'stockpile_name_required'))
            .max(200, translate(localeJson, 'stockpile_page_create_update_product_name_max')),
        after_count: Yup.string()
            .min(0, translate(localeJson, 'number_field'))
            .max(5, translate(localeJson, 'quantity_max'))
            .required(translate(localeJson, 'quantity_is_required')),
        Inspection_date_time: Yup.string()
            .required(translate(localeJson, 'inventory_date_is_required')),
        expiry_date: Yup.string()
            .required(translate(localeJson, 'expiry_date_is_required'))
            .test('is-valid-date', translate(localeJson, 'expiry_date_must_be_equal_or_greater_than_today'), function (value) {
                if (!value) return true; // Allow empty values  
                const inputDate = new Date(value);
                const today = new Date();
                return inputDate >= today;
            }),
    });

    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={props.editObject}
                enableReinitialize={true}
                onSubmit={(values, actions) => {
                    values.after_count = convertToSingleByte(values.after_count)
                    onUpdate({ ...props.editObject, ...values }, props.editObject.summary_id)
                    actions.resetForm()
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
                                className="new-custom-modal"
                                header={header}
                                visible={open}
                                draggable={false}
                                blockScroll={true}
                                onHide={() => {
                                    resetForm();
                                    close();

                                }}
                                footer={
                                    <div className="text-center">
                                        <Button buttonProps={{
                                            buttonClass: "w-8rem back-button",
                                            text: translate(localeJson, 'cancel'),
                                            onClick: () => {
                                                resetForm();
                                                close();

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
                                            <InputDropdown inputDropdownProps={{
                                                labelProps: {
                                                    text: translate(localeJson, 'stockpile_management_create_edit_field_category'),
                                                    inputDropdownLabelClassName: "block",
                                                    inputDropdownLabelSpanClassName: "p-error",
                                                    spanText: "*"
                                                },
                                                inputDropdownClassName: "w-full",
                                                options: props.categories,
                                                value: values.category,
                                                name: 'category',
                                                inputId: "category",
                                                disabled: true,
                                                onChange: (e) => {
                                                    if (e.value == "--") {
                                                        values.category = ''
                                                    } else {
                                                        values.category = e.value
                                                    }
                                                },
                                                onBlur: handleBlur,
                                                emptyMessage: translate(localeJson, "data_not_found"),
                                            }}
                                            />
                                            <ValidationError errorBlock={errors.category && touched.category && errors.category} />
                                        </div>
                                        <div className="modal-field-bottom-space">
                                            <Input
                                                inputProps={{
                                                    inputParentClassName: `${errors.product_name && touched.product_name && 'p-invalid pb-1'}`,
                                                    labelProps: {
                                                        text: translate(localeJson, 'stockpile_management_create_edit_field_product_name'),
                                                        inputLabelClassName: "block",
                                                        spanText: "*",
                                                        inputLabelSpanClassName: "p-error"
                                                    },
                                                    inputClassName: "w-full create_input_stock",
                                                    id:"product_name",
                                                    name: "product_name",
                                                    value: values.product_name,
                                                    disabled: true,
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                }}
                                            />
                                        </div>
                                        <div className="modal-field-bottom-space">
                                            <InputNumber inputNumberProps={{
                                                labelProps: {
                                                    text: translate(localeJson, "stockpile_management_create_edit_field_shelf_life"),
                                                    inputNumberLabelClassName: "block"
                                                },
                                                inputNumberClassName: "w-full",
                                                id: "shelf_life",
                                                name: "shelf_life",
                                                disabled: true,
                                                value: values.shelf_life ? values.shelf_life : null,
                                            }} />
                                        </div>
                                        <div className="modal-field-bottom-space">
                                            <Input inputProps={{
                                                labelProps: {
                                                    text: translate(localeJson, "quantity"),
                                                    inputLabelClassName: "block",
                                                    spanText: "*",
                                                    inputLabelSpanClassName: "p-error",
                                                    labelMainClassName: "modal-label-field-space"
                                                },
                                                inputClassName: "w-full",
                                                id: "quantity",
                                                name: "after_count",
                                                value: values.after_count,
                                                onChange: (evt) => {
                                                    if (evt.target.value == "") {
                                                        setFieldValue("after_count", evt.target.value)
                                                        return;
                                                    }
                                                    const re = /^[0-9-]+$/;
                                                    if (re.test(convertToSingleByte(evt.target.value))) {
                                                        setFieldValue("after_count", evt.target.value)
                                                    }
                                                },
                                                onBlur: handleBlur,
                                            }} />
                                            <ValidationError errorBlock={errors.after_count && touched.after_count && errors.after_count} />
                                        </div>
                                        <div className="modal-field-bottom-space">
                                            <Calendar calendarProps={{
                                                labelProps: {
                                                    text: translate(localeJson, 'inventory_date'),
                                                    calendarLabelClassName: "block",
                                                    spanText: "*",
                                                    calendarLabelSpanClassName: "p-error",
                                                    labelMainClassName: "modal-label-field-space"
                                                },
                                                calendarClassName: "w-full",
                                                name: "Inspection_date_time",
                                                id: "Inspection_date_time",
                                                date: values.Inspection_date_time,
                                                onChange: (evt) => {
                                                    setFieldValue(
                                                        "Inspection_date_time",
                                                        evt.target.value
                                                    );
                                                },
                                                onBlur: handleBlur,
                                            }}
                                            />
                                            <ValidationError errorBlock={errors.Inspection_date_time && touched.Inspection_date_time && errors.Inspection_date_time} />
                                        </div>
                                        <div className="modal-field-bottom-space">
                                            <Input
                                                inputProps={{
                                                    labelProps: {
                                                        text: translate(localeJson, 'confirmer'),
                                                        inputLabelClassName: "block",
                                                    },
                                                    inputClassName: "w-full",
                                                    id: 'confirmer',
                                                    name: 'incharge',
                                                    value: values.incharge,
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                }}
                                            />
                                        </div>
                                        <div className="modal-field-bottom-space">
                                            <Calendar calendarProps={{
                                                labelProps: {
                                                    text: translate(localeJson, 'expiry_date'),
                                                    calendarLabelClassName: "block",
                                                    spanText: "*",
                                                    calendarLabelSpanClassName: "p-error",
                                                    labelMainClassName: "modal-label-field-space"
                                                },
                                                calendarClassName: "w-full",
                                                name: "expiry_date",
                                                id: "expiry_date",
                                                date: values.expiry_date,
                                                onChange: (evt) => {
                                                    setFieldValue(
                                                        "expiry_date",
                                                        evt.target.value
                                                    );
                                                },
                                                onBlur: handleBlur,
                                            }}
                                            />
                                            <ValidationError errorBlock={errors.expiry_date && touched.expiry_date && errors.expiry_date} />
                                        </div>
                                        <div className="modal-field-top-space modal-field-bottom-space">
                                            <Input
                                                inputProps={{
                                                    labelProps: {
                                                        text: translate(localeJson, 'remarks'),
                                                        inputLabelClassName: "block",
                                                        labelMainClassName: "modal-label-field-space"
                                                    },
                                                    inputClassName: "w-full",
                                                    value: values.remarks,
                                                    id:"remarks",
                                                    name: 'remarks',
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                }}
                                            />
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
                                                    onClick: () => {
                                                        resetForm();
                                                        close();
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