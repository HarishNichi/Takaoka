import React, { useContext } from "react"
import { Dialog } from 'primereact/dialog';
import { Formik } from "formik";
import * as Yup from "yup";

import { Button, NormalLabel, Input, InputDropdown, ValidationError, InputFile } from "@/components"; 
import { convertToSingleByte, getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { StockpileService } from "@/services";

export default function StockpileCreateEditModal(props) {
    const { localeJson } = useContext(LayoutContext);
    const { open, close } = props;

    const schema = Yup.object().shape({
        category: Yup.string()
            .required(translate(localeJson, 'type_required'))
            .max(200, translate(localeJson, 'stockpile_page_create_update_category_max')),
        product_name: Yup.string()
            .required(translate(localeJson, 'stockpile_name_required'))
            .max(200, translate(localeJson, 'stockpile_page_create_update_product_name_max')),
        shelf_life: Yup.string()
            .nullable()
            .test("check_int", translate(localeJson, 'number_field'),
                (value) => {
                    if (value === null || value === undefined || value === "") {
                        return true; // Skip validation for null, undefined, or empty string values
                    }
                    const re = /^[0-9-]+$/;
                    return re.test(convertToSingleByte(value))
                })
            .max(3, translate(localeJson, 'stockpile_shelf_life_max')),
        image_logo: Yup.mixed()
            .notRequired() // Allow it to be nullable
            .test('fileSize', translate(localeJson, 'image_size_validation'), (value) => {
                if (value) {
                    return value && value.size <= 5 * 1024 * 1024; // 5 MB in bytes
                }
                return true; // Null values are allowed
            })
            .test('fileType', translate(localeJson, 'valid_image_file'), (value) => {
                if (value) {
                    return value && value.type.startsWith('image/'); // Check if the file type starts with "image/"
                }
                return true; // Null values are allowed
            }),
    });

    const getImageFileName = () => {
        if (props.currentEditObj.stockpile_image) {
            const parts = props.currentEditObj.stockpile_image.split("/");
            const filename = parts[parts.length - 1];
            return filename
        }
        return null;
    }

    const resetAndCloseForm = (callback) => {
        close();
        callback();
        props.refreshList();
    }

    return (
        <>
            <Formik
                validationSchema={schema}
                enableReinitialize={true}
                initialValues={props.currentEditObj}
                onSubmit={(values, { resetForm }) => {
                    let formData = new FormData();
                    formData.append('category', values.category);
                    formData.append('product_name', values.product_name);
                    formData.append('shelf_life', convertToSingleByte(values.shelf_life));
                    if (values.image_logo instanceof File) {
                        formData.append('image_logo', values.image_logo);
                    }
                    if (props.registerModalAction == "create") {
                        StockpileService.create(formData, (res) => {
                            resetAndCloseForm(resetForm);
                            res && props.register(res);
                        })
                    }
                    else if (props.registerModalAction == "edit") {
                        formData.append('product_id', props.currentEditObj.product_id);
                        StockpileService.update(props.currentEditObj.product_id, formData,
                            (res) => {
                                resetAndCloseForm(resetForm);
                                res && props.register(res);
                            })
                    }
                    return false;
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    setFieldValue,
                    handleSubmit,
                    resetForm
                }) => (
                    <div>
                        <Dialog
                            className="new-custom-modal"
                            header={
                                <div className="new-custom-modal">
                                    {props.registerModalAction == "create" && translate(localeJson, 'stockpile_management_create_modal_header')}
                                    {props.registerModalAction == "edit" && translate(localeJson, 'stockpile_management_edit_modal_header')}
                                </div>
                            }
                            visible={open}
                            draggable={false}
                            blockScroll={true}
                            onHide={() => {
                                close()
                                resetForm()
                            }}
                            footer={
                                <div className="text-center">
                                    <Button buttonProps={{
                                        buttonClass: "w-8rem back-button",
                                        text: translate(localeJson, 'cancel'),
                                        onClick: () => {
                                            close()
                                            resetForm()
                                        },
                                    }} parentClass={"inline back-button"} />
                                    <Button buttonProps={{
                                        buttonClass: "w-8rem update-button",
                                        type: "submit",
                                        text: props.registerModalAction == "create" ? translate(localeJson, 'registration') : translate(localeJson, 'update'),
                                        onClick: () => {
                                            handleSubmit();
                                        },
                                    }} parentClass={"inline update-button"} />
                                </div>
                            }
                        >
                            <div className={`modal-content`}>
                                <div>
                                    <div className="modal-header">
                                        {props.registerModalAction == "create" && translate(localeJson, 'stockpile_management_create_modal_header')}
                                        {props.registerModalAction == "edit" && translate(localeJson, 'stockpile_management_edit_modal_header')}
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                        <div className="modal-field-bottom-space">
                                            <InputDropdown inputDropdownProps={{
                                                labelProps: {
                                                    text: translate(localeJson, 'stockpile_management_create_edit_field_category'),
                                                    inputDropdownLabelClassName: "block",
                                                    inputDropdownLabelSpanClassName: "p-error",
                                                    spanText: "*",
                                                    labelMainClassName: "modal-label-field-space"
                                                },
                                                inputDropdownClassName: "w-full",
                                                customPanelDropdownClassName: "w-10rem",
                                                options: props.categories,
                                                value: values.category,
                                                editable: true,
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
                                                        inputLabelSpanClassName: "p-error",
                                                        labelMainClassName: "modal-label-field-space"
                                                    },
                                                    inputClassName: "w-full",
                                                    id:"product_name",
                                                    name: "product_name",
                                                    value: values.product_name,
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                }}
                                            />
                                            <ValidationError errorBlock={errors.product_name && touched.product_name && errors.product_name} />
                                        </div>
                                        <div className="modal-field-bottom-space">
                                            <Input
                                                inputProps={{
                                                    inputParentClassName: `${errors.shelf_life && touched.shelf_life && 'p-invalid pb-1'}`,
                                                    labelProps: {
                                                        text: translate(localeJson, 'stockpile_management_create_edit_field_shelf_life'),
                                                        inputLabelClassName: "block",
                                                    },
                                                    inputClassName: "w-full",
                                                    id:"shelf_life",
                                                    name: "shelf_life",
                                                    value: values.shelf_life,
                                                    onChange: (evt) => {
                                                        const re = /^[0-9-]+$/;
                                                        let val;
                                                        if (
                                                            evt.target.value === "" ||
                                                            re.test(convertToSingleByte(evt.target.value))
                                                        ) {
                                                            val = evt.target.value.replace(/-/g, "");
                                                            if (evt.target.value?.length <= 3) {
                                                                setFieldValue("shelf_life", evt.target.value);
                                                            }
                                                        }
                                                    },
                                                    onBlur: handleBlur,
                                                }}
                                            />
                                            <ValidationError errorBlock={errors.shelf_life && touched.shelf_life && errors.shelf_life} />
                                        </div>
                                        <div className="modal-field-bottom-space">
                                            <div className='modal-label-field-space'>
                                                <NormalLabel
                                                    text={translate(localeJson, 'stockpile_management_create_edit_field_stockpile_image')} />
                                            </div>
                                            <InputFile inputFileProps={{
                                                name: "image_logo",
                                                onChange: (event) => {
                                                    setFieldValue("image_logo", event.currentTarget.files[0]);
                                                },
                                                inputClass: "w-full",
                                                inputFileClass:"font-size-12px",

                                                placeholder: getImageFileName() ? getImageFileName() : translate(localeJson, 'default_file_placeholder')
                                            }} parentClass={"w-full bg-white input-parent-file"} />
                                            <ValidationError errorBlock={errors.image_logo && touched.image_logo && errors.image_logo} />
                                        </div>
                                    </form>
                                    <div className="text-center">
                                        <div className="modal-button-footer-space">
                                            <Button buttonProps={{
                                                buttonClass: "w-full update-button",
                                                type: "submit",
                                                text: props.registerModalAction == "create" ? translate(localeJson, 'registration') : translate(localeJson, 'update'),
                                                onClick: () => {
                                                    handleSubmit();
                                                },
                                            }} parentClass={"inline update-button"} />
                                        </div>
                                        <div>
                                            <Button buttonProps={{
                                                buttonClass: "w-full back-button",
                                                text: translate(localeJson, 'cancel'),
                                                onClick: () => {
                                                    close()
                                                    resetForm()
                                                },
                                            }} parentClass={"inline back-button"} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Dialog>
                    </div>
                )}
            </Formik>
        </>
    );
}