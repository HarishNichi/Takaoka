/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router'
import _ from 'lodash';
import { IoIosArrowBack } from "react-icons/io";
import { FaArrowRightFromBracket } from 'react-icons/fa6';

import { useAppSelector } from "@/redux/hooks";
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
import { Button, NormalTable, CommonDialog, CardSpinner, CustomHeader, AdminManagementDeleteModal } from '@/components';
import { prefecturesCombined } from '@/utils/constant';
import { EvacuationServices } from '@/services';

export default function EvacueeFamilyDetail() {
    const { locale, localeJson,setLoader } = useContext(LayoutContext);
    const router = useRouter();
    const param = useAppSelector((state) => state.familyReducer.family);

    const [tableLoading, setTableLoading] = useState(false);
    const [familyDetailData, setFamilyDetailData] = useState(null);
    const [checkoutVisible, setCheckoutVisible] = useState(false);
    const [familyAdmittedData, setFamilyAdmittedData] = useState(null);
    const [isReg,setIsReg] = useState(false);
    const [getListPayload, setGetListPayload] = useState({
        filters: {
            family_code: "",
            refugee_name: "",
            family_id: param?.family_id
        }
    });
	const [deleteOpen, setDeleteOpen] = useState(false);


    const familyAdmissionColumns = [
        { field: 'shelter_place', header: translate(localeJson, 'shelter_place'), minWidth: "10rem", maxWidth: "12rem" },
        { field: 'place_id', header: translate(localeJson, ''), minWidth: "10rem", display: 'none' },
        { field: 'admission_date_time', header: translate(localeJson, 'admission_date_time'), minWidth: "10rem", textAlign: 'left' },
        { field: 'discharge_date_time', header: translate(localeJson, 'discharge_date_time'), minWidth: "10rem", textAlign: 'left' },
    ];

    /* Services */
    const { getFamilyEvacueesDetail,bulkDelete } = EvacuationServices;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await onGetEvacueesFamilyDetailOnMounting();
        };
        fetchData();
    }, [locale]);

    const onConfirmDeleteRegisteredEvacuees = async () => {
        setTableLoading(true);
        bulkDelete(getListPayload, (res) => {
            if (res) {
                setLoader(false);
                router.push('/admin/evacuation');
            }
            else {
                setLoader(false);
            }

        });
    }
	
	const openDeleteDialog = () => {
        setDeleteOpen(true);
        hideOverFlow();
    }

    const onDeleteClose = (status = '') => {
        if (status == 'confirm') {
            onConfirmDeleteRegisteredEvacuees();
        }
        setDeleteOpen(false);
        showOverFlow();
    };

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
            const historyData = response.data.history.list;
            if (data.length > 0) {
                setIsReg(data[0].family_is_registered == 1 ? true : false);
                data.map((person, index) => {
                    let familyData = {
                        id: index + 1,
                        name: <div className={"text-highlighter-user-list clickable-row"} >{person.person_name}</div>,
                        refugee_name: <div className={"clickable-row"}>{person.person_refugee_name}</div>,
                        gender: getGenderValue(person.person_gender),
                        dob: locale == "ja" ? getJapaneseDateDisplayYYYYMMDDFormat(person.person_dob) : getEnglishDateDisplayFormat(person.person_dob),
                        remarks: person.person_note,
                        family_count: 0,
                        name_phonetic: person.person_refugee_name,
                        name_kanji: person.person_name,
                        address: (person.person_postal_code?translate(localeJson, 'post_letter') + person.person_postal_code:"") + " " + (locale == 'ja' ?(person.person_prefecture_id? prefecturesCombined[person.person_prefecture_id].ja:"") : (person.person_prefecture_id?prefecturesCombined[person.person_prefecture_id].en:"")) + " " + person.person_address + (person.person_address_default ? person.person_address_default : ""),
                        tel: person?.person_tel && person.person_tel != "00000000000" ? person.person_tel : "",
                        evacuation_date_time: person.family_join_date ? ((locale == "ja" ? getJapaneseDateTimeDayDisplayActualFormat(person.family_join_date) : getEnglishDateTimeDisplayActualFormat(person.family_join_date))) : "",
                        place_id: person.place_id,
                        family_is_registered: person.family_is_registered,
                    };
                    familyDataList.push(familyData);
                })
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



    const translationAndObjectKeys = [
        "name_kanji",
        "name_phonetic",
        "dob",
        "gender",
        "tel",
        "address",
    ];

    return (
        <>
         <AdminManagementDeleteModal
                open={deleteOpen}
                close={onDeleteClose}
            />
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
                            text: translate(localeJson, 'de_register'),
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
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <Button buttonProps={{
                            buttonClass: "w-auto back-button-transparent mb-2 p-0",
                            text: translate(localeJson, "return_to_evacuee_list_admin"),
                            icon: <div className='mt-1'><i><IoIosArrowBack size={25} /></i></div>,
                            onClick: () => router.push('/admin/evacuation/'),
                        }} parentClass={"inline back-button-transparent"} />
                        <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "house_hold_information")} />
                        {tableLoading ? (
                            <CardSpinner />
                        ) : familyDetailData && familyDetailData.map((val, i) => ( (
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
                            <Button buttonProps={{
                                buttonClass: "w-10rem exit-procedure-button ",
                                text: translate(localeJson, 'exit_procedures'),
                                icon: <FaArrowRightFromBracket className='mr-1' />,
                                disabled: !isReg,
                                onClick: () => {
                                    if (familyDetailData?.length > 0 && familyDetailData[0].family_is_registered == 1) {
                                        setCheckoutVisible(true)
                                        hideOverFlow();
                                    } else {
                                        return null
                                    }
                                }
                            }} parentClass={"inline exit-procedure-button "} />
                                        <Button buttonProps={{
                                            type: "button",
                                            rounded: "true",
                                            delete: true,
                                            buttonClass: "w-10rem export-button",
                                            disabled:isReg,
                                            text: translate(localeJson, 'delete_confirm'),
                                            severity: "primary",
                                            onClick: () => openDeleteDialog()
                                        }} parentClass={"mt-3 export-button"} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}