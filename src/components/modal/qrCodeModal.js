import React, { useState } from "react";
import { Dialog } from "primereact/dialog";

import { Button, BarcodeScanner } from "@/components"; 

const QrCodeModal = (props) => {
    const {
        open,
        close,
        dialogParentClassName,
        dialogBodyClassName,
        position,
        header,
        footerParentClassName,
        footerButtonsArray,
        ...restProps
    } = props;

    // Footer buttons
    const [cameraMode, setCameraMode] = useState("front"); // Initialize with "front" mode

    const toggleCameraMode = () => {
        setCameraMode(cameraMode === "front" ? "back" : "front");
    };

    const footer = () => {
        if (footerButtonsArray.length > 0) {
            return (
                <div className={footerParentClassName}>
                    {footerButtonsArray.map((buttonDetails, i) => (
                        <Button
                            key={i}
                            buttonProps={buttonDetails.buttonProps}
                            parentClass={buttonDetails.parentClass}
                            onClick={toggleCameraMode}
                        />
                    ))
                    }
                </div>
            )
        }
        return false;
    };

    return (
        <div className={dialogParentClassName}>
            <Dialog
                className="custom-modal w-20rem lg:w-30rem md:w-30rem sm:w-30rem"
                header={header}
                visible={open}
                draggable={false}
                blockScroll={true}
                position={position}
                onHide={() => close()}
                footer={footer()}
                {...restProps}
            >
                <div className={dialogBodyClassName}>
                    <div>
                        <BarcodeScanner width={"100%"} cameraMode={cameraMode} />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default QrCodeModal;