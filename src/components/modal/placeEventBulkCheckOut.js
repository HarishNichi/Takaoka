import React, { useContext, useState, useEffect } from "react"
import { Dialog } from 'primereact/dialog';
import _ from "lodash";

import { Button, NormalTable } from "@/components";
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { BulkCheckoutService } from "@/services";

export default function PlaceEventBulkCheckOut(props) {
    const { localeJson, locale } = useContext(LayoutContext);
    const { open, close, modalHeaderText } = props && props;

    const [columnValues, setColumnValues] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [rowClick, setRowClick] = useState(true);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [listPayload, setListPayload] = useState({
        "filters": {
            "start": "",
            "limit": "",
            "sort_by": "id",
            "order_by": "asc"
        }
    });
    const columnNames = [
        {
            selectionMode: "multiple",
            textAlign: "center",
            alignHeader: "center",
            minWidth: "4rem",
            maxWidth: "4rem",
            className: "action_class",
        },
        { field: 'definedName', header: props.type == 'events' ? translate(localeJson, 'event_bulk_checkout_column_name') : translate(localeJson, 'place_event_bulk_checkout_column_name'), headerClassName: "custom-header", minWidth: "12rem", maxWidth: "12rem" },
    ]

    useEffect(() => {
        if (open) {
            listApiCall();
        }
    }, [open]);

    const listApiCall = () => {
        setTableLoading(true);
        if (props.type == "places") {
            BulkCheckoutService.getPlacesList((data) => {
                if (data) {
                    let actualList = data.data.model;
                    actualList.map((obj, i) => {
                        return obj.definedName = locale === "en" && !_.isNull(obj.name_en) ? obj.name_en : obj.name
                    })
                    setColumnValues(actualList);
                }
                setTableLoading(false);
            });
        } else if (props.type == "events") {
            BulkCheckoutService.getEventsList(listPayload, (data) => {
                if (data) {
                    let actualList = data.data.model;
                    actualList.map((obj, i) => {
                        return obj.definedName = locale === "en" && !_.isNull(obj.name_en) ? obj.name_en : obj.name
                    })
                    setColumnValues(actualList);
                }
                setTableLoading(false);
            });
        }
    }

    const bulkCheckout = () => {
        if (selectedProducts.length > 0) {
            let tempIds = [];
            selectedProducts.forEach((item) => {
                tempIds.push(item.id);
            });
            if (props.type == "places") {
                BulkCheckoutService.checkoutBulkPlaces({ place_ids: tempIds }, () => {
                    close();
                    setSelectedProducts(null);
                    if (props.onBulkCheckoutSuccess) {
                        props.onBulkCheckoutSuccess();
                    }
                })
            } else if (props.type == "events") {
                BulkCheckoutService.checkoutBulkEvents({ event_ids: tempIds }, () => {
                    close();
                    setSelectedProducts(null);
                    if (props.onBulkCheckoutSuccess) {
                        props.onBulkCheckoutSuccess();
                    }
                })
            }

        }
    }

    return (
        <React.Fragment>
            <div>
                <Dialog
                    className={`new-custom-modal`}
                    header={modalHeaderText}
                    visible={open}
                    draggable={false}
                    blockScroll={true}
                    onHide={() => {
                        close();
                    }}
                    footer={
                        <div className="text-center">
                            <div className="modal-header">
                                <Button buttonProps={{
                                    buttonClass: "w-full update-button",
                                    type: "submit",
                                    text: translate(localeJson, 'update'),
                                    onClick: () => {
                                        bulkCheckout();
                                    },
                                }} parentClass={"update-button"} />
                            </div>
                            <div>
                                <Button buttonProps={{
                                    buttonClass: "w-full back-button",
                                    text: translate(localeJson, 'cancel'),
                                    onClick: () => {
                                        close();
                                        setSelectedProducts(null);
                                    },
                                }} parentClass={"back-button"} />
                            </div>
                        </div>
                    }
                >
                    <div className={`modal-content staff_modal`}>
                        <div className="">
                            <div className="modal-header">
                                {modalHeaderText}
                            </div>
                            <div className="">
                                <NormalTable
                                    className={"custom-table-cell"}
                                    selection={selectedProducts}
                                    onSelectionChange={(e) => setSelectedProducts(e.value)}
                                    selectionMode={rowClick ? null : "checkbox"}
                                    tableStyle={{ maxWidth: "w-full" }}
                                    value={columnValues}
                                    columns={columnNames}
                                    emptyMessage={translate(localeJson, "data_not_found")}
                                    loading={tableLoading}
                                    filterDisplay="menu"
                                />
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="modal-button-footer-space">
                                <Button buttonProps={{
                                    buttonClass: "w-full update-button",
                                    type: "submit",
                                    text: translate(localeJson, 'update'),
                                    onClick: () => {
                                        bulkCheckout();
                                    },
                                }} parentClass={"update-button"} />
                            </div>
                            <div>
                                <Button buttonProps={{
                                    buttonClass: "w-full back-button",
                                    text: translate(localeJson, 'cancel'),
                                    onClick: () => {
                                        close();
                                        setSelectedProducts(null);
                                    },
                                }} parentClass={"back-button"} />
                            </div>
                        </div>
                    </div>
                </Dialog>
            </div>
        </React.Fragment>
    );
}