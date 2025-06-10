import React, { useContext } from "react";
import { Dialog } from "primereact/dialog";
import { useRouter } from "next/router";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { getValueByKeyRecursively as translate } from "@/helper";
import { Button, CustomHeader } from "@/components";

const QrConfirmDialog = (props) => {
  const { localeJson } = useContext(LayoutContext);
  const router = useRouter();
  return (
    <Dialog
      className="custom-modal w-10 sm:w-8 md:w-6 lg:w-5"
      header={<div>
        <CustomHeader
          headerClass={"page-header1"}
          customParentClassName={"mb-0"}
          header={translate(localeJson,"qr_scan")}
        />
      </div>}
      visible={props.visible}
      draggable={false}
      blockScroll={true}
      onHide={() => props.setVisible(false)}
      style={{ width: "375px" }}
      // footer={footer()}
    >
      <div className="col flex justify-content-center mt-4">
        <div className="">
          <h6>{translate(localeJson, "choose_Option")}</h6>
        </div>
      </div>

      <div className="col mt-4">
        <div className="p-2 flex justify-content-center">
          <Button
            buttonProps={{
              type: "button",
              text: translate(localeJson, "cam_button"),
              buttonClass: "multi-form-submit w-12",
              rounded: true,
              onClick: () => {
                props.setVisible(false);
                localStorage.setItem("isCamera", "true");
                localStorage.setItem("isScanner", "false");
                props.setOpenQrPopup(true);
              },
            }}
            parentClass={"p-2 w-12 sm:w-6 md:w-6 lg:w-6"}
          />
          <Button
            buttonProps={{
              type: "button",
              text: translate(localeJson, "scanner_button"),
              buttonClass: "multi-form-submit return w-12",
              rounded: true,
              onClick: () => {
                localStorage.setItem("isCamera", "false");
                localStorage.setItem("isScanner", "true");
                props.setVisible(false);
                props.setQrScanPopupModalOpen(true);
              }, 
            }}
            parentClass={"p-2 w-12 sm:w-6 md:w-6 lg:w-6"}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default QrConfirmDialog;
