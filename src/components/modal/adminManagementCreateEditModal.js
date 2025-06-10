import React, { useContext } from "react"
import { Dialog } from 'primereact/dialog';
import { Formik } from "formik";
import * as Yup from "yup";

import { Input, Button, Password, ValidationError } from "@/components";
import { convertToSingleByte, getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { AdminManagementServices } from "@/services";

export default function AdminManagementCreateEditModal(props) {
    const { localeJson } = useContext(LayoutContext);
    const { open, close } = props && props;
    const isEmail = (value) => {
        // Check if the value includes '@' and matches the email pattern
        return !value.includes('@') || /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value);
    };

    const schema = Yup.object().shape({
        username: Yup.string()
            .required(translate(localeJson, 'user_id_required'))
            .max(100, translate(localeJson, 'user_id_max_100'))
            .test('is-email', translate(localeJson, 'user_id_email'), isEmail),
        name: Yup.string()
            .required(translate(localeJson, 'admin_name_required'))
            .max(100, translate(localeJson, 'staff_name_max_required')),
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
                }
                else {
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
    }

    return (
        <>
            <Formik
                initialValues={props.currentObj}
                validationSchema={schema}
                enableReinitialize={true}
                onSubmit={(values, { resetForm }) => {
                    if (props.registerModalAction == "create") {
                        values.tel = convertToSingleByte(values.tel);
                        AdminManagementServices.create(values, (result) => {
                            resetAndCloseForm(resetForm)
                        })
                    } else if (props.registerModalAction == "edit") {
                        values.tel = convertToSingleByte(values.tel);
                        AdminManagementServices.update(props.currentObj.id, { id: props.currentObj.id, ...values },
                            () => {
                                resetAndCloseForm(resetForm)
                            });
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
                    resetForm
                }) => (
                    <div>
                        <form onSubmit={handleSubmit}>
                            <Dialog
                                className={`new-custom-modal`}
                                header={props.registerModalAction == 'create' ? translate(localeJson, 'add_admin_management') : translate(localeJson, 'edit_admin_management')}
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
                                                close()
                                            },
                                        }} parentClass={"inline back-button"} />
                                        <Button buttonProps={{
                                            buttonClass: "w-8rem update-button",
                                            type: "submit",
                                            text: props.registerModalAction == 'create' ? translate(localeJson, 'submit') : translate(localeJson, 'update'),
                                            severity: "primary",
                                            onClick: () => {
                                                handleSubmit();
                                            },
                                        }} parentClass={"inline update-button"} />
                                    </div>
                                }
                            >
                                <div className={`modal-content staff_modal`}>
                                    <div className="">
                                        <div className="modal-header">
                                            {props.registerModalAction == 'create' ? translate(localeJson, 'add_admin_management') : translate(localeJson, 'edit_admin_management')}
                                        </div>
                                        <div className="modal-field-bottom-space">
                                            <Input
                                                inputProps={{
                                                    inputParentClassName: `${errors.name && touched.name && 'p-invalid pb-1'}`,
                                                    labelProps: {
                                                        text: translate(localeJson, 'name'),
                                                        inputLabelClassName: "block",
                                                        spanText: "*",
                                                        inputLabelSpanClassName: "p-error",
                                                        labelMainClassName: "modal-label-field-space"
                                                    },
                                                    inputClassName: "w-full",
                                                    id: "name",
                                                    name: "name",
                                                    value: values && values.name,
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                }}
                                            />
                                            <ValidationError errorBlock={errors.name && touched.name && errors.name} />
                                        </div>
                                        <div className="modal-field-bottom-space">
                                            <Input
                                                inputProps={{
                                                    inputParentClassName: `${errors.username && touched.username && 'p-invalid pb-1'}`,
                                                    labelProps: {
                                                        text: translate(localeJson, 'userId'),
                                                        inputLabelClassName: "block",
                                                        spanText: "*",
                                                        inputLabelSpanClassName: "p-error",
                                                        labelMainClassName: "modal-label-field-space"
                                                    },
                                                    inputClassName: "w-full",
                                                    id: "username",
                                                    name: "username",
                                                    value: values && values.username,
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                }}
                                            />
                                            <ValidationError errorBlock={errors.username && touched.username && errors.username} />
                                        </div>
                                        <div className="modal-field-bottom-space w-full">
                                            <Password
                                                passwordProps={{
                                                    passwordParentClassName: `w-full password-form-field ${errors.password && touched.password && 'p-invalid pb-1'}`,
                                                    labelProps: {
                                                        text: translate(localeJson, 'password'),
                                                        spanText: "*",
                                                        passwordLabelSpanClassName: "p-error",
                                                        passwordLabelClassName: "block",
                                                        labelMainClassName: "modal-label-field-space"
                                                    },
                                                    name: 'password',
                                                    value: values.password,
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                    passwordClass: "w-full"
                                                }}

                                            />
                                            <ValidationError errorBlock={errors.password && touched.password && errors.password} />
                                        </div>
                                        <div className="modal-field-bottom-space">
                                            <Input
                                                inputProps={{
                                                    inputParentClassName: `${errors.tel && touched.tel && 'p-invalid pb-1'}`,
                                                    labelProps: {
                                                        text: translate(localeJson, 'tel'),
                                                        inputLabelClassName: "block",
                                                        labelMainClassName: "modal-label-field-space"
                                                    },
                                                    inputClassName: "w-full",
                                                    id: "tel",
                                                    name: 'tel',
                                                    value: values && values.tel,
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                }}
                                            />
                                            <ValidationError errorBlock={errors.tel && touched.tel && errors.tel} />
                                        </div>
                                        <div className="text-center">
                                            <div className="modal-button-footer-space">
                                                <Button buttonProps={{
                                                    buttonClass: "w-full update-button",
                                                    type: "submit",
                                                    text: props.registerModalAction == 'create' ? translate(localeJson, 'submit') : translate(localeJson, 'update'),
                                                    severity: "primary",
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
                        </form>
                    </div>
                )}
            </Formik>
        </>
    );
}