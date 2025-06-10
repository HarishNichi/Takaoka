import React, { useContext, useState } from "react";
import { Dialog } from "primereact/dialog";

import { LayoutContext } from "@/layout/context/layoutcontext";
import { getValueByKeyRecursively as translate } from '@/helper'
import { Input, ButtonRounded } from "@/components"

const BarcodeDialog = (props) => {
    const { localeJson } = useContext(LayoutContext);
    const { validateAndMoveToTempReg } = props;

    const [selfID, setSelfID] = useState(null);

    return (
        <Dialog
            className="new-custom-modal"
            header={props.header}
            visible={props.visible}
            draggable={false}
            blockScroll={true}
            onHide={() => props.setVisible(false)}
        >
            <div className="modal-header">
                {props.header}
            </div>
            <div className="barcode-reader-image-div">
                <div className="barcode-reader-div">
                    <div className="text-center mt-3">
                        <div>
                            <h5 className="text-center font-bold">{props.title ? props.title : translate(localeJson, "barcode_dialog_main_title")}</h5>
                        </div>
                        <div>
                            <h6 className="text-center mt-2" style={{ "color": "rgb(157 157 157)" }}>{props.subTitle ? props.subTitle : translate(localeJson, "barcode_dialog_sub_title")}</h6>
                        </div>
                    </div>
                    <div className="col mt-5">
                        <Input
                            inputProps={{
                                inputParentClassName: `w-full`,
                                labelProps: {
                                    text: translate(localeJson, 'barcode_dialog_sub_inputfield_label'),
                                    inputLabelClassName: "block",
                                    spanText: "*",
                                    inputLabelSpanClassName: "p-error"
                                },
                                inputClassName: "w-full",
                                id: "barcode_value",
                                name: "barcode_value",
                                style: { width: "200px" },
                                value: selfID,
                                onChange: (e) => {
                                    setSelfID(e.target.value)
                                }
                            }}
                        />
                    </div>
                    <div className="col ">
                        <ButtonRounded
                            buttonProps={{
                                type: "button",
                                rounded: "true",
                                custom: "",
                                buttonClass:
                                    "w-full h_custom_reg_button border-round-3xl custom-icon-button flex justify-content-center",
                                text: translate(localeJson, "barcode_dialog_btn_label"),
                                bg: "bg-white",
                                hoverBg: "h_custom_reg_button",
                                onClick: () => {
                                    validateAndMoveToTempReg(selfID)
                                }
                            }}
                            parentClass={
                                "border-round-3xl w-full flex justify-content-center lg:mb-0"
                            }
                        />
                    </div>
                    <div className="col">
                        <ButtonRounded
                            buttonProps={{
                                type: "button",
                                rounded: "true",
                                custom: "",
                                buttonClass:
                                    "w-full back-button border-round-3xl custom-icon-button flex justify-content-center",
                                text: translate(localeJson, "cancel"),
                                onClick: () => props.setVisible(false)
                            }}
                            parentClass={
                                "border-round-3xl w-full flex justify-content-center lg:mb-0 back-button"
                            }
                        />
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default BarcodeDialog;