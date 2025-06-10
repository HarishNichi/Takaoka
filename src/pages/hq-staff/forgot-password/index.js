import React, { useContext } from 'react';
import { classNames } from 'primereact/utils';
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from 'next/router';
import { useSelector } from "react-redux";

import { LayoutContext } from '@/layout/context/layoutcontext';
import { getValueByKeyRecursively as translate } from '@/helper'
import { ValidationError, Button, CustomHeader, InputGroup } from '@/components';
import { AuthenticationAuthorizationService } from '@/services';

const ForgotPasswordPage = () => {
    const { layoutConfig, localeJson } = useContext(LayoutContext);
    const router = useRouter();
    const stateData = useSelector((state) => state.forgetPasswordReducer);
    
    const containerClassName = classNames('auth_surface_ground flex align-items-start justify-content-center overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });
    const schema = Yup.object().shape({
        email: Yup.string()
            .required(translate(localeJson, 'user_id_required'))
            .max(200, translate(localeJson, 'user_id_max'))
    });

    /* Services */
    const { forgot } = AuthenticationAuthorizationService;

    /**
     * Forgot success
     * @param {*} response 
     */
    const onForgotSuccess = (response) => {
        if (response && response.data.success) {
            router.push("/hq-staff/login");
        }
    };

    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={{ email: stateData.forgetPassword ? stateData.forgetPassword.username : "" }}
                onSubmit={(values) => {
                    let preparedPayload = values;
                    preparedPayload['username'] = preparedPayload.email.trim();
                    forgot('headquaters', preparedPayload, onForgotSuccess);
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
                                            <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "password_reset")} />
                                        </div>
                                        <div>
                                            <div className="field custom_inputText">
                                                <InputGroup inputGroupProps={{
                                                    inputGroupParentClassName: `w-full ${errors.email && touched.email && 'p-invalid'}`,
                                                    name: 'email',
                                                    id: 'email',
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                    value: values.email,
                                                    labelProps: {
                                                        text: translate(localeJson, 'userId'),
                                                        spanText: "*",
                                                        inputGroupLabelClassName: "mb-2",
                                                        inputGroupLabelSpanClassName: "p-error"
                                                    },
                                                }} />
                                                <ValidationError errorBlock={errors.email && touched.email && errors.email} />
                                            </div>
                                            <div className='flex justify-content-center mt-5'>
                                                <Button buttonProps={{
                                                    type: 'submit',
                                                    text: translate(localeJson, 'send'),
                                                    buttonClass: "update-button custom_radiusBtn w-full",
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

export default ForgotPasswordPage;