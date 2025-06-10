import React, { useContext, useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Formik } from "formik";
import * as Yup from "yup";

import { Button, ValidationError, TextArea } from "@/components";
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";

export default function Notification(props) {
    const { localeJson } = useContext(LayoutContext);
    const { open, close, onSubmit, defaultMessage } = props;

    const [initialValues, setInitialValues] = useState({ message: "" });

    useEffect(() => {
        if (open) {
            setInitialValues({ message: defaultMessage || "" });
        }
    }, [open, defaultMessage]);

    const schema = Yup.object().shape({
        message: Yup.string().required(translate(localeJson, "message_required")),
    });

    return (
        <Formik
            validationSchema={schema}
            initialValues={initialValues}
            enableReinitialize
            onSubmit={(values, actions) => {
                onSubmit(values.message);
                actions.resetForm({ values: initialValues });
                close();
            }}
        >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit,resetForm }) => (
                <Dialog
                     className="new-custom-modal"
                    header={translate(localeJson, "send_notification")}
                    visible={open}
                     draggable={false}
                     blockScroll={true}
                    onHide={() => {
                        setInitialValues({ message: "" });
                        resetForm({ values: initialValues });
                        close();
                    }}
                    footer={
                        <div className="text-center">
                            <Button
                                buttonProps={{
                                    buttonClass: "w-full update-button",
                                    type: "submit",
                                    text: translate(localeJson, "send"),
                                    onClick: handleSubmit,
                                }}
                                parentClass={"update-button"}
                            />
                        </div>
                    }
                >
                           <div className={`modal-content`}>
                                                    <div >
                                                        <div className="modal-header">
                                                            {translate(localeJson, 'send_notification')}
                                                        </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-field-bottom-space">
                            <TextArea
                                textAreaProps={{
                                    textAreaParentClassName:
                                        errors.message && touched.message ? "p-invalid w-full " : "w-full ",
                                    labelProps: {
                                        text: translate(localeJson, "message"),
                                        spanText: "*",
                                        textAreaLabelClassName: "block",
                                        labelMainClassName: "modal-label-field-space",
                                         textAreaLabelSpanClassName: "p-error"
                                    },
                                    textAreaClass: "w-full h-12rem",
                                    onChange: handleChange,
                                    onBlur: handleBlur,
                                    row: 10,
                                    cols: 40,
                                    name: "message",
                                    value: values.message,
                                }}
                            />
                            <ValidationError errorBlock={errors.message && touched.message && errors.message} />
                        </div>
                    </form>
                         <div className="text-center">
                            <Button
                                buttonProps={{
                                    buttonClass: "w-full update-button",
                                    type: "submit",
                                    text: translate(localeJson, "send"),
                                    onClick: handleSubmit,
                                }}
                                parentClass={"update-button"}
                            />
                        </div>
                    </div>
                </div>
                </Dialog>
            )}
        </Formik>
    );
}
