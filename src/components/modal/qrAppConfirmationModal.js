import React, { useContext } from "react";
import { Dialog } from "primereact/dialog";

import { LayoutContext } from "@/layout/context/layoutcontext";
import { getValueByKeyRecursively as translate } from '@/helper'
import { Button } from "@/components";

const QrAppConfirmDialog = (props) => {
    const { localeJson } = useContext(LayoutContext);

    return (
        <Dialog
            className="custom-modal w-10 sm:w-8 md:w-5 lg:w-4 width-400px"
            header={props.header}
            visible={props.visible}
            draggable={false}
            blockScroll={true}
            onHide={() => props.setVisible(false)}
        >
            <div className="text-center mt-4">
                <div>
                    <h6 className="text-center">
                        {translate(localeJson, "different_evacuation_confirmation")}
                    </h6>
                </div>
            </div>

            <div className="col mt-4">
                <div className="p-2 flex justify-content-center">
                    <Button buttonProps={{
                        type: "button",
                        text: translate(localeJson, 'yes'),
                        buttonClass: "multi-form-submit w-12",
                        rounded: true,
                        onClick: () => props.doAutoCheckout()
                    }} parentClass={"p-2 w-12 sm:w-6 md:w-6 lg:w-6"} />
                    <Button buttonProps={{
                        type: "button",
                        text: translate(localeJson, 'no'),
                        buttonClass: "multi-form-submit return w-12",
                        rounded: true,
                        onClick: () => props.setVisible(false)
                    }} parentClass={"p-2 w-12 sm:w-6 md:w-6 lg:w-6"} />
                </div>

            </div>
        </Dialog>
    );
};

export default QrAppConfirmDialog;
