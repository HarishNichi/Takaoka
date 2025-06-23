import React, { useState, useEffect, useContext } from 'react';
import _ from 'lodash';

import { hideOverFlow, showOverFlow, getValueByKeyRecursively as translate } from '@/helper';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Button, CustomHeader, NormalTable, Input, AdminManagementDeleteModal, AdminManagementImportModal, StaffManagementDetailModal, StaffManagementEditModal } from '@/components';
import { CommonServices, StaffManagementService } from '@/services';

export default function StaffManagementPage() {
    const { localeJson, locale } = useContext(LayoutContext);

    const [staff, setStaff] = useState(null);
    const [importStaffOpen, setImportStaffOpen] = useState(false);
    const [staffDetailsOpen, setStaffDetailsOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editStaffOpen, setEditStaffOpen] = useState(false);
    const [createStaffOpen, setCreateStaffOpen] = useState(false);
    const [searchName, setSearchName] = useState("");
    const [registerModalAction, setRegisterModalAction] = useState('');
    let blankStaffObj = { username: "", tel: "", name: "", password: "", event_id: "", place_id: "" };
    const [currentEditObj, setCurrentEditObj] = useState(blankStaffObj);
    const [deleteId, setDeleteId] = useState(null);
    const [deleteObj, setDeleteObj] = useState(null);
    const [list, setList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [tableLoading, setTableLoading] = useState(false);
    const [getListPayload, setGetListPayload] = useState({
        "filters": {
            "start": 0,
            "limit": 10,
            "order_by": "desc",
            "sort_by": "updated_at"
        },
        "name": ""
    });

    const { decryptPassword } = CommonServices;

    const openDeleteDialog = (rowdata) => {
        setDeleteId(rowdata.id);
        setDeleteObj({
            firstLabel: translate(localeJson, 'name'),
            firstValue: rowdata.name,
            secondLabel: translate(localeJson, 'userId'),
            secondValue: rowdata.username
        });
        setDeleteOpen(true);
        hideOverFlow();
    }

    const onDeleteClose = (action = "close") => {
        if (action == "confirm") {
            setTableLoading(true);
            StaffManagementService.delete(deleteId, (resData) => {
                getStaffList()
            });
        }
        setDeleteOpen(false);
        showOverFlow();
    };

    const PasswordColumn = ({ rowData }) => {
        const [showPassword, setShowPassword] = useState(false);
        return (
            <span
                onMouseEnter={() => setShowPassword(true)}
                onMouseLeave={() => setShowPassword(false)}
            >
                {showPassword ? rowData.password : "********"}
            </span>
        );
    };

    const columnsData = [
        { field: 'slno', header: translate(localeJson, 'header_slno'), headerClassName: "sno_class", textAlign: "center" },
        {
            field: 'name', header: translate(localeJson, 'name'), minWidth: "5rem", maxWidth: "5rem",
            body: (rowData) => (
                <p className='text-link-class clickable-row' onClick={() => {
                    setStaff(rowData.id);
                    setStaffDetailsOpen(true);
                    hideOverFlow();
                }}>
                    {rowData['name']}
                </p>
            )
        },
        { field: 'username', header: translate(localeJson, 'userId'), minWidth: "5rem", maxWidth: "5rem" },
        {
            field: 'password',
            header: translate(localeJson, 'password'),
            body: (rowData) => {
                return <PasswordColumn rowData={rowData} />
            },
            minWidth: "5rem", maxWidth: "5rem"
        },
        {
            field: 'actions',
            header: translate(localeJson, 'common_action'),
            textAlign: "center",
            alignHeader: "center",
            className: "action_class",
            body: (rowData) => (
                <div>
                    <Button
                        buttonProps={{
                            text: translate(localeJson, 'edit'),
                            buttonClass: "edit-button",
                            onClick: () => {
                                setRegisterModalAction("edit")
                                // Keys to extract
                                const keysToExtract = ["id", "username", "tel", "name", "password", "event_id", "place_id"];

                                // Creating a new object with only the desired keys
                                const extractedData = keysToExtract.reduce((acc, key) => {
                                    acc[key] = rowData[key];
                                    return acc;
                                }, {});

                                // Assuming setRegisterModalAction and setCurrentEditObj are functions
                                setRegisterModalAction("edit");
                                setCurrentEditObj(extractedData);
                                setEditStaffOpen(true)
                                hideOverFlow();
                            }
                        }} parentClass={"edit-button inline"} />
                    <Button
                        buttonProps={{
                            text: translate(localeJson, 'delete'),
                            buttonClass: "delete-button ml-2",
                            onClick: () => openDeleteDialog(rowData)
                        }} parentClass={"delete-button inline"} />
                </div>
            ),
        }
    ];

    const onStaffImportClose = () => {
        setImportStaffOpen(!importStaffOpen);
        showOverFlow();
    };

    const onStaffDetailClose = () => {
        setStaff(null);
        setStaffDetailsOpen(false);
        showOverFlow();
    };

    const onStaffEditClose = () => {
        setEditStaffOpen(false);
        showOverFlow();
    };

    const onRegister = (values) => {
        if ("id" in values) {
            update(values, (res) => {
                if (res) {
                    setTableLoading(true);
                    getStaffList()
                }
            })
        }
        else {
            create(values, (res) => {
                setTableLoading(true);
                res ? getStaffList() : setTableLoading(false);
            })
        }
        setImportStaffOpen(false);
        setEditStaffOpen(false);
        setCreateStaffOpen(false);
    };

    const { getList, create, update, exportData } = StaffManagementService;

    useEffect(() => {
        setTableLoading(true);
        const fetchData = async () => {
            await getStaffList()
        };
        fetchData();
    }, [locale, getListPayload]);

    const getStaffList = () => {
        getList(getListPayload, (response) => {
            var preparedList = [];
            var listTotalCount = 0;
            if (response && response.success && !_.isEmpty(response.data) && response.data.total > 0) {
                const data = response.data.model;
                // Preparing row data for specific column to display
                data.map((obj, i) => {
                    let key = process.env.NEXT_PUBLIC_PASSWORD_ENCRYPTION_KEY;
                    let decryptedData = obj.passwordfe ? decryptPassword(obj.passwordfe, key) : ""
                    let preparedObj = {
                        slno: i + getListPayload.filters.start + 1,
                        id: obj.id,
                        name: obj.name ?? "",
                        username: obj.username ?? "",
                        password: decryptedData,
                        event_id: obj.eventsAll,
                        place_id: obj.places,
                        image: obj.image ?? "",
                        tel: obj.tel ?? "",
                        birthday: obj.birthday ?? "",
                        zip_code: obj.zip_code ?? "",
                        prefecture_id: obj.prefecture_id ?? "",
                        address: obj.address ?? "",
                        first_login: obj.first_login ?? "",
                    }
                    preparedList.push(preparedObj);
                })
                listTotalCount = response.data.total;
            }
            setTableLoading(false);
            setList(preparedList);
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

    const importFileApi = (file) => {
        const formData = new FormData();
        formData.append('file', file);
        StaffManagementService.importData(formData, (response) => {
            if (response) {
                setTableLoading(true);
                getStaffList();
            }
        });
        onStaffImportClose();
        showOverFlow();
    }

    return (
        <React.Fragment>
            {importStaffOpen &&
                <AdminManagementImportModal
                    open={importStaffOpen}
                    close={onStaffImportClose}
                    importFile={importFileApi}
                    modalHeaderText={translate(localeJson, "staff_management_import")}
                />
            }
            {staff &&
                <StaffManagementDetailModal
                    open={staffDetailsOpen}
                    close={onStaffDetailClose}
                    staff={staff}
                />
            }
            {deleteOpen &&
                <AdminManagementDeleteModal
                    open={deleteOpen}
                    close={onDeleteClose}
                    refreshList={getStaffList}
                    deleteObj={deleteObj}
                />
            }
            {editStaffOpen &&
                <StaffManagementEditModal
                    open={editStaffOpen}
                    close={onStaffEditClose}
                    register={onRegister}
                    currentEditObj={{ ...currentEditObj }}
                    refreshList={getStaffList}
                    registerModalAction={registerModalAction}
                />
            }
            <div className="grid">
                <div className="col-12">
                    <div className='card'>
                        <CustomHeader headerClass={"page-header1"} header={translate(localeJson, "staff_management")} />
                        <div>
                            <div className='flex' style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    import: true,
                                    onClick: () => {
                                        setImportStaffOpen(true);
                                        hideOverFlow();
                                    },
                                    buttonClass: "evacuation_button_height import-button",
                                    text: translate(localeJson, 'import'),
                                }} parentClass={"mr-1 mt-1 import-button"} />
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    buttonClass: "evacuation_button_height export-button",
                                    export: true,
                                    text: translate(localeJson, 'export'),
                                    onClick: () => {
                                        exportData(getListPayload)
                                    }
                                }} parentClass={"mr-1 mt-1 export-button"} />
                                <Button buttonProps={{
                                    type: 'submit',
                                    rounded: "true",
                                    create: true,
                                    buttonClass: "evacuation_button_height create-button",
                                    text: translate(localeJson, 'create_staff'),
                                    onClick: () => {
                                        setRegisterModalAction("create")
                                        setCurrentEditObj(blankStaffObj);
                                        setEditStaffOpen(true);
                                        hideOverFlow();
                                    },
                                }} parentClass={"mt-1 create-button"} />
                            </div>
                        </div>
                        <div>
                            <div>
                                <div>
                                    <div class="flex justify-content-end gap-3 lg:gap-2 md:gap-2 sm:gap-2 flex-wrap float-right modal-field-top-space modal-field-bottom-space" >
                                        <Input
                                            inputProps={{
                                                inputParentClassName: "w-full lg:w-17rem md:w-20rem sm:w-14rem",
                                                labelProps: {
                                                    text: translate(localeJson, 'name'),
                                                    inputLabelClassName: "block",
                                                },
                                                inputClassName: "w-full lg:w-17rem md:w-20rem sm:w-14rem",
                                                id: 'householdNumber',
                                                name:"householdNumber",
                                                onChange: (e) => { setSearchName(e.target.value) },
                                            }}
                                        />
                                        <div className='flex align-items-end'>
                                            <Button buttonProps={{
                                                buttonClass: "w-12 search-button",
                                                text: translate(localeJson, "search_text"),
                                                icon: "pi pi-search",
                                                onClick: () => {
                                                    setGetListPayload({ ...getListPayload, name: searchName })
                                                }
                                            }} parentClass={"search-button"} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='mt-3'>
                                <NormalTable
                                    lazy
                                    totalRecords={totalCount}
                                    loading={tableLoading}
                                    stripedRows={true}
                                    className={"custom-table-cell"}
                                    showGridlines={"true"}
                                    value={list}
                                    columns={columnsData}
                                    filterDisplay="menu"
                                    emptyMessage={translate(localeJson, "data_not_found")}
                                    paginator={true}
                                    first={getListPayload.filters.start}
                                    rows={getListPayload.filters.limit}
                                    paginatorLeft={true}
                                    onPageHandler={(e) => { onPaginationChange(e) }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}