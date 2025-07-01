/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { FaArrowRightFromBracket } from 'react-icons/fa6';
import { IoIosArrowBack } from 'react-icons/io';

import {
    getValueByKeyRecursively as translate,
    getEnglishDateDisplayFormat,
    getJapaneseDateDisplayYYYYMMDDFormat,
    getEnglishDateTimeDisplayActualFormat,
    getJapaneseDateTimeDayDisplayActualFormat,
    getSpecialCareName,
    hideOverFlow,
    showOverFlow,
} from '@/helper'
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, CommonDialog, NormalTable, CardSpinner, CustomHeader } from '@/components';
import { prefecturesCombined } from '@/utils/constant';
import { CommonServices, StaffEvacuationServices } from '@/services';

export default function StaffFamilyDetail() {
    const { locale, localeJson } = useContext(LayoutContext);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const key = process.env.NEXT_PUBLIC_PASSWORD_ENCRYPTION_KEY;
    const { decryptPassword } = CommonServices
    // Getting storage data with help of reducers
    const layoutReducer = useSelector((state) => state.layoutReducer);
    const lgwan_family_id_from_store = useAppSelector((state) => state.familyReducer.family.family_id);

    const [staffFamilyDialogVisible, setStaffFamilyDialogVisible] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [familyBasicDetail, setFamilyBasicDetail] = useState([]);
    const [overallQuestionnaires, setOverallQuestionnaires] = useState([]);
    const [individualQuestionnairesContentIDX, setIndividualQuestionnairesContentIDX] = useState(null);
    const [familyAdmittedData, setFamilyAdmittedData] = useState([]);
    const [personList, setPersonList] = useState([]);
    const [editData, setEditData] = useState([]);
    const [individualQuestionnairesVisible, setIndividualQuestionnairesVisible] = useState(false);

    const param = {
        place_id: localStorage.getItem("place_id"),
        family_id: useAppSelector((state) => state.familyReducer.family.family_id),
    };

    const columnNames = [
        { field: 'slno', header: translate(localeJson, 'si_no'), sortable: false, textAlign: 'center', minWidth: '1rem', maxWidth: '1rem', alignHeader: "left" },
        {
            field: 'person_refugee_name', header: translate(localeJson, 'name_public_evacuee'), sortable: false, alignHeader: "left", maxWidth: "5rem",
            body: (rowData, index) => {
                return <div className="flex flex-column">
                    <div className={"text-highlighter-user-list clickable-row"} onClick={() => {
                        displayIndividualQuestionnaires(index);
                        hideOverFlow();
                    }}>{rowData.person_name}</div>
                    <div className={"clickable-row"} onClick={() => {
                        displayIndividualQuestionnaires(index);
                        hideOverFlow();
                    }}>{rowData.person_refugee_name}</div>
                </div>
            },
        },
        { field: "dob", header: translate(localeJson, 'dob'), headerClassName: "custom-header", sortable: false, textAlign: 'left', alignHeader: "left", minWidth: '3rem', maxWidth: '3rem' },
        { field: "person_age", header: translate(localeJson, 'age'), headerClassName: "custom-header", sortable: false, textAlign: 'center', alignHeader: "center", minWidth: '3rem', maxWidth: '3rem' },
        { field: "gender", header: translate(localeJson, 'gender'), headerClassName: "custom-header", sortable: false, textAlign: 'left', alignHeader: "left", minWidth: '3rem', maxWidth: '3rem' },
        { field: "special_care_name", header: translate(localeJson, 'c_special_care'), sortable: false, textAlign: 'left', alignHeader: "left", minWidth: '3rem', maxWidth: '3rem' },
        { field: 'is_owner', header: translate(localeJson, 'representative'), textAlign: 'left', alignHeader: "left", minWidth: '3.5rem', maxWidth: '3.5rem' },
    ];

    /**
     * Show individual questionnaires dialog
     * @param {*} index 
     */
    const displayIndividualQuestionnaires = (data) => {
        setIndividualQuestionnairesContentIDX(data.rowIndex);
        setIndividualQuestionnairesVisible(true);
    }

    const familyAdmissionColumns = [
        { field: 'place_name', header: translate(localeJson, 'shelter_place'), minWidth: "10rem", maxWidth: "12rem" },
        { field: 'place_id', header: translate(localeJson, ''), minWidth: "10rem", display: 'none' },
        { field: 'checkin', header: translate(localeJson, 'admission_date_time'), minWidth: "12rem", textAlign: 'left' },
        { field: 'checkout', header: translate(localeJson, 'discharge_date_time'), minWidth: "12rem", textAlign: 'left' },
    ];

    /* Services */
    const { updateCheckoutDetail } = StaffEvacuationServices;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await onGetEvacueesFamilyDetailOnMounting();
        };
        fetchData();
    }, [locale]);

    const getGenderValue = (gender) => {
        if (gender == 1) {
            return translate(localeJson, 'male');
        } else if (gender == 2) {
            return translate(localeJson, 'female');
        } else {
            return translate(localeJson, 'others_count');
        }
    }

    const onGetEvacueesFamilyDetailOnMounting = () => {
        StaffEvacuationServices.getStaffPermanantEvecueesDetail(
            param, getEvacueesFamilyDetail)
    }

    const getEvacueesFamilyDetail = (response) => {
        let tempOverallQuestion = [];
        let tempIndividualQuestion = [];
        let overallAnswers = {};
        if (response) {
            if (response.data.data.length > 0) {
                let data = convertToOriginalFormat(response.data)
                setEditData(data);
                let responseList = response.data.data;
                let tempList = [];
                if (response.data.individualQuestions.length > 0) {
                    tempIndividualQuestion = [...response.data.individualQuestions];
                    if (tempIndividualQuestion.length > 1) {
                        tempIndividualQuestion.sort((a, b) => {
                            return a.display_order - b.display_order;
                        });
                    }
                }
                if (response.data.overallQuestions.length > 0) {
                    tempOverallQuestion = [...tempOverallQuestion, ...response.data.overallQuestions];
                    if (tempOverallQuestion.length > 1) {
                        tempOverallQuestion.sort((a, b) => {
                            return a.display_order - b.display_order;
                        });
                    }
                }
                responseList.forEach((tempObj, index) => {
                    let personAnswers = {};
                    if (tempObj.person_answers.length > 0) {
                        tempObj.person_answers.forEach((val, index) => {
                            personAnswers[val.question_id] = locale == "ja" ? val.answer.join(', ') : val.answer_en.join(', ');
                        });
                    }

                    let withIndividualQuestionAnswer = tempIndividualQuestion.map((val, index) => {
                        return { ...val, actual_answer: personAnswers[val.id] }
                    })

                    let newObj = {
                        ...tempObj,
                        slno: index + 1,
                        gender: getGenderValue(tempObj.person_gender),
                        dob: locale == "ja" ? getJapaneseDateDisplayYYYYMMDDFormat(tempObj.person_dob) : getEnglishDateDisplayFormat(tempObj.person_dob),
                        special_care_name: tempObj.person_special_cares ? getSpecialCareName(tempObj.person_special_cares, locale) : "",
                        connecting_code: tempObj.person_connecting_code,
                        is_owner: tempObj.person_is_owner == 0 ? translate(localeJson, 'representative') : "",
                        address: (tempObj.person_postal_code?translate(localeJson, 'post_letter') + tempObj.person_postal_code:"") + " " + (locale == 'ja' ?(tempObj.person_prefecture_id? prefecturesCombined[tempObj.person_prefecture_id].ja:"") : (tempObj.person_prefecture_id?prefecturesCombined[tempObj.person_prefecture_id].en:"")) + " " + tempObj.person_address + (tempObj.person_address_default ? tempObj.person_address_default : ""),
                        evacuation_date_time: locale == "ja" ? getJapaneseDateDisplayYYYYMMDDFormat(tempObj.family_join_date) : getEnglishDateDisplayFormat(tempObj.family_join_date),
                        tel: tempObj?.person_tel && tempObj.person_tel != "00000000000" ? tempObj.person_tel : "",
                        remarks: tempObj.person_note,
                        withIndividualQuestionAnswer: withIndividualQuestionAnswer,
                        yapple_id: tempObj.yapple_id,
                    }
                    tempList.push(newObj);
                });
                setPersonList(tempList);
                setFamilyBasicDetail(tempList);
                if (response.data.data[0].family_answers.length > 0) {
                    response.data.data[0].family_answers.forEach((val, index) => {
                        overallAnswers[val.question_id] = locale == "ja" ? val.answer.join(', ') : val.answer_en.join(', ');
                    });
                }
            }
            let withOverallQuestionAnswer = tempOverallQuestion.map((val, index) => {
                return { ...val, actual_answer: overallAnswers[val.id] }
            })
            setOverallQuestionnaires(withOverallQuestionAnswer);
            if (response.data.history.list.length > 0) {
                const formattedDates = response.data.history.list.map(item => {
                    const formattedCheckin = item.checkin && (locale === "ja" ? getJapaneseDateTimeDayDisplayActualFormat(item.checkin) : getEnglishDateTimeDisplayActualFormat(item.checkin));
                    const formattedCheckout = item.checkout && (locale === "ja" ? getJapaneseDateTimeDayDisplayActualFormat(item.checkout) : getEnglishDateTimeDisplayActualFormat(item.checkout));

                    return {
                        place_id: item.place_id,
                        place_name: item.place_name,
                        checkin: formattedCheckin,
                        checkout: formattedCheckout,
                    };
                });

                setFamilyAdmittedData(formattedDates);
            }
        }
        setTableLoading(false);
    }

    function convertToOriginalFormat(convertedData) {
        const getAnswerById = (id, answers) => {
            const answer = answers?.length > 0 ? answers?.find((ans) => ans.question_id == id) : [];
            return answer ? answer?.answer : [];
        };
        const getAnswerByIdEn = (id, answers) => {
            const answer = answers?.length > 0 ? answers?.find((ans) => ans.question_id == id) : [];
            return answer ? answer?.answer_en || answer?.answer : [];
        };
        let decryptedData = ""; //convertedData.data[0].family_password ? decryptPassword(convertedData.data[0].family_password, key) : ""
        const originalData = {
            data: [
                {
                    evacuee_date: convertedData.data[0].family_join_date,
                    postalCode: convertedData.data[0].family_zip_code ? convertedData.data[0].family_zip_code.replace(/-/g, "") : "",
                    prefecture_id: convertedData.data[0].family_prefecture_id,
                    address: convertedData.data[0].family_address,
                    address2: convertedData.data[0].family_address_default,
                    evacuee: convertedData.data.map((evacueeData, index) => {
                        const individualQuestions = convertedData.individualQuestions.map(
                            (question) => {
                                return {
                                    id: question.id,
                                    event_id: question.event_id,
                                    type: question.type,
                                    title: question.title,
                                    title_en: question.title_en,
                                    options: question.options,
                                    options_en: question.options_en,
                                    display_order: question.display_order,
                                    isRequired: question.isRequired,
                                    isVoiceRequired: question.isVoiceRequired,
                                    isVisible: question.isVisible,
                                    created_at: question.created_at,
                                    updated_at: question.updated_at,
                                    deleted_at: question.deleted_at,
                                    answer: getAnswerById(
                                        question.id,
                                        evacueeData.person_answers
                                    ),
                                    answer_en: getAnswerByIdEn(
                                        question.id,
                                        evacueeData.person_answers
                                    ),
                                };
                            }
                        ).sort((a, b) => parseInt(a.display_order) - parseInt(b.display_order));
                        const birthDate = new Date(evacueeData.person_dob);
                        const convertedObject = {
                            year: birthDate.getFullYear(),
                            month: (birthDate.getMonth() + 1).toString().padStart(2, ""), // Adding 1 because months are zero-based
                            date: birthDate.getDate().toString().padStart(2, ""),
                        };
                        return {
                            "person_id": evacueeData.person_id,
                            family_register_from: evacueeData.family_register_from,
                            id: index + 1, //evacueeData.family_id,
                            checked: evacueeData.person_is_owner == "0" ? true : false,
                            name: evacueeData.person_name,
                            name_furigana: evacueeData.person_refugee_name||"",
                            dob: convertedObject,
                            age: evacueeData.person_age,
                            age_m: evacueeData.person_month,
                            gender: evacueeData.person_gender,
                            postalCode: evacueeData.person_postal_code ? evacueeData.person_postal_code.replace(/-/g, "") : "",
                            prefecture_id: evacueeData.person_prefecture_id,
                            address: evacueeData.person_address,
                            address2: evacueeData.person_address_default,
                            tel: evacueeData.person_tel,
                            specialCareType: evacueeData.person_special_cares.map(item => String(item.id)), //evacueeData.person_special_cares,
                            connecting_code: evacueeData.person_connecting_code,
                            remarks: evacueeData.person_note,
                            individualQuestions: individualQuestions,
                        };
                    }),
                    tel: convertedData.data[0].person_tel,
                    password: decryptedData || "",
                    questions: convertedData.overallQuestions.map((question) => {
                        return {
                            id: question.id,
                            event_id: question.event_id,
                            type: question.type,
                            title: question.title,
                            title_en: question.title_en,
                            options: question.options,
                            options_en: question.options_en,
                            display_order: question.display_order,
                            isRequired: question.isRequired,
                            isVoiceRequired: question.isVoiceRequired,
                            isVisible: question.isVisible,
                            created_at: question.created_at,
                            updated_at: question.updated_at,
                            deleted_at: question.deleted_at,
                            answer: getAnswerById(
                                question.id,
                                convertedData.data[0].family_answers
                            ),
                            answer_en: getAnswerByIdEn(
                                question.id,
                                convertedData.data[0].family_answers
                            ),
                        };
                    }).sort((a, b) => parseInt(a.display_order) - parseInt(b.display_order)),
                    agreeCheckOne:
                        convertedData.data[0].family_is_public == 1 ? false : true,
                    agreeCheckTwo:
                        convertedData.data[0].family_public_info == 1 ? false : true,
                    name_furigana: convertedData.data[0].person_refugee_name,
                    name_kanji: convertedData.data[0].person_name,
                    family_id: convertedData.data[0].family_id,
                },
            ],
        };
        return originalData;
    }

    /**
     * CommonDialog modal close
     */
    const onClickCancelButton = () => {
        setStaffFamilyDialogVisible(false);
    };

    /**
     * CommonDialog modal open
     */
    const onClickOkButton = () => {
        let preparedParam = {
            family_id: lgwan_family_id_from_store,
            place_id: familyBasicDetail.length > 0 && familyBasicDetail[0].place_id
        };
        updateCheckoutDetail(preparedParam, (response) => {
            setStaffFamilyDialogVisible(false);
            if (response.success) {
                router.push("/staff/family");
            }
        });
    };

    return (
        <>
            <CommonDialog
                open={staffFamilyDialogVisible}
                dialogBodyClassName="p-3 text-center"
                header={translate(localeJson, 'confirmation')}
                content={
                    <div>
                        <p>{translate(localeJson, 'do_you_want_to_exit_the_shelter')}</p>
                    </div>
                }
                position={"center"}
                footerParentClassName={"text-center"}
                footerButtonsArray={[
                    {
                        buttonProps: {
                            buttonClass: "w-full del_ok-button",
                            type: "submit",
                            text: translate(localeJson, 'de_register'),
                            onClick: () => {
                                onClickOkButton();
                                showOverFlow();
                            },
                        },
                        parentClass: "del_ok-button modal-button-footer-space"
                    },
                    {
                        buttonProps: {
                            buttonClass: "w-full back-button",
                            text: translate(localeJson, 'cancel'),
                            onClick: () => {
                                onClickCancelButton();
                                showOverFlow();
                            },
                        },
                        parentClass: "back-button"
                    },
                ]}
                close={() => {
                    setStaffFamilyDialogVisible(false);
                }}
            />
            <CommonDialog
                open={individualQuestionnairesVisible}
                dialogClassName={"p-0"}
                dialogBodyClassName="p-0 custom-dialog-background"
                footerButtonsArray={[
                    {
                        buttonProps: {
                            buttonClass: "w-full back-button",
                            text: translate(localeJson, "cancel"),
                            onClick: () => {
                                setIndividualQuestionnairesVisible(false);
                                showOverFlow();
                            },
                        },
                        parentClass: "back-button modal-button-footer-space-back",
                    },
                ]}
                content={
                    (personList && personList.length > 0 && !_.isNull(individualQuestionnairesContentIDX)) && (
                        <>
                            <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "house_hold_information")} />
                            <div className='custom-card-info-with-zIndex p-2 my-3'>
                                <div className='flex align-items-center'>
                                    <div >
                                        <span className='page-header3'>{translate(localeJson, "name_kanji")}:</span>
                                        <span className='page-header3-sub ml-1 details-text-overflow'>{personList[individualQuestionnairesContentIDX].person_name}</span>
                                    </div>
                                </div>
                                <div className='flex align-items-center'>
                                    <div >
                                        <span className='page-header3'>{translate(localeJson, "name_phonetic")}:</span>
                                        <span className='page-header3-sub ml-1 details-text-overflow'>{personList[individualQuestionnairesContentIDX].person_refugee_name}</span>
                                    </div>
                                </div>
                                <div className='flex align-items-center'>
                                    <div >
                                        <span className='page-header3'>{translate(localeJson, "dob")}:</span>
                                        <span className='page-header3-sub ml-1 details-text-overflow'>{locale == "ja" ? getJapaneseDateDisplayYYYYMMDDFormat(personList[individualQuestionnairesContentIDX].person_dob) : getEnglishDateDisplayFormat(personList[individualQuestionnairesContentIDX].person_dob)}</span>
                                    </div>
                                </div>
                                <div className='flex align-items-center'>
                                    <div >
                                        <span className='page-header3'>{translate(localeJson, "age")}:</span>
                                        <span className='page-header3-sub ml-1 details-text-overflow'>{personList[individualQuestionnairesContentIDX].person_age}</span>
                                    </div>
                                </div>
                                <div className='flex align-items-center'>
                                    <div >
                                        <span className='page-header3'>{translate(localeJson, "age_month")}:</span>
                                        <span className='page-header3-sub ml-1 details-text-overflow'>{personList[individualQuestionnairesContentIDX].person_month}</span>
                                    </div>
                                </div>
                                <div className='flex align-items-center'>
                                    <div >
                                        <span className='page-header3'>{translate(localeJson, "gender")}:</span>
                                        <span className='page-header3-sub ml-1 details-text-overflow'>{personList[individualQuestionnairesContentIDX].gender}</span>
                                    </div>
                                </div>
                                <div className='flex align-items-center'>
                                    <div >
                                        <span className='page-header3'>{translate(localeJson, "tel")}:</span>
                                        <span className='page-header3-sub ml-1 details-text-overflow'>{personList[individualQuestionnairesContentIDX].tel}</span>
                                    </div>
                                </div>

                                <div className='flex align-items-center'>
                                    <div >
                                        <span className='page-header3'>{translate(localeJson, "address")}:</span>
                                        <span className='page-header3-sub ml-1 details-text-overflow'>{personList[individualQuestionnairesContentIDX].address}</span>
                                    </div>
                                </div>
                                <div className='hidden align-items-center'>
                                    <div >
                                        <span className='page-header3'>{translate(localeJson, "evacuation_date_time")}:</span>
                                        <span className='page-header3-sub ml-1 details-text-overflow'>{personList[individualQuestionnairesContentIDX].evacuation_date_time}</span>
                                    </div>
                                </div>
                                <div className='flex align-items-center'>
                                    <div >
                                        <span className='page-header3'>{translate(localeJson, "family_code")}:</span>
                                        <span className='page-header3-sub ml-1 details-text-overflow'>{personList[individualQuestionnairesContentIDX].family_code}</span>
                                    </div>
                                </div>
                                <div className='hidden flex align-items-center'>
                                    <div >
                                        <span className='page-header3'>{translate(localeJson, "connecting_code")}:</span>
                                        <span className='page-header3-sub ml-1 details-text-overflow'>{personList[individualQuestionnairesContentIDX].connecting_code}</span>
                                    </div>
                                </div>
                                <div className='flex align-items-center'>
                                    <div >
                                        <span className='page-header3'>{translate(localeJson, "remarks")}:</span>
                                        <span className='page-header3-sub ml-1 details-text-overflow'>{personList[individualQuestionnairesContentIDX].remarks}</span>
                                    </div>
                                </div>
                                <div className='flex align-items-center'>
                                    <div >
                                        <span className='page-header3'>{translate(localeJson, "c_special_care")}: </span>
                                        <span className='page-header3-sub ml-1 details-text-overflow'>{personList[individualQuestionnairesContentIDX].special_care_name}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3">
                                <CustomHeader className="mt-2" headerClass={"page-header1"} header={translate(localeJson, "question_and_answer_information_individual")} />
                                {(personList[individualQuestionnairesContentIDX].withIndividualQuestionAnswer && personList[individualQuestionnairesContentIDX].withIndividualQuestionAnswer.length > 0) && (
                                    <div className='custom-card-info my-3'>
                                        {personList[individualQuestionnairesContentIDX].withIndividualQuestionAnswer.map((val, i) => (
                                            <div className='flex align-items-center' key={i}>
                                                <div >
                                                    <span className='page-header3'>{locale == 'ja' ? val.title : val.title_en}</span>
                                                    <span className={val.isRequired == 1 ? "p-error" : "hidden"}>*</span><span className='font-bold'>:</span>
                                                    <span className='page-header3-sub ml-1 details-text-overflow'>{val.actual_answer}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )
                }
                position={"center"}
                close={() => {
                    setIndividualQuestionnairesVisible(false);
                    showOverFlow()
                }}
            />
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <Button buttonProps={{
                            buttonClass: "w-auto back-button-transparent mb-2 p-0",
                            text: translate(localeJson, "return_to_evacuee_list"),
                            icon: <div className='mt-1'><i><IoIosArrowBack size={25} /></i></div>,
                            onClick: () => router.push('/staff/family/'),
                        }} parentClass={"inline back-button-transparent"} />
                        <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "house_hold_information_details")} />
                        <div>
                            <div className='mb-2'>
                            </div>
                            {tableLoading ? (
                                <CardSpinner />
                            ) : (personList && personList.length > 0) && personList.map((person, index) => {
                                return person.person_is_owner == 0 ? (
                                    <div className='custom-card-info-with-zIndex p-2 my-3' key={index}>
                                        <div className='flex align-items-center'>
                                            <div className='details-text-overflow'>
                                                <span className='page-header3'>{translate(localeJson, "name_kanji")}:</span>
                                                <span className='page-header3-sub ml-1'>{person.person_name}</span>
                                            </div>
                                        </div>
                                        <div className='flex align-items-center'>
                                            <div className='details-text-overflow'>
                                                <span className='page-header3'>{translate(localeJson, "name_phonetic")}:</span>
                                                <span className='page-header3-sub ml-1'>{person.person_refugee_name}</span>
                                            </div>
                                        </div>
                                        <div className='flex align-items-center'>
                                            <div className='details-text-overflow'>
                                                <span className='page-header3'>{translate(localeJson, "dob")}:</span>
                                                <span className='page-header3-sub ml-1'>{locale == "ja" ? getJapaneseDateDisplayYYYYMMDDFormat(person.person_dob)
                                                    :
                                                    getEnglishDateDisplayFormat(person.person_dob)}</span>
                                            </div>
                                        </div>
                                        <div className='flex align-items-center'>
                                            <div className='details-text-overflow'>
                                                <span className='page-header3'>{translate(localeJson, "age")}:</span>
                                                <span className='page-header3-sub ml-1'>{person.person_age}</span>
                                            </div>
                                        </div>
                                        <div className='flex align-items-center'>
                                            <div className='details-text-overflow'>
                                                <span className='page-header3'>{translate(localeJson, "age_month")}:</span>
                                                <span className='page-header3-sub ml-1'>{person.person_month}</span>
                                            </div>
                                        </div>
                                        <div className='flex align-items-center'>
                                            <div className='details-text-overflow'>
                                                <span className='page-header3'>{translate(localeJson, "gender")}:</span>
                                                <span className='page-header3-sub ml-1'>{person.gender}</span>
                                            </div>
                                        </div>
                                        <div className='flex align-items-center'>
                                            <div className='details-text-overflow'>
                                                <span className='page-header3'>{translate(localeJson, "tel")}:</span>
                                                <span className='page-header3-sub ml-1'>{person.tel}</span>
                                            </div>
                                        </div>
                                        <div className='flex align-items-center'>
                                            <div className='details-text-overflow'>
                                                <span className='page-header3'>{translate(localeJson, "address")}:</span>
                                                <span className='page-header3-sub ml-1'>{person.address}</span>
                                            </div>
                                        </div>
                                        <div className='hidden align-items-center'>
                                            <div className='details-text-overflow'>
                                                <span className='page-header3'>{translate(localeJson, "evacuation_date_time")}:</span>
                                                <span className='page-header3-sub ml-1'>{person.evacuation_date_time}</span>
                                            </div>
                                        </div>
                                        <div className='flex align-items-center'>
                                            <div className='details-text-overflow'>
                                                <span className='page-header3'>{translate(localeJson, "family_code")}:</span>
                                                <span className='page-header3-sub ml-1'>{person.family_code}</span>
                                            </div>
                                        </div>
                                        <div className=' hidden flex align-items-center'>
                                            <div className='details-text-overflow'>
                                                <span className='page-header3'>{translate(localeJson, "connecting_code")}:</span>
                                                <span className='page-header3-sub ml-1'>{person.connecting_code}</span>
                                            </div>
                                        </div>

                                        <div className='flex align-items-center'>
                                            <div className='details-text-overflow'>
                                                <span className='page-header3'>{translate(localeJson, "remarks")}:</span>
                                                <span className='page-header3-sub ml-1'>{person.remarks}</span>
                                            </div>
                                        </div>
                                        <div className='flex align-items-center'>
                                            <div className='details-text-overflow'>
                                                <span className='page-header3'>{translate(localeJson, "c_special_care")}:</span>
                                                <span className='page-header3-sub ml-1'>{person.special_care_name}</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : <></>;
                            })}
                            <div className='section-space'>
                                <div className='mb-2'>
                                    <CustomHeader headerClass={"page-header2"} header={translate(localeJson, "household_list")} />
                                </div>
                                <NormalTable
                                    lazy
                                    id={"evacuation-list"}
                                    className="evacuation-list"
                                    loading={tableLoading}
                                    size={"small"}
                                    stripedRows={true}
                                    paginator={false}
                                    showGridlines={"true"}
                                    value={personList}
                                    columns={columnNames}
                                    emptyMessage={translate(localeJson, "data_not_found")}
                                />
                            </div>
                            <div className="section-space">
                                <CustomHeader className="mt-2" headerClass={"page-header1"} header={translate(localeJson, "question_and_answer_information_overall")} />
                                {tableLoading ? (
                                    <CardSpinner />
                                ) : (overallQuestionnaires && overallQuestionnaires.length > 0) && (
                                    <div className='custom-card-info my-3'>
                                        {overallQuestionnaires.map((val, i) => (
                                            <div className='flex align-items-center' key={i}>
                                                <div className='details-text-overflow'>
                                                    <span className='page-header3'>{locale == 'ja' ? val.title : val.title_en}</span>
                                                    <span className={val.isRequired == 1 ? "p-error" : "hidden"}>*</span><span className='font-bold'>:</span>
                                                    <span className='page-header3-sub ml-1'>{val.actual_answer}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className='section-space'>
                                <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "checkin_checkout_history")} />
                                <div className='mt-2 flex overflow-x-auto'>
                                    <NormalTable
                                        id="evacuee-family-detail"
                                        size={"small"}
                                        loading={tableLoading}
                                        emptyMessage={translate(localeJson, "data_not_found")}
                                        stripedRows={true}
                                        paginator={false}
                                        showGridlines={true}
                                        value={familyAdmittedData}
                                        columns={familyAdmissionColumns}
                                    />
                                </div>
                            </div>
                            <div className='flex flex-column mt-3 mb-2 justify-content-center align-items-center justify-content-center flex-wrap'>
                                {/* <Button buttonProps={{
                                    buttonClass: "w-10rem delete-button",
                                    text: translate(localeJson, 'edit_staff_detail'),
                                    icon: <FiEdit2 className='mr-1' />,
                                    onClick: () => {
                                        dispatch(setOriginalData(editData.data[0]));
                                        dispatch(setIsEdit(true))
                                        let isMobile = mobileCheck();
                                        localStorage.setItem("isCamera",isMobile?"true":"false");
                                        localStorage.setItem("isScanner", "false");
                                        router.push("/staff/family/edit")
                                    }
                                }} parentClass={"mr-1 update-button "} /> */}
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    buttonClass: "w-10rem ",
                                    text: translate(localeJson, 'exit_procedures'),
                                    icon: <FaArrowRightFromBracket className='mr-1' />,
                                    onClick: () => setStaffFamilyDialogVisible(true)
                                }} parentClass={"mt-3 exit-procedure-button"} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}