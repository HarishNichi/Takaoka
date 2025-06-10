import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router'
import _ from 'lodash';
import { IoIosArrowBack } from "react-icons/io";

import {
    getValueByKeyRecursively as translate,
    getJapaneseDateDisplayYYYYMMDDFormat,
    getEnglishDateDisplayFormat,
    getJapaneseDateTimeDayDisplayActualFormat,
    getEnglishDateTimeDisplayActualFormat,
    getSpecialCareName,
    showOverFlow,
    hideOverFlow,
} from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, NormalTable, CommonDialog, CardSpinner, CustomHeader } from '@/components';
import { useAppSelector } from "@/redux/hooks";
import { prefecturesCombined } from '@/utils/constant';
import { EvacuationServices } from '@/services';

export default function EvacueeFamilyDetail() {
    const { locale, localeJson } = useContext(LayoutContext);
    const router = useRouter();
    const param = useAppSelector((state) => state.familyReducer.family);

    const [tableLoading, setTableLoading] = useState(false);
    const [familyDetailData, setFamilyDetailData] = useState(null);
    const [checkoutVisible, setCheckoutVisible] = useState(false);
    const [individualQuestionnairesVisible, setIndividualQuestionnairesVisible] = useState(false);
    const [individualQuestionnairesContentIDX, setIndividualQuestionnairesContentIDX] = useState(null);
    const [overallQuestionnaires, setOverallQuestionnaires] = useState([]);
    const [familyAdmittedData, setFamilyAdmittedData] = useState(null);

    const evacueeFamilyDetailColumns = [
        { field: "id", header: translate(localeJson, 'number'), sortable: false, headerClassName: "sno_class", textAlign: "left", alignHeader: "left" },
        {
            field: 'name', header: translate(localeJson, 'name_public_evacuee'), sortable: false, alignHeader: "left",maxWidth: '4rem',
            body: (rowData) => {
                return <div className="flex flex-column">
                    <div className="custom-header">{rowData.name}</div>
                    <div className="table-body-sub">{rowData.refugee_name}</div>
                </div>
            },
        },
        { field: "dob", header: translate(localeJson, 'dob'), sortable: false, textAlign: 'left', alignHeader: "left", minWidth: '3rem', maxWidth: '3rem' },
        { field: "age", header: translate(localeJson, 'age'), sortable: false, textAlign: 'center', alignHeader: "center", minWidth: '3rem', maxWidth: '3rem' },
        { field: "gender", header: translate(localeJson, 'gender'), sortable: false, textAlign: 'left', alignHeader: "left", minWidth: '3rem', maxWidth: '3rem' },
        { field: "c_special_care", header: translate(localeJson, 'c_special_care'), sortable: false, textAlign: 'left', alignHeader: "left", minWidth: '3rem', maxWidth: '3rem' },
        { field: "yapple_id", header: translate(localeJson, 'yapple_id'), sortable: false, textAlign: 'left', alignHeader: "left", minWidth: '3rem', maxWidth: '3rem' },
        { field: 'is_owner', header: translate(localeJson, 'representative'), sortable: false, textAlign: 'left', alignHeader: "left", minWidth: '3rem', maxWidth: '3rem' },
    ];

    const familyAdmissionColumns = [
        { field: 'shelter_place', header: translate(localeJson, 'shelter_place'), minWidth: "10rem", maxWidth: "12rem" },
        { field: 'place_id', header: translate(localeJson, ''), minWidth: "10rem", display: 'none' },
        { field: 'admission_date_time', header: translate(localeJson, 'admission_date_time'), minWidth: "10rem", textAlign: 'left' },
        { field: 'discharge_date_time', header: translate(localeJson, 'discharge_date_time'), minWidth: "10rem", textAlign: 'left' },
    ];

    /* Services */
    const { getFamilyEvacueesDetail } = EvacuationServices;

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await onGetEvacueesFamilyDetailOnMounting();
        };
        fetchData();
    }, [locale]);

    const onGetEvacueesFamilyDetailOnMounting = () => {
        getFamilyEvacueesDetail(param, getEvacueesFamilyDetail)
    }

    const getEvacueesFamilyDetail = (response) => {
        var familyDataList = [];
        var listOfIndividualQuestions = [];
        var listOfOverallQuestions = [];
        var admittedHistory = [];
        if (response.success && !_.isEmpty(response.data)) {
            const data = response.data.data;
            const individualQuestionArray = response.data.individualQuestions;
            const overallQuestionArray = response.data.overallQuestions;
            const historyData = response.data.history.list;
            if (individualQuestionArray.length > 0) {
                individualQuestionArray.map((ques) => {
                    let data = {
                        id: ques.id,
                        question: (locale == "ja" ? ques.title : ques.title_en),
                        is_required: ques.isRequired,
                        display_order: ques.display_order
                    };
                    listOfIndividualQuestions.push(data);
                });
                if (listOfIndividualQuestions.length > 1) {
                    listOfIndividualQuestions.sort((a, b) => {
                        return a.display_order - b.display_order;
                    });
                }
            }
            if (data.length > 0) {
                data.map((person, index) => {
                    let familyData = {
                        id: index + 1,
                        name: <div className={"text-highlighter-user-list clickable-row"} onClick={() => {
                            displayIndividualQuestionnaires(index);
                            hideOverFlow();
                        }}>{person.person_name}</div>,
                        refugee_name: <div className={"clickable-row"} onClick={() => {
                            displayIndividualQuestionnaires(index);
                            hideOverFlow();
                        }}>{person.person_refugee_name||""}</div>,
                        gender: getGenderValue(person.person_gender),
                        dob: locale == "ja" ? getJapaneseDateDisplayYYYYMMDDFormat(person.person_dob) : getEnglishDateDisplayFormat(person.person_dob),
                        age: person.person_age,
                        age_month: person.person_month,
                        c_special_care: person.person_special_cares ? getSpecialCareName(person.person_special_cares, locale) : "",
                        connecting_code: person.person_connecting_code,
                        remarks: person.person_note,
                        family_count: 0,
                        is_owner: person.person_is_owner == 0 ? translate(localeJson, 'representative') : "",
                        family_code: person.family_code,
                        name_phonetic: person.person_refugee_name,
                        name_kanji: person.person_name,
                        address: (person.person_postal_code?translate(localeJson, 'post_letter') + person.person_postal_code:"") + " " + (locale == 'ja' ?(person.person_prefecture_id? prefecturesCombined[person.person_prefecture_id].ja:"") : (person.person_prefecture_id?prefecturesCombined[person.person_prefecture_id].en:"")) + " " + person.person_address + (person.person_address_default ? person.person_address_default : ""),
                        tel: person?.person_tel && person.person_tel != "00000000000" ? person.person_tel : "",
                        evacuation_date_time: person.family_join_date ? ((locale == "ja" ? getJapaneseDateTimeDayDisplayActualFormat(person.family_join_date) : getEnglishDateTimeDisplayActualFormat(person.family_join_date))) : "",
                        place_id: person.place_id,
                        family_is_registered: person.family_is_registered,
                        yapple_id: person.yapple_id
                    };
                    let personAnswers = person.person_answers;
                    if (listOfIndividualQuestions.length > 0) {
                        let preparedListOfIndividualQuestions = [...listOfIndividualQuestions];
                        preparedListOfIndividualQuestions.map((question) => {
                            let indexOfMatchingAnswer = personAnswers.length > 0 && personAnswers.find(answer => answer.question_id == question.id);
                            question['answer'] = indexOfMatchingAnswer ? getAnswerData(locale == "ja" ? indexOfMatchingAnswer.answer : indexOfMatchingAnswer.answer_en) : "";
                        })
                        familyData['individualQuestionnaires'] = preparedListOfIndividualQuestions;
                    }
                    familyDataList.push(familyData);
                })
            }
            if (overallQuestionArray.length > 0) {
                overallQuestionArray.map((ques) => {
                    let data = {
                        id: ques.id,
                        question: (locale == "ja" ? ques.title : ques.title_en),
                        is_required: ques.isRequired,
                        display_order: ques.display_order
                    };
                    listOfOverallQuestions.push(data);
                });
                if (listOfOverallQuestions.length > 1) {
                    listOfOverallQuestions.sort((a, b) => {
                        return a.display_order - b.display_order;
                    });
                }
                if (data.length > 0 && data[0].family_answers.length > 0) {
                    let familyAnswers = data[0].family_answers;
                    listOfOverallQuestions.map((question, i) => {
                        let indexOfMatchingAnswer = familyAnswers.find(answer => answer.question_id == question.id);
                        question['answer'] = indexOfMatchingAnswer ? getAnswerData(locale == "ja" ? indexOfMatchingAnswer.answer : indexOfMatchingAnswer.answer_en) : "";
                    })
                }
            }
            if (historyData.length > 0) {
                historyData.map((item) => {
                    let historyItem = {
                        place_id: item.place_id,
                        shelter_place: item.place_name,
                        admission_date_time: item.checkin && (locale == "ja" ? getJapaneseDateTimeDayDisplayActualFormat(item.checkin) : getEnglishDateTimeDisplayActualFormat(item.checkin)),
                        discharge_date_time: item.checkout && (locale == "ja" ? getJapaneseDateTimeDayDisplayActualFormat(item.checkout) : getEnglishDateTimeDisplayActualFormat(item.checkout)),
                    };
                    admittedHistory.push(historyItem);
                });
            }
        }
        setTableLoading(false);
        setFamilyDetailData(familyDataList);
        setOverallQuestionnaires(listOfOverallQuestions);
        setFamilyAdmittedData(admittedHistory);
    }

    const getGenderValue = (gender) => {
        if (gender == 1) {
            return translate(localeJson, 'male');
        } else if (gender == 2) {
            return translate(localeJson, 'female');
        } else {
            return translate(localeJson, 'others_count');
        }
    }

    const getAnswerData = (answer) => {
        let answerData = null;
        answer.map((item) => {
            answerData = answerData ? (answerData + ", " + item) : item
        });
        return answerData;
    }

    /**
     * Show individual questionnaires dialog
     * @param {*} index 
     */
    const displayIndividualQuestionnaires = (index) => {
        setIndividualQuestionnairesContentIDX(index);
        setIndividualQuestionnairesVisible(true);
    }

    const translationAndObjectKeys = [
        "name_kanji",
        "name_phonetic",
        "dob",
        "age",
        "age_month",
        "gender",
        "tel",
        "address",
        "family_code",
        "remarks",
        "c_special_care",
        "yapple_id"
    ];

    return (
        <>
            <CommonDialog
                open={checkoutVisible}
                dialogBodyClassName=""
                header={translate(localeJson, "confirmation")}
                content={
                    <div className="text-center">
                        {translate(localeJson, "do_you_want_to_exit_the_shelter")}
                    </div>
                }
                position={"center"}
                footerParentClassName={"text-center"}
                footerButtonsArray={[
                    {
                        buttonProps: {
                            buttonClass: "w-full del_ok-button",
                            text: translate(localeJson, 'submit'),
                            onClick: () => {
                                let preparedParam = { ...param, place_id: familyDetailData.length > 0 && familyDetailData[0].place_id };
                                EvacuationServices.evacuationCheckout(preparedParam, (response) => {
                                    setCheckoutVisible(false);
                                    showOverFlow();
                                    if (response.success) {
                                        router.push('/admin/evacuation/');
                                    }
                                })
                            },
                        },
                        parentClass: "del_ok-button modal-button-footer-space",
                    },
                    {
                        buttonProps: {
                            buttonClass: "w-full back-button",
                            text: translate(localeJson, "cancel"),
                            onClick: () => {
                                setCheckoutVisible(false);
                                showOverFlow();
                            },
                        },
                        parentClass: "back-button",
                    },
                ]}
                close={() => {
                    setCheckoutVisible(false);
                    showOverFlow();
                }}
            />
            {/* Individual questionnaires dialog */}
            <CommonDialog
                open={individualQuestionnairesVisible}
                dialogClassName={"p-0"}
                dialogBodyClassName="custom-dialog-background"
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
                    familyDetailData && !_.isNull(individualQuestionnairesContentIDX) && (
                        <div>
                            <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "house_hold_information")} />
                            <div className='custom-card-info-with-zIndex p-2 my-3'>
                                {
                                    translationAndObjectKeys && translationAndObjectKeys.map((objectKey, ind) => (
                                        <div className='flex align-items-center' key={ind}>
                                            <div className='details-text-overflow'>
                                                <span className='page-header3'>{translate(localeJson, objectKey)}: </span>
                                                <span >{familyDetailData[individualQuestionnairesContentIDX][objectKey]}</span>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                            <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "question_and_answer_information_individual")} />
                            <div className='custom-card-info-with-zIndex p-2 my-3 details-text-overflow'>
                                {familyDetailData[individualQuestionnairesContentIDX].individualQuestionnaires && familyDetailData[individualQuestionnairesContentIDX].individualQuestionnaires.map((val, i) => (
                                    <div className='flex align-items-center' key={i}>
                                        <div><span className='page-header3'>{val.question}<span className={val.is_required == 1 ? "p-error" : "hidden"}>*</span><span className='font-bold'>:</span></span> {val.answer}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }
                position={"center"}
                close={() => {
                    setIndividualQuestionnairesVisible(false);
                    showOverFlow();
                }}
            />
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <Button buttonProps={{
                            buttonClass: "w-auto back-button-transparent mb-2 p-0",
                            text: translate(localeJson, "return_to_evacuee_list_admin"),
                            icon: <div className='mt-1'><i><IoIosArrowBack size={25} /></i></div>,
                            onClick: () => router.push('/hq-staff/evacuation/'),
                        }} parentClass={"inline back-button-transparent"} />
                        <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "house_hold_information")} />
                        {tableLoading ? (
                            <CardSpinner />
                        ) : familyDetailData && familyDetailData.map((val, i) => (
                            val.is_owner === translate(localeJson, 'representative') && (
                                <div className='custom-card-info my-3' key={i}>
                                    {
                                        translationAndObjectKeys
                                        && translationAndObjectKeys
                                            .map((objectKey, ind) => (
                                                <div className='flex align-items-center' key={ind}>
                                                    <div className='details-text-overflow'>
                                                        <span className='page-header3'>{translate(localeJson, objectKey)}: </span>
                                                        <span>{val[objectKey]}</span>
                                                    </div>
                                                </div>
                                            ))
                                    }
                                </div>
                            )
                        ))}
                        <div className='section-space'>
                            <div>
                                <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "household_list")} />
                            </div>
                            <NormalTable
                                id="evacuation-detail-list"
                                size={"small"}
                                loading={tableLoading}
                                emptyMessage={translate(localeJson, "data_not_found")}
                                stripedRows={true}
                                paginator={false}
                                showGridlines={true}
                                value={familyDetailData}
                                columns={evacueeFamilyDetailColumns}
                                parentClass="custom-table my-4"
                            />
                        </div>
                        <div className='section-space'>
                            <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "question_and_answer_information_overall")} />
                            {tableLoading ? (
                                <CardSpinner />
                            ) : overallQuestionnaires.length > 0 && (
                                <div className='custom-card-info my-3'>
                                    {overallQuestionnaires.map((val, i) => (
                                        <div className='flex align-items-center' key={i}>
                                            <div className='details-text-overflow'>
                                                <span className='page-header3'>{val.question}
                                                    <span className={val.is_required == 1 ? "p-error" : "hidden"}>*</span><span className='font-bold'>:</span>
                                                </span>
                                                <span className='page-header3-sub ml-1'>{val.answer}</span>
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
                    </div>
                </div>
            </div>
        </>
    )
}
