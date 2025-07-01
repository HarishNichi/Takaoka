import React, { useContext, useEffect, useState } from 'react';
import { Formik } from "formik";
import * as Yup from "yup";
import { classNames } from 'primereact/utils';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { AuthenticationAuthorizationService,StaffManagementService } from '@/services';
import { toastDisplay, getValueByKeyRecursively as translate } from '@/helper'
import { useAppDispatch } from '@/redux/hooks';
import { setStaffValue } from '@/redux/auth';
import { Button, CustomHeader, ValidationError, Password, InputGroup, InputDropdown } from '@/components';
import { setForgetPassword } from '@/redux/fwd_password';
import _ from 'lodash';

const LoginPage = () => {
    const { layoutConfig, localeJson } = useContext(LayoutContext);
    const router = useRouter();
    const dispatch = useAppDispatch();
    // Getting storage data with help of reducers
    const layoutReducer = useSelector((state) => state.layoutReducer);
      const [placeDropDown, setPlaceDropDown] = useState([]);

    const containerClassName = classNames('auth_surface_ground flex align-items-start justify-content-center overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });
    const schema = Yup.object().shape({
        username: Yup.string()
            .required(translate(localeJson, 'user_id_required'))
            .max(200, translate(localeJson, 'user_id_max')),
        password: Yup.string()
            .required(translate(localeJson, 'password_required'))
            .min(8, translate(localeJson, 'password_atLeast_8_characters'))
            .max(15, translate(localeJson, 'password_max_15_characters')),
        selectedCity: Yup.object().required(translate(localeJson, 'shelter_place_name_required'))
    });

    /* Services */
    const { login } = AuthenticationAuthorizationService;
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        dispatch(setForgetPassword({
            username: ''
        }));
        onGetHistoryPlaceDropdownListOnMounting();
    }, []);

    const onLoginSuccess = (values) => {
        if (AuthenticationAuthorizationService.staffValue) {
            localStorage.setItem('staff', JSON.stringify(values.data));
            dispatch(setStaffValue({
                staff: values.data
            }));
            // if (layoutReducer?.user?.place?.type === "place") {
                router.push("/staff/family");
            // } else {
            //     router.push("/staff/event-staff/dashboard");
            // }
        }
    };

    const validateUserIData = (inputData) => {
        const regexExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!inputData.username || regexExp.test(inputData.username)) {
            dispatch(setForgetPassword({
                username: inputData.username
            }));
            router.push('/staff/forgot-password')
        } else {
            toastDisplay(translate(localeJson, 'contact_admin'), '', '', "error");
        }
    }

     const onGetHistoryPlaceDropdownListOnMounting = () => {
    StaffManagementService.getActivePlaceList(onGetHistoryPlaceDropdownList);
  };

      const onGetHistoryPlaceDropdownList = (response) => {
        let historyPlaceCities = [];
        if (response.success && !_.isEmpty(response.data)) {
          const data = response.data.model.list;
          data.map((obj, i) => {
            let placeDropdownList = {
              name: response.locale == "ja" ? obj.name : (obj.name_en||obj.name),
              name_en: obj.name_en||obj.name,
              name_ja: obj.name,
              code: obj.id,
            };
            historyPlaceCities.push(placeDropdownList);
          });
          setPlaceDropDown(historyPlaceCities);
        }
      };

    return (
        <>
            <Formik
                validationSchema={schema}
                initialValues={{ username: "", password: "",selectedCity:""}}
                onSubmit={(values) => {
                    let preparedPayload = values;
                    let prepareKey = "place_id";
                    preparedPayload[prepareKey] =
                      preparedPayload.selectedCity?.code || null;
                    preparedPayload["username"] =
                      preparedPayload.username.trim();
                    // Find the matching place in the dropdown list
                    const matchedPlace = placeDropDown?.find(
                      (obj) => obj.code == preparedPayload.selectedCity?.code
                    );

                    if (matchedPlace) {
                      // Set place ID
                      localStorage.setItem("place_id", matchedPlace.code);

                      // Set Japanese name (or original)
                      localStorage.setItem(
                        "evacuationPlaceName",
                        matchedPlace.name_ja
                      );

                      // Set English name, fallback to Japanese
                      localStorage.setItem(
                        "evacuationPlaceNameEnglish",
                        matchedPlace.name_en || matchedPlace.name
                      );
                    }

                    login('staff', preparedPayload, onLoginSuccess, prepareKey);
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    setFieldValue
                }) => (
                    <div className={containerClassName}>
                        <div className="flex flex-column align-items-center justify-content-center">
                            <div className="w-full py-2 px-2" >
                                <div className='auth_view py-4 px-4'>
                                    <form onSubmit={handleSubmit}>
                                        <div className="flex justify-content-start w-100 mb-5 auth-header">
                                            <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "staff_login")} />
                                        </div>
                                        <div>
                                            <div className="field custom_inputText">
                                                <InputGroup inputGroupProps={{
                                                    inputGroupParentClassName: `w-full ${errors.username && touched.username && 'p-invalid'}`,
                                                    name: 'username',
                                                    id: 'username',
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                    value: values.username,
                                                    labelProps: {
                                                        text: translate(localeJson, 'userId'),
                                                        spanText: "*",
                                                        inputGroupLabelClassName: "mb-2",
                                                        inputGroupLabelSpanClassName: "p-error"
                                                    },
                                                }} />
                                                <ValidationError errorBlock={errors.username && touched.username && errors.username} />
                                            </div>
                                            <div className="field custom_inputText">
                                                <Password
                                                    passwordProps={{
                                                        passwordParentClassName: `w-full password-form-field ${errors.password && touched.password && 'p-invalid'}`,
                                                        labelProps: {
                                                            text: translate(localeJson, 'password'),
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
                                                <InputDropdown
                                                                  inputDropdownProps={{
                                                                    inputDropdownParentClassName:
                                                                      "w-full",
                                                                    labelProps: {
                                                                      text: translate(localeJson, "shelter_place_name"),
                                                                      inputDropdownLabelClassName: "block",
                                                                    },
                                                                    inputDropdownClassName:
                                                                      "w-full ",
                                                                    customPanelDropdownClassName: "",
                                                                    value: values.selectedCity,
                                                                    options: placeDropDown,
                                                                    optionLabel: "name",
                                                                    onChange: (e) => setFieldValue("selectedCity", e.value),
                                                                    emptyMessage: translate(localeJson, "data_not_found"),
                                                                  }}
                                                                />
                                                                  <ValidationError errorBlock={errors.selectedCity && touched.selectedCity && errors.selectedCity} />
                                                                </div>
                                            <div className='flex justify-content-center mt-5'>
                                                <Button buttonProps={{
                                                    type: 'submit',
                                                    text: translate(localeJson, 'login'),
                                                    buttonClass: "custom_radiusBtn update-button w-full",
                                                }} parentClass={"update-button w-full"} />
                                            </div>
                                            <div className='w-full flex justify-content-center mt-3'>
                                                <Button buttonProps={{
                                                    type: 'button',
                                                    text: translate(localeJson, 'forgot_password_caption'),
                                                    link: "true",
                                                    onClick: () => validateUserIData(values),
                                                }} />
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

export default LoginPage;