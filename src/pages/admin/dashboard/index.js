import React, { useState, useEffect, useContext } from 'react';
import _ from 'lodash';
import liff from '@line/liff';

import { NormalTable, DeleteModal, CustomHeader } from '@/components';
import { getValueByKeyRecursively as translate } from '@/helper'
import { LayoutContext } from '@/layout/context/layoutcontext';
import { DashboardServices } from '@/services';
import { default_place_id } from '@/utils/constant';

function AdminDashboard() {
    const { locale, localeJson } = useContext(LayoutContext);
    const [tableLoading, setTableLoading] = useState(false);
    const [columns, setColumns] = useState([]);
    const [list, setList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [frozenArray, setFrozenArray] = useState([]);
    const [getListPayload, setGetListPayload] = useState({
        filters: {
            start: 0,
            limit: 10,
            sort_by: "refugee_name",
            order_by: "asc",
        },
        search: "",
    });

    const columnsData = [
        { field: 'number', header: translate(localeJson, 'number'), headerClassName: "custom-header sno_class", className: "sno_class", textAlign: 'center', alignHeader: "center" },
        { field: 'evacuation_place', header: translate(localeJson, 'evacuation_place'), minWidth: '15rem', maxWidth: "15rem", headerClassName: "custom-header" },
        { field: 'max_capacity', header: translate(localeJson, 'max_capacity'), minWidth: '10rem', headerClassName: "custom-header", textAlign: "center", alignHeader: "center" },
        { field: 'number_of_evacuees', header: translate(localeJson, 'number_of_evacuees_admin_dashboard'), minWidth: '10rem', headerClassName: "custom-header", fontWeight: "bold", textAlign: "center", alignHeader: "center" },
        { field: 'accommodation_rate', header: translate(localeJson, 'accommodation_rate'), minWidth: '7rem', headerClassName: "custom-header", textAlign: "center", alignHeader: "center" },
        { field: 'household', header: translate(localeJson, 'household'), minWidth: '10rem', headerClassName: "custom-header", textAlign: "center", alignHeader: "center" },
        { field: 'number_of_people_count_only', header: translate(localeJson, 'number_of_people_count_only'), minWidth: '15rem', headerClassName: "custom-header", textAlign: "center", alignHeader: "center" },
        { field: 'male', header: translate(localeJson, 'male'), minWidth: '5rem', headerClassName: "custom-header", textAlign: "center", alignHeader: "center" },
        { field: 'female', header: translate(localeJson, 'female'), minWidth: "7rem", headerClassName: "custom-header", textAlign: "center", alignHeader: "center" },
        { field: 'others_count', header: translate(localeJson, 'others_count'), minWidth: "10rem", headerClassName: "custom-header", textAlign: "center", alignHeader: "center" },
        { field: 'remaining_number_people', header: translate(localeJson, 'remaining_number_people'), minWidth: "7rem", headerClassName: "custom-header", textAlign: "center", alignHeader: "center" },
        { field: 'food_assistance', header: translate(localeJson, 'food_assistance'), minWidth: "12rem", headerClassName: "custom-header", textAlign: "center", alignHeader: "center" },
        { field: 'switch_to_full', header: translate(localeJson, 'switch_to_full'), minWidth: "7rem", headerClassName: "custom-header", textAlign: 'center', alignHeader: "center" },
    ]

    /* Services */
    const { getList, updateFullStatus } = DashboardServices;

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await onGetDashboardListOnMounting();
        };
        fetchData();
    }, [locale, getListPayload]);

    useEffect(() => {
        liffInit();
    }, []);

    const liffInit = async () => {
        try {
            await liff.init({ liffId: "2004690501-b20o7NGR" });
            const { userAgent } = navigator;
            let data = {
                isInClient: liff.isInClient(),
                isLoggedIn: liff.isLoggedIn(),
                os: liff.getOS(),
                isInAppBrowser: !liff.isInClient() && userAgent.includes('Line'),
            };
            console.log('LIFF init succeeded.', data);

            if (liff.isLoggedIn()) {
                const profile = await liff.getProfile();
                console.log(profile);
            }
        } catch (error) {
            console.log('LIFF init failed.');
        }
    };

    /**
     * Get dashboard list on mounting
     */
    const onGetDashboardListOnMounting = () => {
        // Get dashboard list
        getList(getListPayload, onGetDashboardList);
    }

    /**
     * Function will get data & update dashboard list
     * @param {*} response 
    */
    const onGetDashboardList = (response) => {
        var additionalColumnsKeys = [];
        var additionalColumnsArrayWithOldData = [...columnsData];
        var preparedList = [];
        var frozenObj = [];
        var listTotalCount = 0;
        var insertIndex = 10;
        if (response?.success && !_.isEmpty(response.data) && response.data.total > 0) {
            const dataOfFirstObj = response.data.list[0].specialCare
            const data = response.data.list;
            // Prepare table dynamic columns
            if (dataOfFirstObj) {
                dataOfFirstObj.map((obj, i) => {
                    let preparedColumnObjToMerge = { field: (locale == "ja" ? obj.name : obj.name_en), header: locale == "ja" ? obj.name : obj.name_en, minWidth: "8rem", headerClassName: "custom-header", textAlign: "center", alignHeader: "center" };
                    additionalColumnsKeys.push(preparedColumnObjToMerge.field);
                    additionalColumnsArrayWithOldData.splice(insertIndex + i, 0, preparedColumnObjToMerge);
                })
            }
            // Preparing row data for specific column to display
            data.map((obj, i) => {
                let preparedObj = {
                    number: getListPayload.filters.start + i + 1,
                    evacuation_place: locale === "en" && !_.isNull(obj.name_en) ? obj.name_en : obj.name,
                    max_capacity: `${obj.total_place}${translate(localeJson, 'people')}`,
                    number_of_evacuees: `${obj.totalPerson + obj.countPerson}${translate(localeJson, 'people')}`,
                    accommodation_rate: obj.full_status == 1 ? "100%" : obj.rateSheltered >= 100 ? "100%" : `${obj.rateSheltered}%`,
                    household: `${obj.countFamily}${translate(localeJson, 'household_title')}`,
                    number_of_people_count_only: `${obj.countPerson}${translate(localeJson, 'people')}`,
                    male: `${obj.countMale}${translate(localeJson, 'people')}`,
                    female: `${obj.countFemale}${translate(localeJson, 'people')}`,
                    others_count: `${obj.countOthers}${translate(localeJson, 'people')}`,
                    remaining_number_people: obj.full_status == 1 ? `0${translate(localeJson, 'people')}` : `${obj.restSheltered}${translate(localeJson, 'people')}`,
                    food_assistance: `${obj.foodRequiredCount}${translate(localeJson, 'people')}`,
                    switch_to_full: action(obj),
                }
                additionalColumnsKeys.map((value, i) => {
                    preparedObj[value] = `${obj.specialCare[i].count}${translate(localeJson, 'people')}`;
                })
                preparedList.push(preparedObj);
            })
            const totalCounts = response.data.totalCounts;
            // Update frozen data
            let preparedFrozenObj = {
                number: "",
                evacuation_place: translate(localeJson, 'total'),
                max_capacity: `${totalCounts.totalMaxCapacity}${translate(localeJson, 'people')}`,
                number_of_evacuees: `${totalCounts.totalEvacueeCount}${translate(localeJson, 'people')}`,
                accommodation_rate: `${totalCounts.averageAccommodationRate}%`,
                household: `${totalCounts.totalHousehold}${translate(localeJson, 'household_title')}`,
                number_of_people_count_only: `${totalCounts.totalPeopleCount}${translate(localeJson, 'people')}`,
                male: `${totalCounts.totalMale}${translate(localeJson, 'people')}`,
                female: `${totalCounts.totalFemale}${translate(localeJson, 'people')}`,
                others_count: `${totalCounts.totalOther}${translate(localeJson, 'people')}`,
                remaining_number_people: `${totalCounts.totalRemainingPeople}${translate(localeJson, 'people')}`,
                food_assistance: `${totalCounts.totalFoodRequiredCount}${translate(localeJson, 'people')}`,
                switch_to_full: "",
            };
            const specialCareCount = response.data.totalSpecialCaresCount;
            additionalColumnsKeys.map((obj, i) => {
                preparedFrozenObj[obj] = `${specialCareCount[obj]}${translate(localeJson, 'people')}`
            })
            frozenObj = [preparedFrozenObj];
            listTotalCount = response.data.total;
        }
        setTableLoading(false);
        setColumns(additionalColumnsArrayWithOldData);
        setList(preparedList);
        setFrozenArray(frozenObj);
        setTotalCount(listTotalCount);
    };

    /**
     * Action column for dashboard list
     * @param {*} obj 
     * @returns 
     */
    const action = (obj) => {
        return (
            <div className='input-switch-parent'>
                <DeleteModal
                    header={translate(localeJson, 'confirmation')}
                    content={translate(localeJson, 'change_active_place')}
                    data={obj}
                    checked={obj.full_status == 1 ? true : false}
                    disabled={default_place_id.includes(obj.id) || false}
                    parentClass={"custom-switch"}
                    cancelButton={true}
                    updateButton={true}
                    cancelButtonClass="w-full font-bold back-button"
                    updateButtonClass="w-full font-bold update-button"
                    updateCalBackFunction={(rowDataReceived) => getDataFromupdateButtonOnClick(rowDataReceived)}
                />
            </div>
        );
    };

    /**
     * Update full status by row id
     * @param {*} rowDataReceived 
     */
    const getDataFromupdateButtonOnClick = (rowDataReceived) => {
        setTableLoading(true);
        if (rowDataReceived) {
            let updateFullStatusPayload = {
                id: rowDataReceived.id
            }
            updateFullStatus(updateFullStatusPayload, onGetDashboardListOnMounting);
        }
    }

    /**
     * Pagination handler
     * @param {*} e 
     */
    const onPaginationChange = async (e) => {
        setTableLoading(true);
        if (!_.isEmpty(e)) {
            const newStartValue = e.first; // Replace with your desired page value
            const newLimitValue = e.rows; // Replace with your desired limit value
            await setGetListPayload(prevState => ({
                ...prevState,
                filters: {
                    ...prevState.filters,
                    start: newStartValue,
                    limit: newLimitValue
                }
            }));
        }
    }

    const rowClassName = (rowData) => {
        return (rowData.evacuation_place === '合計' || rowData.evacuation_place == 'Total') ? 'common_table_bg' : "";
    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "evacuation_status_list")} />

                    <div>
                        <div className='mt-3'>
                            <NormalTable
                                lazy
                                totalRecords={totalCount}
                                parentClass={"custom-table-dashboard"}
                                loading={tableLoading}
                                stripedRows={true}
                                rowClassName={rowClassName}
                                className={"custom-table-cell"}
                                showGridlines={"true"}
                                value={list}
                                frozenValue={_.size(list) > 0 && frozenArray}
                                columns={columns}
                                filterDisplay="menu"
                                emptyMessage={translate(localeJson, "data_not_found")}
                                paginator={true}
                                first={getListPayload.filters.start}
                                rows={getListPayload.filters.limit}
                                paginatorLeft={true}
                                onPageHandler={(e) => onPaginationChange(e)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;