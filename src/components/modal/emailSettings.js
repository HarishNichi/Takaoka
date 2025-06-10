import React, { useContext, useState, useEffect } from "react"
import { Dialog } from 'primereact/dialog';
import { Formik } from "formik";
import * as Yup from "yup";

import { Button, NormalLabel, ValidationError, InputDropdown, TextArea } from "@/components"; 
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";

export default function EmailSettings(props) {
    const { localeJson } = useContext(LayoutContext);
    const { open, close, register, intervalFrequency, prefectureList, emailSettingValues } = props && props;

    const [transmissionInterval, setTransmissionInterval] = useState(0);
    const [outputTargetArea, setOutputTargetArea] = useState(0);
    const [initialValues, setInitialValues] = useState({
        email: emailSettingValues.email,
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
            setTransmissionInterval(emailSettingValues.transmissionInterval);
            setOutputTargetArea(emailSettingValues.outputTargetArea);
            setInitialValues({
                email: emailSettingValues.email
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

        return emails.join(','); // Return true if all emails are valid
    };

    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={initialValues}
                enableReinitialize
                onSubmit={(actions) => {
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
                    resetForm
                }) => (
                    <div>
                        <Dialog
                            className="new-custom-modal"
                            header={
                                <div className="new-custom-modal">
                                    {translate(localeJson, 'mail_setting')}
                                </div>
                            }
                            visible={open}
                            draggable={false}
                            blockScroll={true}
                            onHide={() => {
                                close();
                                resetForm({ values: initialValues });
                            }}
                            footer={
                                <div className="text-center">
                                    <div className="modal-button-footer-space">
                                        <Button buttonProps={{
                                            buttonClass: "w-full update-button",
                                            type: "submit",
                                            text: translate(localeJson, 'registration'),
                                            onClick: () => {
                                                register({
                                                    transmissionInterval,
                                                    outputTargetArea,
                                                    email: values.email,
                                                    errors: errors
                                                });
                                                handleSubmit();
                                            },
                                        }} parentClass={"update-button"} />
                                    </div>
                                    <div >
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
                            }
                        >
                            <div className={`modal-content`}>
                                <div >
                                    <div className="modal-header">
                                        {translate(localeJson, 'mail_setting')}
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                        <div className="" >
                                            <div className='modal-field-bottom-space'>
                                                <TextArea textAreaProps={{
                                                    textAreaParentClassName: `${errors.email && touched.email && 'p-invalid w-full'}`,
                                                    labelProps: {
                                                        text: translate(localeJson, 'notification_email_id'),
                                                        textAreaLabelSpanClassName: "p-error",
                                                        spanText: "*",
                                                        textAreaLabelClassName: "block",
                                                        labelMainClassName: "modal-label-field-space"
                                                    },
                                                    textAreaClass: "w-full",
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                    row: 5,
                                                    cols: 40,
                                                    name: 'email',
                                                    value: values.email,
                                                }} />
                                                <ValidationError errorBlock={errors.email && touched.email && errors.email} />
                                            </div>
                                            <div className='modal-field-top-space modal-field-bottom-space'>
                                                <InputDropdown inputDropdownProps={{
                                                    inputDropdownParentClassName: "w-full",
                                                    labelProps: {
                                                        text: translate(localeJson, 'transmission_interval'),
                                                        inputDropdownLabelClassName: "block",
                                                        labelMainClassName: "modal-label-field-space"
                                                    },
                                                    inputDropdownClassName: "w-full",
                                                    value: transmissionInterval,
                                                    options: intervalFrequency,
                                                    optionLabel: "name",
                                                    onChange: (e) => setTransmissionInterval(e.value),
                                                    emptyMessage: translate(localeJson, "data_not_found"),
                                                }}
                                                />
                                            </div>
                                            <div className=''>
                                                <InputDropdown inputDropdownProps={{
                                                    inputDropdownParentClassName: "w-full",
                                                    labelProps: {
                                                        text: translate(localeJson, 'output_target_area'),
                                                        inputDropdownLabelClassName: "block",
                                                        labelMainClassName: "modal-label-field-space"
                                                    },
                                                    inputDropdownClassName: "w-full",
                                                    value: outputTargetArea,
                                                    options: prefectureList,
                                                    optionLabel: "name",
                                                    onChange: (e) => setOutputTargetArea(e.value),
                                                    emptyMessage: translate(localeJson, "data_not_found"),
                                                }}
                                                />

                                            </div>
                                            <div className='modal-field-top-space ml-1 w-full '>
                                                <NormalLabel text={translate(localeJson, 'history_mail_message')} style={{ fontSize: "13px" }} />
                                            </div>
                                        </div>
                                    </form>
                                    <div className="text-center">
                                        <div className="modal-button-footer-space">
                                            <Button buttonProps={{
                                                buttonClass: "w-full update-button",
                                                type: "submit",
                                                text: translate(localeJson, 'registration'),
                                                onClick: () => {
                                                    register({
                                                        transmissionInterval,
                                                        outputTargetArea,
                                                        email: values.email,
                                                        errors: errors
                                                    });
                                                    handleSubmit();
                                                },
                                            }} parentClass={"update-button"} />
                                        </div>
                                        <div >
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