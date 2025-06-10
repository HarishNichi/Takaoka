import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Dialog } from "primereact/dialog";

import { Button, CustomHeader, PersonCountButton } from "@/components"; 
import { LayoutContext } from '@/layout/context/layoutcontext';
import { getValueByKeyRecursively as translate } from "@/helper";
import { reset } from "@/redux/staff_register";
import { useAppDispatch } from "@/redux/hooks";

const PersonCountModal = (props) => {
    const { localeJson, locale } = useContext(LayoutContext);
    const {
        open,
        close,
        dialogParentClassName,
        dialogBodyClassName,
        position,
        header,
        content,
        footerParentClassName,
        footerButtonsArray,
        ...restProps
    } = props;
    const router = useRouter();
    const dispatch = useAppDispatch()

    const [buttonStates, setButtonStates] = useState([1, 2, 3, 4, 5, 6, 7, 8]);
    const [personCount, setPersonCount] = useState("")
    // Footer buttons
    const footer = () => {
        if (footerButtonsArray.length > 0) {
            return (
                <div className={footerParentClassName}>
                    {footerButtonsArray.map((buttonDetails, i) => (
                        <Button
                            key={i}
                            buttonProps={buttonDetails.buttonProps}
                            parentClass={buttonDetails.parentClass}
                        />
                    ))
                    }
                </div>
            )
        }
        return false;
    };

    useEffect(() => {
        dispatch(reset())
    }, [])

    // Define a function to handle selection changes
    const handleSingleSelectionChange = (selectedName) => {
        setPersonCount(selectedName)
    };

    const handleNextButtonClick = () => {
        if (!personCount) {
            // Person count not selected, show alert
            window.alert(translate(localeJson, 'please_select_person_count'));
        } else {
            dispatch(reset())
            // Person count selected, proceed with navigation
            localStorage.setItem("personCountStaff", personCount)
            localStorage.setItem("isCamera", "false");
            localStorage.setItem("isScanner", "false");
            router.push('/staff/family/register')
        }
    };

    return (
        <Dialog
            className="new-custom-modal-person"
            header={header}
            style={{ width: "95%", height: "100%", padding: "0px important" }}
            visible={open}
            draggable={false}
            blockScroll={true}
            position={position}
            onHide={() => close()}
            footer={footer()}
        >
            <div className='grid flex-1'>
                <div className='col-12 flex-1'>
                    <div className='card h-full'>
                        <CustomHeader headerClass={"page-header1"} header={header} />
                        <div className="flex flex-column h-full align-items-center justify-content-center text-2xl" >
                            <div style={{ maxWidth: "330px" }}>
                                <div className=''>
                                    <CustomHeader customParentClassName={"mb-0"} headerClass={`${locale == "en" ? "pt-4" : "pt-0"} font-bold`} header={translate(localeJson, "evacuee_count")} />
                                </div>
                                <div className=''>
                                    <p className='pb-0' style={{ fontSize: "16px" }}>{translate(localeJson, "person_count_evacuated")}
                                    </p>
                                </div>

                                <div className=" flex flex-wrap justify-content-center">
                                    <PersonCountButton names={buttonStates}
                                        onSelectionChange={handleSingleSelectionChange}
                                        customClassName={"text-3xl"}
                                        customParentClassName={" w-full gap-person-count"} />
                                </div>
                                <div className="pt-2 pb-2">
                                    <Button buttonProps={{
                                        buttonClass: "w-full primary-button ",
                                        type: "button",
                                        text: translate(localeJson, 'next'),
                                        severity: "primary",
                                        custom: "person-count-button",
                                        onClick: handleNextButtonClick,
                                    }}
                                        parentClass="w-full pb-2 pt-2 primary-button" />
                                    <Button buttonProps={{
                                        custom: "person-count-button",
                                        buttonClass: "w-full back-button",
                                        text: translate(localeJson, 'return_hiragana'),
                                        onClick: () => { close() },
                                    }}
                                        parentClass="w-full pt-2 pb-2 back-button " />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </Dialog>
    );
};

export default PersonCountModal;