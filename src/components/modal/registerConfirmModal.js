import React, { useContext, useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { useRouter } from 'next/router';
import { LayoutContext } from "@/layout/context/layoutcontext";
import { getEnglishDateDisplayFormat, getJapaneseDateDisplayYYYYMMDDFormat, getValueByKeyRecursively as translate } from '@/helper';
import { Button,NormalTable } from "@/components";

const RegisterConfirmDialog = (props) => {
    const { localeJson,locale } = useContext(LayoutContext);
    const router = useRouter();
    const [persons, setPersons] = useState([]);
    const [isAllDuplicated, setIsAllDuplicated] = useState(false);
    const [sortConfig, setSortConfig] = useState({ field: null, order: 'asc' }); 

    useEffect(() => {
        setPersons(props.duplicatePersons); // Initial data setup
        const confirmData = props.confirmData;
        const data = JSON.parse(JSON.stringify(confirmData));
        if (props.duplicatePersons?.length == data.person?.length) {
            setIsAllDuplicated(true);
        }
    }, [props.duplicatePersons, props.confirmData]);

    // Function to handle sorting
    const handleSort = (sortField) => {
        const newOrder = sortConfig.order == 'asc' ? 'desc' : 'asc';
        const sortedPersons = [...persons].sort((a, b) => {
            if (a[sortField] < b[sortField]) return newOrder == 'asc' ? -1 : 1;
            if (a[sortField] > b[sortField]) return newOrder == 'asc' ? 1 : -1;
            return 0;
        });
        setSortConfig({ field: sortField, order: newOrder });
        setPersons(sortedPersons);
    };

    // Column configuration for NormalTable
    const columns = [
        {
            field: "is_owner",
            header: translate(localeJson, "representative"),
            body: (rowData) => {
                return rowData?.is_owner ? translate(localeJson, "representative") : translate(localeJson, "");
            },
        },
        {
            field: "family_code",
            header: translate(localeJson, "family_code"),
            body: (rowData) => rowData.family_code || "-",
        },
        {
            field: "name",
            header: translate(localeJson, "name"),
            sortable: true,
        },
        {
            field: "dob",
            header: translate(localeJson, "dob"),
            sortable: true,
            body: (rowdata) => {
                const dob = rowdata.dob;
                // Check if the date is '1900/01/01' and treat it as null
                if (dob === "1900/01/01") {
                    return ""; // Show empty for the date
                }
                // Return formatted date based on locale
                return locale === "ja"
                    ? getJapaneseDateDisplayYYYYMMDDFormat(dob)
                    : getEnglishDateDisplayFormat(dob);
            }
        },  
        {
            field: "age",
            header: translate(localeJson, "age"),
            sortable: true,
        },
        {
            field: "gender",
            header: translate(localeJson, "gender"),
            body: (rowData) => {
                return rowData.gender === 1 ? translate(localeJson, "male") : rowData.gender === 2?translate(localeJson, "female"):translate(localeJson, "others_count");
            },
        },
    ];

    return (
        <Dialog
            className="new-custom-modal lg:w-7 md:w-9 sm:w-10"
            header={
                <div className="text-center">
                    {translate(localeJson, 'dup_check')}
                </div>
            }
            visible={props.visible}
            draggable={false}
            blockScroll={true}
            onHide={() => props.setVisible(false)}
            // style={{ width: '600px' }} // Adjusted width for the table
        >
            <div className="flex flex-column justify-content-start mb-4">
                <div className="p-2">
                    {isAllDuplicated ?
                    
                        <div className="flex">
                            {translate(localeJson, "already_all_admitted")}
                        </div>
                     :
                    
                        <>
                        <div className="flex">
                           <span className="text-sm md:text-base">{translate(localeJson, "already_per_admitted")} </span>
                        </div>
                         <div className="flex">
                         <span className="text-sm md:text-base">{translate(localeJson, "already_per_admitted2")} </span>
                      </div>
                       <div className="flex">
                       <span className="text-sm md:text-base">{translate(localeJson, "already_per_admitted3")} </span>
                    </div>
                    </>
                    
                }
                    {/* <h6>{translate(localeJson, !isAllDuplicated ? "already_per_admitted" : "already_all_admitted")}</h6> */}
                </div>
                <div className="p-2">
                    <NormalTable
                        lazy={false}
                        totalRecords={persons.length} // Total number of records
                        value={persons} // Data to display
                        columns={columns} // Columns configuration
                        className="custom-table-cell"
                        emptyMessage={translate(localeJson, "data_not_found")}
                        paginator={false} // Disable pagination since it's a modal
                        stripedRows={true}
                        showGridlines={true}
                        onSort={(e) => handleSort(e.sortField)} 
                    />
                </div>
            </div>

            <div className={`col ${isAllDuplicated ? '' : ''}`}>
                <div className="p-2 flex justify-content-center">
                    <Button buttonProps={{
                        type: "button",
                        text: translate(localeJson, 'return'),
                        buttonClass: "multi-form-submit w-12",
                        rounded: true,
                        onClick: () => {
                            props.return()
                            // router.replace('/user/pre-register');
                        }
                    }} parentClass={`p-2 ${isAllDuplicated ? 'flex justify-content-center' : ''}w-12 sm:w-6 md:w-6 lg:w-6`} />
                    <Button buttonProps={{
                        type: "button",
                        text: translate(localeJson, 'proceed'),
                        buttonClass: `multi-form-submit return w-12 ${isAllDuplicated ? 'disabled hidden' : ''}`,
                        rounded: true,
                        onClick: () => props.register()
                    }} parentClass={`p-2 w-12 sm:w-6 md:w-6 lg:w-6 ${isAllDuplicated ? 'hidden' : ''}`} />
                </div>
            </div>
        </Dialog>
    );
};

export default RegisterConfirmDialog;
