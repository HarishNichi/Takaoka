import React, { useContext, useEffect, useState } from "react"
import { Dialog } from 'primereact/dialog';
import { Formik } from "formik";
import * as Yup from "yup";

import { Button, NormalLabel, Input, TextArea, ValidationError } from "@/components"; 
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";

export default function StockPileSummaryMailSettingsModal(props) {
    const { localeJson } = useContext(LayoutContext);
    const { open, close, register, emailSettingValues, showUpdate } = props && props;

    const [initialValues, setInitialValues] = useState({
        email: emailSettingValues.email,
        place_name: emailSettingValues.place_name
    });
    const regexExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const schema = Yup.object().shape({
        email: Yup.string()
            .required(translate(localeJson, 'notification_email_id_required'))
            .test('is-email', translate(localeJson, 'format_notification'), value => {
                /** Check if it's a single valid email or a list of valid emails separated by commas */
                return value.match(regexExp) || validateMultipleEmails(value, localeJson);
            }),
    });

    useEffect(() => {
        if (open) {
            setInitialValues({
                email: emailSettingValues.email,
                place_name: emailSettingValues.place_name
            });
        }
    }, [open]);

    const validateMultipleEmails = (value, localeJson) => {
        const emails = value.split(',').map(email => email.trim());
        for (const email of emails) {
            if (!email.match(regexExp)) {
                return false;
            }
        }
        return true; // Return true if all emails are valid
    };

    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={initialValues}
                enableReinitialize
                onSubmit={({ resetForm }) => {
                    close();
                    resetForm({ values: initialValues });
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
                            header={translate(localeJson, 'notification_settings')}
                            visible={open}
                            draggable={false}
                            blockScroll={true}
                            onHide={() => {
                                close();
                                resetForm({ values: initialValues });
                            }}
                            footer={
                                <div className="text-center">
                                    <Button buttonProps={{
                                        buttonClass: "w-8rem back-button",
                                        text: translate(localeJson, 'cancel'),
                                        onClick: () => {
                                            close();
                                            resetForm({ values: initialValues });
                                        }
                                    }} parentClass={"inline back-button"} />
                                    {showUpdate != false && (
                                        <Button buttonProps={{
                                            buttonClass: "w-8rem update-button",
                                            type: "submit",
                                            text: translate(localeJson, 'update'),
                                            onClick: () => {
                                                register({
                                                    email: values.email,
                                                    errors: errors
                                                });
                                                handleSubmit();
                                            },
                                        }} parentClass={"inline update-button"} />
                                    )}
                                </div>
                            }
                        >
                            <div className={`modal-content`}>
                                <div>
                                    <div className="modal-header">
                                        {translate(localeJson, 'notification_settings')}
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                        <div >
                                            <div className='modal-field-bottom-space'>
                                                <Input
                                                    inputProps={{
                                                        labelProps: {
                                                            text: translate(localeJson, 'evacuation_place'),
                                                            inputLabelClassName: "block",
                                                            spanText: "*",
                                                            inputLabelSpanClassName: "p-error"
                                                        },
                                                        inputClassName: "w-full",
                                                        id:"place_name",
                                                        name: "place_name",
                                                        value: values.place_name,
                                                        disabled: "true",
                                                        readOnly: "true",
                                                        onChange: handleChange,
                                                        onBlur: handleBlur,
                                                    }}
                                                />
                                            </div>
                                            <div className='modal-field-bottom-space'>
                                                <TextArea textAreaProps={{
                                                    textAreaParentClassName: `${errors.email && touched.email && 'p-invalid w-full lg:w-25rem md:w-23rem sm:w-21rem '}`,
                                                    labelProps: {
                                                        text: translate(localeJson, 'notification_email_id'),
                                                        textAreaLabelSpanClassName: "p-error",
                                                        spanText: "*",
                                                        textAreaLabelClassName: "block",
                                                    },
                                                    textAreaClass: "w-full",
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                    row: 5,
                                                    cols: 30,
                                                    name: 'email',
                                                    value: values.email,
                                                }} />
                                                <ValidationError errorBlock={errors.email && touched.email && errors.email} />
                                            </div>
                                            <div className='modal-field-top-space ml-1 w-full'>
                                                <NormalLabel text={translate(localeJson, 'history_mail_message')} />
                                            </div>
                                        </div>
                                    </form>
                                    <div className="text-center">
                                        <div className="modal-button-footer-space">
                                            {showUpdate != false && (
                                                <Button buttonProps={{
                                                    buttonClass: "w-full update-button",
                                                    type: "submit",
                                                    text: translate(localeJson, 'update'),
                                                    onClick: () => {
                                                        register({
                                                            email: values.email,
                                                            errors: errors
                                                        });
                                                        handleSubmit();
                                                    },
                                                }} parentClass={"update-button"} />
                                            )}
                                        </div>
                                        <div>
                                            <Button buttonProps={{
                                                buttonClass: "w-full back-button",
                                                text: translate(localeJson, 'cancel'),
                                                onClick: () => {
                                                    close();
                                                    resetForm({ values: initialValues });
                                                }
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