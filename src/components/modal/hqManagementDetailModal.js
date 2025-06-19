import React, { useEffect } from "react"
import { useContext, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import _ from 'lodash';

import { Button, NormalTable } from "@/components"; 
import {
    getValueByKeyRecursively as translate,
    getEnglishDateTimeDisplayActualFormat,
    getJapaneseDateTimeDayDisplayActualFormat
} from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { HeadQuarterManagement } from "@/services";

export default function HqManagementDetailModal(props) {
    const { locale, localeJson } = useContext(LayoutContext);
    const columnNames = [
        { field: 'slno', header: translate(localeJson, 'staff_management_detail_login_history_slno'), headerClassName: "sno_class", textAlign: "center", alignHeader: "center" },
        { field: 'f_login_datetime', header: translate(localeJson, 'staff_management_detail_login_history_login_datetime'), maxWidth: "2rem" },
        { field: 'f_logout_datetime', header: translate(localeJson, 'logout_dateTime'), maxWidth: "2rem" },
    ];
    const [columnValues, setColumnValues] = useState([]);
    const columns = [
        { field: 'name', header: translate(localeJson, 'name'), minWidth: "8rem" },
        { field: 'tel', header: translate(localeJson, 'tel'), minWidth: "8rem" },
    ];
    const [values, setValues] = useState([]);
    const { open, close } = props && props;
    const [listPayload, setListPayload] = useState({
        "filters": {
            "start": 0,
        },
        "id": props.detailId
    });
    const [totalCount, setTotalCount] = useState(0);
    const [tableLoading, setTableLoading] = useState(false);

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await callDetailsApi();
        };
        fetchData();
    }, [locale, props.detailId, listPayload]);

    const callDetailsApi = () => {
        HeadQuarterManagement.show(listPayload, (response) => {
            var tempLoginHistory = [];
            var listTotalCount = 0;
            if (response && response?.success && !_.isEmpty(response?.data)) {
                setValues([
                    {
                        name: response.data.model.name,
                        tel: response.data.model.tel
                    }
                ])
                if (response?.data?.login_history?.total > 0) {
                    let loginHistoryResponse = response.data.login_history;
                    loginHistoryResponse.list.forEach((element, index) => {
                        let f_login_datetime = element.login_datetime ? (locale == "ja" ? getJapaneseDateTimeDayDisplayActualFormat(element.login_datetime) : getEnglishDateTimeDisplayActualFormat(element.login_datetime)) : "";
                        let f_logout_datetime = element.logout_datetime ? (locale == "ja" ? getJapaneseDateTimeDayDisplayActualFormat(element.logout_datetime) : getEnglishDateTimeDisplayActualFormat(element.logout_datetime)) : "";
                        let tempObj = { ...element, f_logout_datetime: f_logout_datetime, f_login_datetime: f_login_datetime, slno: index + parseInt(listPayload.filters.start) + 1 }
                        tempLoginHistory.push(tempObj);
                    });
                    listTotalCount = loginHistoryResponse.total;
                }
            }
            setTableLoading(false);
            setColumnValues(tempLoginHistory);
            setTotalCount(listTotalCount);
        });
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
            await setListPayload(prevState => ({
                ...prevState,
                filters: {
                    ...prevState.filters,
                    start: newStartValue,
                    limit: newLimitValue
                }
            }));
        }
    }

    return (
        <React.Fragment>
            <div>
                <Dialog
                    className="new-custom-modal lg:w-6 md:w-9 sm:w-10"
                    header={translate(localeJson, 'history_login_staff_management')}
                    visible={open}
                    draggable={false}
                    blockScroll={true}
                    onHide={() => close()}
                    footer={
                        <div className="text-center">
                            <Button buttonProps={{
                                buttonClass: "w-8rem back-button",
                                text: translate(localeJson, 'back'),
                                onClick: () => close(),
                            }} parentClass={"inline back-button"} />
                        </div>
                    }
                >
                    <div className={`modal-content`}>
                        <div>
                            <div className="modal-header">
                                {translate(localeJson, 'headquarters_staff_administrator_Details')}
                            </div>
                            <div className="modal-field-bottom-space">
                                <NormalTable
                                className={"w-full"}
                                    loading={tableLoading}
                                    showGridlines={"true"}
                                    rowClassName={"text-center"}
                                    customActionsField="actions"
                                    emptyMessage={translate(localeJson, "data_not_found")}
                                    value={values}
                                    columns={columns}
                                />
                            </div>
                            <div >
                                <div>
                                    <NormalTable
                                        stripedRows={true}
                                        className={"custom-table-cell w-full"}
                                        showGridlines={"true"}
                                        columns={columnNames}
                                        value={columnValues}
                                        filterDisplay="menu"
                                        emptyMessage={translate(localeJson, "data_not_found")}
                                        scrollable
                                        scrollHeight="400px"
                                        lazy
                                        totalRecords={totalCount}
                                        loading={tableLoading}
                                        first={listPayload.filters.start}
                                        rows={listPayload.filters.limit}
                                        onPageHandler={(e) => onPaginationChange(e)}
                                    />
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="modal-button-footer-space-back">
                                    <Button buttonProps={{
                                        buttonClass: "w-full back-button",
                                        text: translate(localeJson, 'back'),
                                        onClick: () => close(),
                                    }} parentClass={"back-button"} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </div>
        </React.Fragment>
    );
}