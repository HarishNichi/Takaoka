/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useContext, useState } from "react"
import { Dialog } from 'primereact/dialog';
import _ from 'lodash';

import {
    getEnglishDateTimeDisplayActualFormat,
    getJapaneseDateTimeDayDisplayActualFormat,
    getValueByKeyRecursively as translate
} from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { Button, NormalTable } from "@/components"; 
import { AdminManagementServices } from "@/services";

export default function AdminManagementDetailModal(props) {
    const { localeJson, locale } = useContext(LayoutContext);
    const { open, close } = props && props;

    const columnNames = [
        { field: 'slno', header: translate(localeJson, 'staff_management_detail_login_history_slno'), headerClassName: "sno_class", textAlign: "center", alignHeader: "center" },
        { field: 'f_login_datetime', header: translate(localeJson, 'staff_management_detail_login_history_login_datetime'), minWidth: "6rem", maxWidth: "6rem" },
        { field: 'f_logout_datetime', header: translate(localeJson, 'logout_dateTime'), maxWidth: "6rem" },

    ];
    const [columnValues, setColumnValues] = useState([]);
    const columns = [
        { field: 'name', header: translate(localeJson, 'name'), minWidth: "8rem" },
        {
            field: 'tel', header: translate(localeJson, 'tel'), minWidth: "10rem", maxWidth: "10rem", textAlign: "center",
            alignHeader: "center",
        },
    ];
    const [values, setValues] = useState([]);
    const [listPayload, setListPayload] = useState({
        "filters": {
            "start": 0,
        },
        "id": props.detailId
    });
    const [totalCount, setTotalCount] = useState(0);
    const [tableLoading, setTableLoading] = useState(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await callDetailsApi();
        };
        fetchData();
    }, [locale, props.detailId, listPayload]);

    const callDetailsApi = () => {
        AdminManagementServices.show(listPayload, (response) => {
            var tempLoginHistory = [];
            var listTotalCount = 0;
            if (response && response.success && !_.isEmpty(response.data)) {
                setValues([
                    {
                        name: response.data.model.name,
                        password: response.data.model.tel
                    }
                ])
                if (response.data.login_history.total > 0) {
                    let loginHistoryResponse = response.data.login_history;
                    loginHistoryResponse.list.forEach((element, index) => {
                        let f_login_datetime = element.login_datetime ? (locale == "ja" ? getJapaneseDateTimeDayDisplayActualFormat(element.login_datetime) : getEnglishDateTimeDisplayActualFormat(element.login_datetime)) : "";
                        let f_logout_datetime = element.logout_datetime ? (locale == "ja" ? getJapaneseDateTimeDayDisplayActualFormat(element.logout_datetime) : getEnglishDateTimeDisplayActualFormat(element.logout_datetime)) : "";
                        let tempObj = { ...element, f_login_datetime: f_login_datetime, f_logout_datetime: f_logout_datetime, slno: index + parseInt(listPayload.filters.start) + 1 }
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
                                {translate(localeJson, 'admin_management_details')}
                            </div>
                            <div className="modal-field-bottom-space">
                                <NormalTable
                                    loading={tableLoading}
                                    tableStyle={{ maxWidth: "w-full" }}
                                    showGridlines={"true"}
                                    columnStyle={{ textAlign: 'center' }}
                                    customActionsField="actions" value={values}
                                    emptyMessage={translate(localeJson, "data_not_found")}
                                    columns={columns}
                                />
                            </div>
                            <div >
                                <div>
                                    <NormalTable
                                        stripedRows={true}
                                        tableStyle={{ maxWidth: "w-full" }}
                                        className={"custom-table-cell"}
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
                                    }} parentClass={"inline back-button"} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </div>
        </React.Fragment>
    );
}