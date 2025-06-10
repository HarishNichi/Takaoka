import React, { useContext } from "react"
import { Dialog } from 'primereact/dialog';
import { Formik } from "formik";
import * as Yup from "yup";

import { Button, Input, ValidationError } from "@/components"; 
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { MaterialService } from "@/services";

export default function MaterialCreateEditModal(props) {
    const { localeJson } = useContext(LayoutContext);
    const { open, close } = props && props;

    const schema = Yup.object().shape({
        name: Yup.string()
            .required(translate(localeJson, 'supplies_necessary'))
            .max(200, translate(localeJson, 'material_page_create_update_name_max')),
        unit: Yup.string()
            .max(200, translate(localeJson, 'material_page_create_update_unit_max'))
            .nullable()
    });

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
                    if (props.registerModalAction == "create") {
                        MaterialService.create(values, () => {
                            resetAndCloseForm(resetForm)
                        })
                    } else if (props.registerModalAction == "edit") {
                        MaterialService.update(props.currentEditObj.id, { id: props.currentEditObj.id, ...values },
                            () => {
                                resetAndCloseForm(resetForm)
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
                    handleSubmit,
                    resetForm
                }) => (
                    <div>
                        <Dialog
                            className="new-custom-modal"
                            header={
                                <div className="new-custom-modal">
                                    {props.registerModalAction == "create" ?
                                        translate(localeJson, 'material_information_registration_c') : translate(localeJson, 'edit_material_information')}
                                </div>
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
                                    <Button buttonProps={{
                                        buttonClass: "w-full back-button",
                                        text: translate(localeJson, 'cancel'),
                                        onClick: () => {
                                            resetForm();
                                            close()
                                        },
                                    }} parentClass={"back-button"} />
                                    <Button buttonProps={{
                                        buttonClass: "w-full update-button",
                                        type: "submit",
                                        text: translate(localeJson, 'registration'),
                                        onClick: () => {
                                            handleSubmit();
                                        },
                                    }} parentClass={"update-button"} />
                                </div>
                            }
                        >
                            <div className={`modal-content`}>
                                <div>
                                    <div className="modal-header">
                                        {props.registerModalAction == "create" ?
                                            translate(localeJson, 'material_information_registration_c') : translate(localeJson, 'edit_material_information')}
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                        <div className="modal-field-bottom-space">
                                            <Input
                                                inputProps={{
                                                    inputParentClassName: `${errors.name && touched.name && 'p-invalid pb-1'}`,
                                                    labelProps: {
                                                        text: translate(localeJson, 'material_name'),
                                                        inputLabelClassName: "block",
                                                        spanText: "*",
                                                        inputLabelSpanClassName: "p-error",
                                                        labelMainClassName: "modal-label-field-space"
                                                    },
                                                    inputClassName: "w-full",
                                                    id:"name",
                                                    name: "name",
                                                    value: values && values.name,
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                }}
                                            />
                                            <ValidationError errorBlock={errors.name && touched.name && errors.name} />
                                        </div>
                                        <div className='modal-field-bottom-space'>
                                            <Input
                                                inputProps={{
                                                    inputParentClassName: `${errors.unit && touched.unit && 'p-invalid pb-1'}`,
                                                    labelProps: {
                                                        text: translate(localeJson, 'unit'),
                                                        inputLabelClassName: "block",
                                                        labelMainClassName: "modal-label-field-space"
                                                    },
                                                    inputClassName: "w-full",
                                                    id:"unit",
                                                    name: "unit",
                                                    value: values && values.unit,
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                }}
                                            />
                                            <ValidationError errorBlock={errors.unit && touched.unit && errors.unit} />
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
                                                    resetForm();
                                                    close()
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