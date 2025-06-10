import React, { useContext, useState, useEffect } from "react"
import { Dialog } from 'primereact/dialog';
import { Formik } from "formik";
import * as Yup from "yup";
import _ from "lodash";
import { TabView, TabPanel } from 'primereact/tabview';

import { Button, NormalTable, Input, Password, ValidationError } from "@/components";
import {
    convertToSingleByte,
    getValueByKeyRecursively as translate
} from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { CommonServices, StaffManagementService } from "@/services";
import { useAppSelector } from "@/redux/hooks";

export default function StaffManagementEditModal(props) {
    const { localeJson, locale } = useContext(LayoutContext);
    const { open, close, currentEditObj } = props && props;
    // Getting storage data with help of reducers
    const layoutReducer = useAppSelector((state) => state.layoutReducer);

    const columnsData = [
        {
            selectionMode: "multiple",
            textAlign: "center",
            alignHeader: "center",
            minWidth: "4rem",
            maxWidth: "4rem",
            className: "action_class",
        },
        { field: 'name', header: translate(localeJson, 'questionnaire_name'), headerClassName: "custom-header", minWidth: "12rem", maxWidth: "12rem" },
    ]
    const columnsData2 = [
        {
            selectionMode: "multiple",
            textAlign: "center",
            alignHeader: "center",
            minWidth: "4rem",
            maxWidth: "4rem",
            className: "action_class",
        },
        { field: 'name', header: translate(localeJson, 'place_name'), headerClassName: "custom-header", minWidth: "12rem", maxWidth: "12rem" },
    ]
    const [tableLoading, setTableLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [columns, setColumns] = useState([]);
    const [columns1, setColumns1] = useState([]);
    const [eventList, setEventList] = useState([]);
    const [placeList, setPlaceList] = useState([]);
    const [getPayload, setPayload] = useState({
        filters: {
            start: 0,
            limit: 10,
            sort_by: "id",
            order_by: "asc",
        },
        search: "",
    });
    const [rowClick, setRowClick] = useState(true);
    const [selectedEvents, setSelectedEvents] = useState(null);
    const [selectedPlaces, setSelectedPlaces] = useState(null);
    const isEmail = (value) => {
        // Check if the value includes '@' and matches the email pattern
        return !value.includes('@') || /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value);
    };
    const schema = Yup.object().shape({
        username: Yup.string()
            .required(translate(localeJson, 'user_id_required'))
            .max(100, translate(localeJson, 'user_id_max_100'))
            .test('is-email', translate(localeJson, 'user_id_email'), isEmail),
        name: Yup.string()
            .required(translate(localeJson, 'staff_name_required'))
            .max(100, translate(localeJson, 'staff_name_max_required')),
        tel: Yup.string()
            .nullable()
            .test(
                "starts-with-zero",
                translate(localeJson, "phone_num_start"),
                (value) => {
                    if (value) {
                        value = convertToSingleByte(value);
                        return value.charAt(0) === "0";
                    }
                    return true; // Return true for empty values or use .required() in schema to enforce non-empty strings
                }
            )
            .test("matches-pattern", translate(localeJson, "phone"), (value) => {
                if (value) {
                    const singleByteValue = convertToSingleByte(value);
                    return /^[0-9]{10,11}$/.test(singleByteValue);
                }
                else {
                    return true;
                }
            }),
        password: Yup.string()
            .required(translate(localeJson, "new_password_required"))
            .min(8, translate(localeJson, "new_password_min_length"))
            .max(15, translate(localeJson, "new_password_max_length"))
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]+$/,
                translate(localeJson, "new_password_format")
            ),
    });

    /** Services */
    const { getStaffEventListWithActiveStatus } = CommonServices;
    const { getActivePlaceList } = StaffManagementService;

    useEffect(() => {
        setSelectedEvents(currentEditObj?.event_id)
        setSelectedPlaces(currentEditObj?.place_id)
    }, [locale, props])

    useEffect(() => {
        fetchData()
    }, [locale, props]);

    useEffect(() => {
        if (props.currentEditObj?.event_id) {
            let eventIds = props.currentEditObj?.event_id;
            let selectedEventValues = eventIds?.map(id => findEventById(id));
            setSelectedEvents(selectedEventValues)
        }
        if (props.currentEditObj?.place_id) {
            let placeIds = props.currentEditObj?.place_id;
            let selectedPlaceValues = placeIds?.map(id => findPlaceById(id));
            setSelectedPlaces(selectedPlaceValues)
        }
        else {
            setSelectedEvents([]);
            setSelectedPlaces([]);
        }
    }, [eventList, placeList, props])
    const resetAndCloseForm = (callback) => {
        close();
        callback();
        props.refreshList();
    }

    const fetchData = () => {
        getStaffEventListWithActiveStatus({}, (response) => {
            if (response?.success && !_.isEmpty(response.data)) {
                const data = response.data.model;
                var additionalColumnsArrayWithOldData = [...columnsData];
                let preparedList = [];
                // Sort such that active items are on top
                const sortedData = data.sort((a, b) => b.is_active - a.is_active);
                sortedData.map((obj, i) => {
                    let preparedObj = {
                        index: getPayload.filters.start + i,
                        id: obj.id,
                        name: locale === "en" && !_.isNull(obj.name_en) ? obj.name_en : obj.name,
                        is_active: obj.is_active,
                    };
                    preparedList.push(preparedObj);
                });
                setEventList(preparedList);
                setColumns(additionalColumnsArrayWithOldData);
                setTotalCount(response.data.model.total);
                setTableLoading(false);
            }
            else {
                setEventList([]);
                setTotalCount(0);
                setTableLoading(false);
            }
        })

        getActivePlaceList((response) => {
            if (response?.success && !_.isEmpty(response.data)) {
                const data = response.data.model.list;
                // const filteredData = data.filter(item => item.active_flg == 1);
                var additionalColumnsArrayWithOldData = [...columnsData2];
                let preparedList = [];
                // Sort such that active items are on top
                const sortedData = data.sort((a, b) => b.active_flg - a.active_flg);
                sortedData.map((obj, i) => {
                    let preparedObj = {
                        index: getPayload.filters.start + i,
                        id: obj.id,
                        name: locale === "en" && !_.isNull(obj.name_en) ? obj.name_en : obj.name,
                        is_active: obj.is_active,
                        active_flg: obj.active_flg,
                    };
                    preparedList.push(preparedObj);
                });
                setPlaceList(preparedList);
                setColumns1(additionalColumnsArrayWithOldData);
                setTableLoading(false);
            }
            else {
                setPlaceList([]);

                setTableLoading(false);
            }
        })
    }

    const findPlaceById = (id) => {
        return placeList.find(place => place.id === id);
    };

    const findEventById = (id) => {
        return eventList.find(place => place.id === id);
    };

    const rowClass = (data) => {
        return {
            'highlight-row-event': !data.is_active || data.is_active === false || data.is_active == false
        };
    };

    const rowClassForClass = (data) => {
        console.log(data);
        return {
            'highlight-row-event': data.active_flg === 0 || data.active_flg == 0
        };
    };

    return (
        <>
            <Formik
                initialValues={props.currentEditObj}
                validationSchema={schema}
                enableReinitialize={true}
                onSubmit={(values, { resetForm }) => {
                    values.event_id = selectedEvents.length > 0 ? selectedEvents.filter(item => item && item.id).map(item => item.id) : [];
                    values.place_id = selectedPlaces.length > 0 ? selectedPlaces.filter(item => item && item.id).map(item => item.id) : [];
                    values.tel = convertToSingleByte(values.tel);
                    props.register(values)
                    resetAndCloseForm(resetForm);
                    setSelectedEvents([]);
                    setSelectedPlaces([]);
                    return false;
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    resetForm
                }) => (
                    <div>
                        <form onSubmit={handleSubmit}>
                            <Dialog
                                className={`new-custom-modal h-full`}
                                header={props.registerModalAction == 'create' ? translate(localeJson, 'add_staff_management') : translate(localeJson, 'edit_staff_management')}
                                visible={open}
                                draggable={false}
                                blockScroll={true}
                                onHide={() => {
                                    resetForm();
                                    close();
                                    setSelectedEvents([]);
                                    setSelectedPlaces([]);
                                }}
                                footer={
                                    <div className="text-center">
                                        <Button buttonProps={{
                                            buttonClass: "w-8rem back-button",
                                            text: translate(localeJson, 'cancel'),
                                            onClick: () => {
                                                resetForm();
                                                close();
                                                setSelectedEvents([]);
                                                setSelectedPlaces([]);
                                            },
                                        }} parentClass={"inline back-button"} />
                                        <Button buttonProps={{
                                            buttonClass: "w-8rem update-button",
                                            type: "submit",
                                            text: props.registerModalAction == 'create' ? translate(localeJson, 'submit') : translate(localeJson, 'update'),
                                            onClick: () => {
                                                handleSubmit();
                                            },
                                        }} parentClass={"inline update-button"} />
                                    </div>
                                }
                            >
                                <div className={`modal-content staff_modal`}>
                                    <div className="modal-header">
                                        {props.registerModalAction == 'create' ? translate(localeJson, 'add_staff_management') : translate(localeJson, 'edit_staff_management')}
                                    </div>
                                    <TabView scrollable>
                                        <TabPanel header={translate(localeJson, 'staff_information')}>
                                            <div className="">
                                                <div className="modal-field-bottom-space">
                                                    <Input
                                                        inputProps={{
                                                            inputParentClassName: `${errors.name && touched.name && 'p-invalid pb-1'}`,
                                                            labelProps: {
                                                                text: translate(localeJson, 'name'),
                                                                inputLabelClassName: "block",
                                                                spanText: "*",
                                                                inputLabelSpanClassName: "p-error",
                                                                labelMainClassName: "modal-label-field-space"
                                                            },
                                                            inputClassName: "w-full",
                                                            id:"name",
                                                            name: "name",
                                                            value: values && values.name,
                                                            onChange: handleChange,
                                                            onBlur: handleBlur,
                                                        }}
                                                    />
                                                    <ValidationError errorBlock={errors.name && touched.name && errors.name} />
                                                </div>
                                                <div className="modal-field-bottom-space">
                                                    <Input
                                                        inputProps={{
                                                            inputParentClassName: `${errors.username && touched.username && 'p-invalid pb-1'}`,
                                                            labelProps: {
                                                                text: translate(localeJson, 'userId'),
                                                                inputLabelClassName: "block",
                                                                spanText: "*",
                                                                inputLabelSpanClassName: "p-error",
                                                                labelMainClassName: "modal-label-field-space"
                                                            },
                                                            inputClassName: "w-full",
                                                            id:"username",
                                                            name: "username",
                                                            value: values && values.username,
                                                            onChange: handleChange,
                                                            onBlur: handleBlur,
                                                        }}
                                                    />
                                                    <ValidationError errorBlock={errors.username && touched.username && errors.username} />
                                                </div>
                                                <div className="modal-field-bottom-space">
                                                    <Password
                                                        passwordProps={{
                                                            passwordParentClassName: `w-full ${errors.password && touched.password && 'p-invalid pb-1'}`,
                                                            labelProps: {
                                                                text: translate(localeJson, 'password'),
                                                                spanText: "*",
                                                                passwordLabelSpanClassName: "p-error",
                                                                passwordLabelClassName: "block",
                                                                labelMainClassName: "modal-label-field-space"
                                                            },
                                                            name: 'password',
                                                            value: values.password,
                                                            onChange: handleChange,
                                                            onBlur: handleBlur,
                                                            style: { width: "100%" },
                                                            passwordClass: "w-full"
                                                        }}
                                                    />
                                                    <ValidationError errorBlock={errors.password && touched.password && errors.password} />
                                                </div>
                                                <div className="modal-field-bottom-space">
                                                    <Input
                                                        inputProps={{
                                                            inputParentClassName: `${errors.tel && touched.tel && 'p-invalid pb-1'}`,
                                                            labelProps: {
                                                                text: translate(localeJson, 'tel'),
                                                                inputLabelClassName: "block",
                                                                labelMainClassName: "modal-label-field-space"
                                                            },
                                                            inputClassName: "w-full",
                                                            id:"tel",
                                                            name: 'tel',
                                                            value: values && values.tel,
                                                            onChange: handleChange,
                                                            onBlur: handleBlur,
                                                        }}
                                                    />
                                                    <ValidationError errorBlock={errors.tel && touched.tel && errors.tel} />
                                                </div>
                                            </div>
                                        </TabPanel>
                                        {layoutReducer?.layout?.config?.ADMIN_STAFF_MANAGAMENT_EVENT_MAP && (
                                            <TabPanel header={translate(localeJson, 'event_information')}>
                                                <div className="">
                                                    <div className="">
                                                        <NormalTable
                                                            className={"custom-table-cell"}
                                                            selection={selectedEvents}
                                                            onSelectionChange={(e) => setSelectedEvents(e.value)}
                                                            selectionMode={rowClick ? null : "checkbox"}
                                                            tableStyle={{ maxWidth: "100%" }}
                                                            showGridlines={"true"}
                                                            value={eventList}
                                                            columns={columnsData}
                                                            filterDisplay="menu"
                                                            rowClassName={rowClass}
                                                        />
                                                    </div>
                                                </div>
                                            </TabPanel>
                                        )}
                                        <TabPanel header={translate(localeJson, 'place_information')}>
                                            <div className="">
                                                <div className="">
                                                    <NormalTable
                                                        className={"custom-table-cell"}
                                                        selection={selectedPlaces}
                                                        onSelectionChange={(e) => setSelectedPlaces(e.value)}
                                                        selectionMode={rowClick ? null : "checkbox"}
                                                        tableStyle={{ maxWidth: "100%" }}
                                                        showGridlines={"true"}
                                                        value={placeList}
                                                        columns={columnsData2}
                                                        filterDisplay="menu"
                                                        rowClassName={rowClassForClass}
                                                    />
                                                </div>
                                            </div>
                                        </TabPanel>
                                    </TabView>
                                    <div className="text-center">
                                        <div className="modal-button-footer-space">
                                            <Button buttonProps={{
                                                buttonClass: "w-full update-button",
                                                type: "submit",
                                                text: props.registerModalAction == 'create' ? translate(localeJson, 'submit') : translate(localeJson, 'update'),
                                                onClick: () => {
                                                    handleSubmit();
                                                },
                                            }} parentClass={"update-button"} />
                                        </div>
                                        <div>
                                            <Button buttonProps={{
                                                buttonClass: "w-full back-button",
                                                text: translate(localeJson, 'cancel'),
                                                onClick: () => {
                                                    resetForm();
                                                    close();
                                                    setSelectedEvents([]);
                                                    setSelectedPlaces([]);
                                                },
                                            }} parentClass={"back-button"} />
                                        </div>
                                    </div>
                                </div>
                            </Dialog>
                        </form>
                    </div>
                )}
            </Formik >
        </>
    );
}