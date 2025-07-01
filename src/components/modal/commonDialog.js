import React, { useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";

import { Button } from "@/components"; 

const CommonDialog = (props) => {
  const {
    open,
    close,
    dialogParentClassName,
    dialogBodyClassName,
    position,
    header,
    content,
    content2,
    footerParentClassName,
    footerButtonsArray,
    dialogClassName,
    ariaLabel,
    ...restProps
  } = props;

  const dialogRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Focus management
  useEffect(() => {
    if (open) {
      // Store the currently focused element
      previousFocusRef.current = document.activeElement;
      
      // Focus the dialog when it opens
      setTimeout(() => {
        if (dialogRef.current) {
          const focusableElements = dialogRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElements.length > 0) {
            focusableElements[0].focus();
          }
        }
      }, 100);
    } else {
      // Restore focus when dialog closes
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }
  }, [open]);

  // Handle escape key
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      close();
    }
  };

  // Footer buttons
  const footer = () => {
    if (footerButtonsArray && footerButtonsArray.length > 0) {
      return (
        <div className={footerParentClassName} role="group" aria-label="Dialog actions">
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
        ref={dialogRef}
        className={`new-custom-modal ${dialogClassName}`}
        header={header}
        visible={open}
        draggable={false}
        blockScroll={true}
        position={position}
        onHide={() => close()}
        footer={footer()}
        aria-label={ariaLabel || "Dialog"}
        aria-modal="true"
        onKeyDown={handleKeyDown}
        {...restProps}
      >

        <div className={dialogBodyClassName}>
          <div className="modal-header" role="banner">
            {header}
          </div>
          <div role="main">
            {content}
          </div>
          <div>
            {footer()}
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default CommonDialog;
