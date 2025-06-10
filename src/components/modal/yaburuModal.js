import React, { useContext, useState, useCallback } from "react";
import { Dialog } from "primereact/dialog";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { getValueByKeyRecursively as translate } from "@/helper";
import Image from "next/image";
import BarcodeReader from "react-barcode-reader";

export default function YaburuModal(props) {
  const { localeJson, setLoader } = useContext(LayoutContext);
  const { open, close, callBack } = props;

  const [scanning, setScanning] = useState(false);

  const handleBarcode = useCallback(
    (data) => {
      if (scanning) return; // Ignore if a scan is already being processed

      setScanning(true);
      if (data) {
        setLoader(true);
        callBack(data);
      } else {
        setLoader(false);
      }

      // Reset scanning state after a delay
      setTimeout(() => setScanning(false), 1000);
    },
    [scanning, setLoader, callBack]
  );

  return (
    <div>
      <Dialog
        className="custom-modal yappleid-popup w-10 sm:w-8 md:w-4 lg:w-4"
        visible={open}
        header={translate(localeJson, "yapple_modal_start_icon_div")}
        draggable={false}
        blockScroll={true}
        onHide={close}
      >
        <div className="flex justify-content-center">
          <StartIconDiv />
          {open && <BarcodeReader onScan={handleBarcode} onReceive={()=>{setLoader(true)}} />}
        </div>
      </Dialog>
    </div>
  );
}

function StartIconDiv() {
  return (
    <div>
      <div className="text-center my-3">
        <div>
          <Image
            src="/layout/images/mapplescan.svg"
            width={80}
            height={80}
            alt="Your SVG Image"
          />
        </div>
      </div>
    </div>
  );
}
