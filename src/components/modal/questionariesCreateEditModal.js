import React, { useContext, useEffect, useState } from "react"
import { Dialog } from 'primereact/dialog';
import { Formik } from "formik";
import * as Yup from "yup";

import { Button, ValidationError, Input, TextArea } from "@/components"; 
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";

export default function QuestionnairesCreateEditModal(props) {
    const { localeJson } = useContext(LayoutContext);
    const { open, close, onRegister, buttonText, modalAction, editObject } = props && props;

    const [initialValues, setInitialValues] = useState({
        name: "",
        name_en: "",
        remarks: ""
    })
    const schema = Yup.object().shape({
        name: Yup.string()
            .required(translate(localeJson, 'questionnaire_master_name_is_required'))
            .max(200, translate(localeJson, 'questionnaire_master_name_max')),
        name_en: Yup.string()
            .max(200, translate(localeJson, 'questionnaire_master_name_en_max')),
        remarks: Yup.string()
            .required(translate(localeJson, 'questionnaire_remarks_is_required'))
            .max(255, translate(localeJson, 'questionnaire_remarks_is_max_required')),
    });

    useEffect(() => {
        if (open) {
            if (modalAction == "create") {
                setInitialValues({
                    name: "",
                    name_en: "",
                    remarks: ""
                });
            } else {
                setInitialValues({
                    name: editObject.name,
                    name_en: editObject.name_en,
                    remarks: editObject.remarks,
                });
            }
        }
    }, [open]);

    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={initialValues}
                enableReinitialize
                onSubmit={(values, actions) => {
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
                }) => (
                    <div>
                        <form onSubmit={handleSubmit}>
                            <Dialog
                                className="new-custom-modal"
                                header={translate(localeJson, 'questionnaire_master_edit')}
                                visible={open}
                                draggable={false}
                                blockScroll={true}
                                onHide={() => {
                                    close();
                                    resetForm()
                                }}
                                footer={
                                    <div className="text-center">
                                        <div className="modal-field-bottom-space">
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
                                                    close();
                                                    resetForm()
                                                },
                                            }} parentClass={"back-button"} />
                                        </div>
                                    </div>
                                }
                            >
                                <div className={`modal-content`}>
                                    <div className="">
                                        <div className="modal-header">
                                            {translate(localeJson, 'questionnaire_master_edit')}
                                        </div>
                                        <div className="modal-field-bottom-space">
                                            <Input
                                                inputProps={{
                                                    inputParentClassName: `${errors.name && touched.name && 'p-invalid pb-1'}`,
                                                    labelProps: {
                                                        text: translate(localeJson, 'interview_page_shelter_name'),
                                                        inputLabelClassName: "block",
                                                        spanText: "*",
                                                        labelMainClassName: "modal-label-field-space",
                                                        inputLabelSpanClassName: "p-error"
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
                                                        text: translate(localeJson, 'interview_page_shelter_name_en'),
                                                        inputLabelClassName: "block",
                                                        labelMainClassName: "modal-label-field-space"
                                                    },
                                                    inputClassName: "w-full",
                                                    value: values.name_en,
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                    name: "name_en",
                                                    id: "name_en"
                                                }}
                                            />
                                            <ValidationError errorBlock={errors.name_en && touched.name_en && errors.name_en} />
                                        </div>
                                        <div className="">
                                            <TextArea textAreaProps={{
                                                id: 'remarks',
                                                name: 'remarks',
                                                textAreaParentClassName: `${errors.remarks && touched.remarks && 'p-invalid pb-1'}`,
                                                labelProps: {
                                                    text: translate(localeJson, 'remarks'),
                                                    textAreaLabelClassName: "block",
                                                    spanText: "*",
                                                    labelMainClassName: "modal-label-field-space",
                                                    textAreaLabelSpanClassName: "p-error"
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