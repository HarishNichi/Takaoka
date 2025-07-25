/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
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
    const [familyAdmittedData, setFamilyAdmittedData] = useState([]);
    const [personList, setPersonList] = useState([]);

    const param = {
        place_id: localStorage.getItem("place_id"),
        family_id: useAppSelector((state) => state.familyReducer.family.family_id),
    };



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
                let responseList = response.data.data;
                let tempList = [];
                responseList.forEach((tempObj, index) => {

                    let newObj = {
                        ...tempObj,
                        slno: index + 1,
                        gender: getGenderValue(tempObj.person_gender),
                        dob: locale == "ja" ? getJapaneseDateDisplayYYYYMMDDFormat(tempObj.person_dob) : getEnglishDateDisplayFormat(tempObj.person_dob),
                        address: (tempObj.person_postal_code?translate(localeJson, 'post_letter') + tempObj.person_postal_code:"") + " " + (locale == 'ja' ?(tempObj.person_prefecture_id? prefecturesCombined[tempObj.person_prefecture_id].ja:"") : (tempObj.person_prefecture_id?prefecturesCombined[tempObj.person_prefecture_id].en:"")) + " " + tempObj.person_address + (tempObj.person_address_default ? tempObj.person_address_default : ""),
                        evacuation_date_time: locale == "ja" ? getJapaneseDateDisplayYYYYMMDDFormat(tempObj.family_join_date) : getEnglishDateDisplayFormat(tempObj.family_join_date),
                        tel: tempObj?.person_tel && tempObj.person_tel != "00000000000" ? tempObj.person_tel : "",
                        remarks: tempObj.person_note,
                        departMent: tempObj.person_dept_id ? tempObj.person_dept_id : "",
                    }
                    tempList.push(newObj);
                });
                setPersonList(tempList);
                setFamilyBasicDetail(tempList);
            }
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
            employee_code_id: lgwan_family_id_from_store,
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
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <Button buttonProps={{
                            buttonClass: "w-auto back-button-transparent mb-2 p-0",
                            text: translate(localeJson, "return_to_evacuee_list"),
                            icon: <div className='mt-1'><i><IoIosArrowBack size={25} /></i></div>,
                            onClick: () => router.push('/staff/family/'),
                        }} parentClass={"inline back-button-transparent"} />
                        <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "employee_information")} />
                        <div>
                            <div className='mb-2'>
                            </div>
                            {tableLoading ? (
                                <CardSpinner />
                            ) : (personList && personList.length > 0) && personList.map((person, index) => {
                                return (
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
                                        <div className='flex align-items-center'>
                                            <div className='details-text-overflow'>
                                                <span className='page-header3'>{translate(localeJson, "department")}:</span>
                                                <span className='page-header3-sub ml-1'>{person.departMent}</span>
                                            </div>
                                        </div>
                                        <div className='hidden align-items-center'>
                                            <div className='details-text-overflow'>
                                                <span className='page-header3'>{translate(localeJson, "evacuation_date_time")}:</span>
                                                <span className='page-header3-sub ml-1'>{person.evacuation_date_time}</span>
                                            </div>
                                        </div>

                                        <div className='hidden flex align-items-center'>
                                            <div className='details-text-overflow'>
                                                <span className='page-header3'>{translate(localeJson, "remarks")}:</span>
                                                <span className='page-header3-sub ml-1'>{person.remarks}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
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