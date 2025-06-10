import React, { useContext, useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";

import { Button, InputSwitch } from "@/components"; 
import { hideOverFlow, showOverFlow, getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";

const DeleteModal = (props) => {
  const {
    disabled,
    parentMainClass,
    text,
    iconPos,
    icon,
    parentClass,
    data,
    checked,
    modalClass,
    draggable,
    position,
    header,
    style,
    contentClass,
    content,
    bg,
    hoverBg,
    severity,
    buttonClass,
    cancelButtonClass,
    updateButtonClass,
    cancelButton,
    updateButton,
    updateCalBackFunction,
    setCheckedValue,
    ...restProps
  } = props;
  const { localeJson } = useContext(LayoutContext);
  const [visible, setVisible] = useState(false);
  const [checkedSwitch, setCheckedSwitch] = useState(checked);
  const footer = () => {
    if (cancelButton || updateButton) {
      return (
        <div className="text-center">
          {/* Update button */}
          {updateButton && (
            <div className="modal-button-footer-space">
              <Button
                buttonProps={{
                  buttonClass: updateButtonClass ? updateButtonClass : buttonClass,
                  type: "submit",
                  text: translate(localeJson, "update"),
                  onClick: () => onClickupdateButton(data),
                }}
                parentClass={"del_ok-button"}
              />
            </div>
          )}
          {/* Delete button */}
          {cancelButton && (
            <Button
              buttonProps={{
                buttonClass: cancelButtonClass ? cancelButtonClass : buttonClass,
                text: translate(localeJson, "cancel"),
                onClick: () => {
                  setVisible(false)
                  showOverFlow();
                }
              }}
              parentClass={"back-button"}
            />
          )}

        </div>
      );
    }
    return false;
  };

  useEffect(() => {
    setCheckedSwitch(checked);
  }, [checked]);

  /**
   * Return id to the parent function
   * @param {*} rowData
   */
  const onClickupdateButton = (rowData) => {
    updateCalBackFunction(rowData);
    setVisible(false);
    showOverFlow();
  };

  return (
    <div className={`${parentMainClass}`}>
      {text ? (
        <>
          {/* Check box */}
          <Button
            buttonProps={{
              text: text,
              iconPos: iconPos,
              icon: icon,
              bg: bg,
              hoverBg: hoverBg,
              severity: severity,
              buttonClass: buttonClass,
              onClick: () => setVisible(true),
            }}
          />
        </>
      ) : (
        <>
          {/* Switch */}
          <InputSwitch
            parentClass={parentClass}
            inputSwitchProps={{
              disabled: disabled || false,
              checked: checkedSwitch,
              onChange: (evt) => {
                setVisible(true);
                setCheckedValue && setCheckedValue(evt.target.value);
                hideOverFlow();
              },
            }}
          />
        </>
      )}
      <Dialog
        className="new-custom-modal p-overflow-hidden"
        header={header}
        visible={visible}
        draggable={false}
        blockScroll={true}
        onHide={() => {
          setVisible(false)
          showOverFlow();
        }}
        footer={footer()}
      >
        <div className={`modal-content`}>
          <div className="modal-header">
            {header}
          </div>
          <div>
            <p>{content}</p>
          </div>
          <div>
            {footer()}
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default DeleteModal;
