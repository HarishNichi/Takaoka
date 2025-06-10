import React, { useContext, useEffect, useState } from "react"
import { Dialog } from 'primereact/dialog';
import { Formik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";

import { Button, NormalLabel, Input, InputDropdown, ValidationError, InputFile } from "@/components"; 
import { convertToSingleByte, getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { StockpileStaffService } from "@/services";

export default function StaffStockpileCreateModal(props) {
    const { localeJson } = useContext(LayoutContext);
    const layoutReducer = useSelector((state) => state.layoutReducer);
    const { open, close, createdStock, header, onCategoryChange } = props;

    const [initialValues, setInitialValues] = useState({
        category: "",
        product_name: "",
        shelf_life: ""
    });
    const schema = Yup.object().shape({
        category: Yup.string()
            .required(translate(localeJson, 'type_required'))
            .max(200, translate(localeJson, 'stockpile_page_create_update_category_max')),
        product_name: Yup.string()
            .required(translate(localeJson, 'stockpile_name_required'))
            .max(200, translate(localeJson, 'stockpile_page_create_update_product_name_max')),
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

    useEffect(() => {
        if (open) {
            setInitialValues({
                category: "",
                product_name: "",
                shelf_life: ""
            });
        }
    }, [open]);

    const resetAndCloseForm = (callback) => {
        close();
        callback();
        props.refreshList();
        createdStock
    }

    return (
        <>
            <Formik
                validationSchema={schema}
                enableReinitialize={true}
                initialValues={initialValues}
                onSubmit={(values, { resetForm }) => {
                    let formData = new FormData();
                    formData.append('category', values.category);
                    let product = props.productNameOptions.find(item => item.product_id == values.product_name);
                    formData.append('product_name', product ? product.product_name : values.product_name);
                    formData.append('shelf_life', values.shelf_life ? convertToSingleByte(values.shelf_life) : "");
                    formData.append('place_id', layoutReducer?.user?.place?.id);
                    if (values.image_logo) {
                        formData.append('image_logo', values.image_logo);
                    }
                    StockpileStaffService.create(formData, () => {
                        resetAndCloseForm(resetForm);
                    })
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
                            header={header}
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
                                        text: translate(localeJson, 'registration'),
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
                                        {header}
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                        <div className="modal-field-bottom-space ">
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
                                                name: 'category',
                                                editable: true,
                                                onChange: (e) => {
                                                    setFieldValue('category', e.value);
                                                    onCategoryChange(e.value);
                                                },
                                                onBlur: handleBlur,
                                                emptyMessage: translate(localeJson, "data_not_found"),
                                            }}
                                            />
                                            <ValidationError errorBlock={errors.category && touched.category && errors.category} />
                                        </div>
                                        <div className="modal-field-bottom-space">
                                            <InputDropdown inputDropdownProps={{
                                                inputDropdownParenClassName: `${errors.product_name && touched.product_name && 'p-invalid pb-1'}`,
                                                labelProps: {
                                                    text: translate(localeJson, 'stockpile_management_create_edit_field_product_name'),
                                                    inputDropdownLabelClassName: "block",
                                                    inputDropdownLabelSpanClassName: "p-error",
                                                    spanText: "*",
                                                    labelMainClassName: "modal-label-field-space"
                                                },
                                                inputDropdownClassName: "w-full",
                                                value: values.product_name,
                                                options: props.productNameOptions.map(item => {
                                                    return {
                                                        label: item.product_name,
                                                        value: item.product_id
                                                    }
                                                }),
                                                disabled: !props.productNameOptions.length > 0,
                                                name: 'product_name',
                                                editable: true,
                                                onChange: (e) => {
                                                    values.product_name = e.value;
                                                    let selectedPlaceName = props.productNameOptions.find((item) => item.product_id == e.value);
                                                    console.log(selectedPlaceName.shelf_life);
                                                    setFieldValue('shelf_life', selectedPlaceName?.shelf_life ?? '');
                                                },
                                                onBlur: handleBlur,
                                                emptyMessage: translate(localeJson, "data_not_found"),
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
                                                        labelMainClassName: "modal-label-field-space"
                                                    },
                                                    inputClassName: "w-full create_input_stock",
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
                                                inputFileStyle: { fontSize: "12px" },
                                                placeholder: translate(localeJson, 'default_file_placeholder')
                                            }} parentClass={"create_input_stock w-full"} />
                                            <ValidationError errorBlock={errors.image_logo && touched.image_logo && errors.image_logo} />
                                        </div>
                                    </form>
                                    <div className="text-center">
                                        <div className="modal-button-footer-space">
                                            <Button buttonProps={{
                                                buttonClass: "w-full update-button",
                                                type: "submit",
                                                text: translate(localeJson, 'registration'),
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
                                                    close()
                                                    resetForm()
                                                },
                                            }} parentClass={"back-button"} />
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