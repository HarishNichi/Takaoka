import React, { useContext } from 'react';
import { Dialog } from 'primereact/dialog';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { getValueByKeyRecursively as translate } from '@/helper'
import { Button, TextArea } from "@/components"; 

const DetailModal = (props) => {
    const { localeJson } = useContext(LayoutContext);
    const {
        parentMainClass,
        detailModalProps = {}
    } = props;
    const {
        headerContent,
        note,
        comment,
        modalClass,
        draggable,
        position,
        onHide,
        visible,
        style,
        ...restProps
    } = detailModalProps;

    return (
        <div className={`${parentMainClass}`}>
            <Dialog className={`${modalClass} new-custom-modal`}
                draggable={draggable}
                position={position}
                header={headerContent}
                visible={visible}
                onHide={onHide}
                style={style}
                blockScroll={true}
                {...restProps}
            >
                <div className={`modal-content`}>
                    <div className="modal-header white-space-nowrap overflow-hidden text-overflow-ellipsis">
                        {headerContent}
                    </div>
                    <div className="modal-field-bottom-space">
                        <TextArea textAreaProps={{
                            labelProps: {
                                text: translate(localeJson, 'Other_shared_matters'),
                                textAreaLabelClassName: "block",
                                labelMainClassName: "modal-label-field-space"
                            },
                            textAreaClass: "w-full bg-bluegray-50",
                            row: 10,
                            readOnly: "true",
                            value: note
                        }} />
                    </div>
                    <div className="">
                        <TextArea textAreaProps={{
                            textAreaParentClassName: "w-full",
                            labelProps: {
                                text: translate(localeJson, 'Other_shortage_items'),
                                textAreaLabelClassName: "block w-full ",
                                labelMainClassName: "modal-label-field-space"
                            },
                            textAreaClass: "w-full bg-bluegray-50",
                            row: 10,
                            cols: 5,
                            readOnly: "true",
                            value: comment
                        }} />

                    </div>
                    <div className="text-center">
                        <div className="modal-button-footer-space">
                            <Button buttonProps={{
                                buttonClass: "w-full back-button",
                                text: translate(localeJson, 'cancel'),
                                onClick: onHide
                            }} parentClass={"back-button"} />
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}

export default DetailModal;