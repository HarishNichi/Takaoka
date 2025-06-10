import React, { useContext } from 'react';
import { classNames } from 'primereact/utils';
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from 'next/router';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { getValueByKeyRecursively as translate } from '@/helper'
import { ValidationError, Button, CustomHeader, Password } from '@/components';
import { AuthenticationAuthorizationService } from '@/services';

const ResetPasswordPage = () => {
    const { layoutConfig, localeJson } = useContext(LayoutContext);
    const router = useRouter();

    const containerClassName = classNames('auth_surface_ground flex align-items-start justify-content-center overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const schema = Yup.object().shape({
        password: Yup.string()
            .required(translate(localeJson, 'new_password_required'))
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>?]).{8,}$/,
                translate(localeJson, 'new_password_not_matched')
            )
            .min(8, translate(localeJson, 'password_atLeast_8_characters'))
            .max(15, translate(localeJson, 'new_password_max_15_characters')),
        confirmPassword: Yup.string()
            .required(translate(localeJson, 'confirm_password_required'))
            .oneOf([Yup.ref("password"), null], translate(localeJson, 'confirm_password_notMatch'))
            .min(8, translate(localeJson, 'password_atLeast_8_characters'))
            .max(15, translate(localeJson, 'new_confirm_password_max_15_characters')),
    });

    /* Services */
    const { reset } = AuthenticationAuthorizationService;

    const onResetSuccess = () => {
        router.push("/admin/login");
    };

    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={{ password: "", confirmPassword: '' }}
                onSubmit={(values) => {
                    let preparedPayload = values;
                    preparedPayload['query'] = router.query;
                    reset('admin', preparedPayload, onResetSuccess);
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                }) => (
                    <div className={containerClassName}>
                        <div className="flex flex-column align-items-center justify-content-center">
                            <div className="w-full py-2 px-2" >
                                <div className='auth_view py-4 px-4'>
                                    <form onSubmit={handleSubmit}>
                                        <div className="flex justify-content-start w-100 mb-5 auth-header">
                                            <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "reset_password_title")} />
                                        </div>
                                        <div>
                                            <div className="field custom_inputText">
                                                <Password
                                                    passwordProps={{
                                                        passwordParentClassName: `w-full password-form-field ${errors.password && touched.password && 'p-invalid'}`,
                                                        labelProps: {
                                                            text: translate(localeJson, 'new_password'),
                                                            spanText: "*",
                                                            passwordLabelSpanClassName: "p-error",
                                                            passwordLabelClassName: "block",
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
                                            <div className="field custom_inputText">
                                                <Password
                                                    passwordProps={{
                                                        passwordParentClassName: `w-full password-form-field ${errors.confirmPassword && touched.confirmPassword && 'p-invalid'}`,
                                                        labelProps: {
                                                            text: translate(localeJson, 'new_password_confirm'),
                                                            spanText: "*",
                                                            passwordLabelSpanClassName: "p-error",
                                                            passwordLabelClassName: "block",
                                                        },
                                                        name: 'confirmPassword',
                                                        value: values.confirmPassword,
                                                        onChange: handleChange,
                                                        onBlur: handleBlur,
                                                        passwordClass: "w-full"
                                                    }}
                                                />
                                                <ValidationError errorBlock={errors.confirmPassword && touched.confirmPassword && errors.confirmPassword} />
                                            </div>
                                            <div className='flex justify-content-center mt-5'>
                                                <Button buttonProps={{
                                                    type: 'submit',
                                                    text: translate(localeJson, 'save'),
                                                    buttonClass: "custom_radiusBtn update-button w-full",
                                                }} parentClass={"update-button w-full"} />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Formik>
        </>
    );
};

export default ResetPasswordPage;