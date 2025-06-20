import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

import { Button, QrScannerModal } from "@/components";
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { UserQrService } from "@/services";
import { setCheckInData } from "@/redux/qr_app";
import QrAppConfirmDialog from "@/components/modal/qrAppConfirmationModal";
import _ from "lodash";

export default function App() {
  const { localeJson, locale, setLoader } = useContext(LayoutContext);
  const router = useRouter();
  const dispatch = useDispatch();
  const placeId = localStorage.getItem("place_id");
  const placeName = localStorage.getItem("evacuationPlaceName");
  const placeName_En = localStorage.getItem("evacuationPlaceNameEnglish");
  const [openQrPopup, setOpenQrPopup] = useState(false);
  const [openBarcodeConfirmDialog, setOpenBarcodeConfirmDialog] =
    useState(false);
  const [regData, setRegData] = useState([]);

  const closeQrPopup = () => {
    setOpenQrPopup(false);
  };
  const { register, create } = UserQrService;

  const qrResult = (res) => {
    let formData = new FormData();
    formData.append("content", res);
    register(formData, (result) => {
      if (result) {
        let place_id = result.data?.data[0]?.place_id;
        if (place_id != placeId) {
          closeQrPopup();
          let data = result.data?.data;
          data[0].place_id = placeId;
          data[0].place_name = placeName;
          setRegData(data);
          setOpenBarcodeConfirmDialog(true);
          return;
        }
        let family_id = result.data?.data[0]?.family_id;
        let payload = {
          family_id: family_id,
          place_id: place_id,
        };
        setLoader(true);
        create(payload, (result) => {
          if (result) {
            setLoader(false);
            closeQrPopup();
          }
        });
        // dispatch(setCheckInData(result.data?.data))
        // router.push('/user/qr/app/register')
      } else {
        closeQrPopup();
      }
    });
  };

  return (
    <div className="grid flex-1">
      <div className="col-12 flex-1">
        <div className="card flex flex-column h-full align-items-center justify-content-center">
          <div className=" w-9">
            <QrScannerModal
              open={openQrPopup}
              close={closeQrPopup}
              callback={qrResult}
            ></QrScannerModal>
            <QrAppConfirmDialog
              header={translate(localeJson, "confirmation")}
              visible={openBarcodeConfirmDialog}
              setVisible={setOpenBarcodeConfirmDialog}
              doAutoCheckout={() => {
                let payload = {
                  family_id: regData[0].family_id,
                  place_id: placeId,
                };
                setLoader(true);
                create(payload, (result) => {
                  if (result) {
                    setLoader(false);
                    setOpenBarcodeConfirmDialog(true);
                  }
                });
              }}
            />
            <div className="flex flex-column justify-content-center align-item-center w-full">
              <h5 className="text-center  user-dashboard-header">
                {" "}
                {translate(localeJson, "user_dashboard_1")}
              </h5>
              <div className="flex justify-content-center">
                <h5 className="user-dashboard-header dashboard-height"></h5>
                <h5 className="text-center header_clr user-dashboard-header white-space-nowrap overflow-hidden text-overflow-ellipsis">
                  {locale == "ja"
                    ? placeName
                    : !_.isNull(placeName_En)
                    ? placeName_En
                    : placeName}
                </h5>
                <h5 className="user-dashboard-header dashboard-height"></h5>
              </div>
            </div>
            <div className="h-full flex justify-content-center align-items-center">
              <Button
                buttonProps={{
                  type: "submit",
                  rounded: "true",
                  buttonClass:
                    "qr-button flex align-items-center justify-content-center qr_submit",
                  text: " " + translate(localeJson, "qr_scanner_popup_btn"),
                  className:
                    "pi pi-qrcode flex align-items-center justify-content-center",
                  onClick: () => {
                    setOpenQrPopup(true);
                  },
                }}
                parentClass={"flex qr-button"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
