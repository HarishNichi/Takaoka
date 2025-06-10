import React from "react";
import { Dialog } from "primereact/dialog";

import { Button } from "@/components"; 

const CommonDialog = (props) => {
  const {
    open,
    close,
    dialogParentClassName,
    dialogBodyClassName,
    dialogBodyStyle,
    position,
    header,
    content,
    content2,
    footerParentClassName,
    footerButtonsArray,
    dialogClassName,
    ...restProps
  } = props;

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

  return (
    <div className={dialogParentClassName}>
      <Dialog
        className={`new-custom-modal ${dialogClassName}`}
        header={header}
        visible={open}
        draggable={false}
        blockScroll={true}
        position={position}
        onHide={() => close()}
        footer={footer()}
      >

        <div className={dialogBodyClassName} style={dialogBodyStyle}>
          <div className="modal-header">
            {header}
          </div>
          {content}
          <div>
            {footer()}
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default CommonDialog;
