import React from "react"
import { Dialog } from 'primereact/dialog';

import { ImageComponent } from "@/components";

export default function StockpileSummaryImageModal(props) {
    const { open, close } = props;

    return (
        <div>
            <Dialog
                className="custom-modal"
                visible={open}
                draggable={false}
                blockScroll={true}
                onHide={() => close()}
            >
                <div className={`text-1rem`}>
                    <ImageComponent
                        imageProps={{
                            width: "700",
                            height: "500",
                            maxWidth: window.innerWidth - 50,
                            src: props.imageUrl,
                            alt: "scan-image",
                            custom: true
                        }}

                    />
                </div>
            </Dialog>
        </div>
    );
}