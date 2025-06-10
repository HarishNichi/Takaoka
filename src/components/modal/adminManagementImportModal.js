import React, { useContext, useRef } from "react"
import { Dialog } from 'primereact/dialog';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Button, InputFile, ValidationError } from "@/components"; 
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";

export default function AdminManagementImportModal(props) {
    const { localeJson } = useContext(LayoutContext);
    const { open, close, importFile, modalHeaderText, style } = props && props;

    const fileInputRef = useRef(null);
    const initialValues = { file: null };

    const schema = Yup.object().shape({
        file: Yup.mixed()
            .required(translate(localeJson, 'file_csv_required'))
            .test('is-csv', translate(localeJson, 'select_csv_format'), (value) => {
                if (!value) return true; // If no file is selected, the validation passes.

                const allowedExtensions = ['csv']; // Define the allowed file extensions (in this case, just 'csv').
                const fileExtension = value.name.split('.').pop(); // Get the file extension from the file name.

                // Check if the file extension is in the list of allowed extensions.
                return allowedExtensions.includes(fileExtension.toLowerCase());
            }),
    });

    const resetAndCloseForm = (callback) => {
        close();
        callback();
    }

    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={initialValues}
                onSubmit={(values, { resetForm }) => {
                    importFile(values.file)
                    close();
                    resetAndCloseForm(resetForm);
                }}
            >
                {({
                    errors,
                    touched,
                    setFieldValue,
                    handleSubmit,
                    resetForm
                }) => (
                    <div className="">
                        <form onSubmit={handleSubmit}>
                            <Dialog
                                className={`new-custom-modal`}
                                header={
                                    <div>
                                        {modalHeaderText}
                                    </div>
                                }
                                visible={open}
                                style={style}
                                draggable={false}
                                blockScroll={true}
                                onHide={() => {
                                    resetAndCloseForm(resetForm);
                                    close();
                                }}
                                footer={
                                    <div className="text-center">
                                        <Button buttonProps={{
                                            type: "submit",
                                            buttonClass: "w-8rem update-button",
                                            text: translate(localeJson, 'import'),
                                            severity: "primary",
                                            onClick: () => {
                                                handleSubmit();
                                            },
                                        }} parentClass={"inline update-button"} />
                                    </div>
                                }
                            >
                                <div className={`modal-content`}>
                                    <div className="modal-header">
                                        <div>
                                            {modalHeaderText}
                                        </div>
                                    </div>
                                    {props.tag && (<div className="mb-2">
                                        <p>{translate(localeJson, 'hq_stockpile_export_title_modal')}</p>
                                    </div>)}
                                    <InputFile inputFileProps={{
                                        onChange: (event) => {
                                            setFieldValue("file", event.currentTarget.files[0]);
                                        },
                                        ref: fileInputRef,
                                        placeholder: translate(localeJson, 'default_csv_file_placeholder')
                                    }} parentClass={`bg-white w-full ${errors.file && touched.file && 'p-invalid '}`} />
                                    <div className='pt-1'>
                                        <ValidationError errorBlock={errors.file && touched.file && errors.file} />
                                    </div>
                                    <div className="text-center">
                                        <div className="modal-button-footer-space">
                                            <Button buttonProps={{
                                                type: "submit",
                                                buttonClass: "w-full update-button",
                                                text: translate(localeJson, 'import'),
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
                                                    resetAndCloseForm(resetForm);
                                                    close();
                                                },
                                            }} parentClass={"back-button"} />
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