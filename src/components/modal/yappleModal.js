import React, { useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { useContext, useState } from "react";
import BarcodeReader from "react-barcode-reader";
import Image from "next/image";
import { useSelector } from "react-redux";

import {
  getEnglishDateTimeDisplayFormat,
  getJapaneseDateTimeDisplayFormat,
  toastDisplay,
  getValueByKeyRecursively as translate
} from "@/helper";
import { ButtonRounded } from "@/components"; 
import { CheckInOutServices, TemporaryStaffRegistrantServices } from "@/services";

export default function YappleModal(props) {
  const { localeJson, setLoader } = useContext(LayoutContext);
  const layoutReducer = useSelector((state) => state.layoutReducer);
  const {
    open,
    close,
    setBarcode,
    successHeader,
    isCheckIn,
    successCallBack,
    staffEventID,
    isEvent,
    dynamicButtonText,
    eventList = [],
    setRefugeeName,
    setGetListPayload,
    setFamilyCode
  } = props;

  const [currentDiv, setCurrentDiv] = useState("start");
  const [regData, setRegData] = useState([]);
  const url = window.location.href;
  const segments = url.split('/');
  const lastSegment = segments[segments.length - 1];

  //** Services */
  const { eventCheckIn, eventCheckOut, basicInfo } = CheckInOutServices;

  let popupHeader = {
    start: "yapple_modal_start_icon_div",
    failed: "yapple_modal_end_icon_div_part_1",
    success: successHeader,
    loader: "yapple_modal_loader_div_header",
  };

  let popupDivComponent = {
    start: <StartIconDiv></StartIconDiv>,
    failed: <FailedIconDiv></FailedIconDiv>,
    success: (
      <SuccessDiv
        regData={regData}
        close={close}
        setCurrentDiv={setCurrentDiv}
        isCheckIn={isCheckIn}
        successCallBack={successCallBack}
        staffEventID={staffEventID}
        isEvent={isEvent}
        lastSegment={lastSegment}
        eventList={eventList}
        dynamicButtonText={dynamicButtonText}
        setRefugeeName={setRefugeeName}
        setGetListPayload={setGetListPayload}
        setFamilyCode={setFamilyCode}
        {...props}
      ></SuccessDiv>
    ),
    loader: <LoaderDiv></LoaderDiv>,
  };

  const handleBarcode = (data) => {
    setBarcode(data);
    setCurrentDiv("loader");
    let payload = {
      yapple_id: "",
      ppid: "",
      chiica_qr: data,
    };
    if (process?.env?.NEXT_PUBLIC_DEPLOY_ENVIRONMENT) {
      payload['yapple_id'] = data;
      delete payload.chiica_qr;
    }
    basicInfo(payload, registerData);
  };

  const registerData = (res) => {
    if (res) {
      setRegData(res.data);
      setCurrentDiv("success");
      if (layoutReducer?.user?.place?.auto_checkin_flag) {
        myEventListener(res, true);
      }
    } else {
      setCurrentDiv("failed");
    }
  };

  function myEventListener(res, status) {
    // Trigger some functionality after 3 seconds
    var timeOutId = setTimeout(function () {
      // Call your desired functionality here
      let payload = {
        event_id: staffEventID ? staffEventID : layoutReducer?.user?.place?.id,
        yapple_id: res?.data?.yapple_id,
        ppid: "",
      };
      if (status) {
        if (isCheckIn) {
          if (props.type == 'event') {
            eventCheckIn(payload, (res) => {
              setLoader(false);
              setCurrentDiv("start");
              if (res && successCallBack) {
                successCallBack(res);
              }
            })
          }
        }
        else {
          if (props.type == 'event') {
            eventCheckOut(payload, (res) => {
              setLoader(false);
              setCurrentDiv("start");
              if (res && successCallBack) {
                successCallBack(res);
              }
            })
          }
        }
      } else {
        clearTimeout(timeOutId);
      }
    }, 3000);
  }

  return (
    <div>
      <Dialog
        className="custom-modal yappleid-popup w-10 sm:w-8 md:w-4 lg:w-4"
        visible={open}
        header={translate(localeJson, popupHeader[currentDiv])}
        draggable={false}
        blockScroll={true}
        onHide={() => {
          myEventListener({}, false);
          close();
          setCurrentDiv("start");
        }}
      >
        <div className="flex justify-content-center">
          {popupDivComponent[currentDiv]}
          {(currentDiv == "start" || currentDiv == "failed") && (
            <BarcodeReader onScan={handleBarcode} />
          )}
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

function FailedIconDiv() {
  const { localeJson } = useContext(LayoutContext);
  return (
    <div>
      <div className="text-center">
        <h5 className="text-center font-bold" style={{ marginTop: "-10px" }}>
          {translate(localeJson, "yapple_modal_end_icon_div_part_2")}
        </h5>

        <div className="my-3">
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

function SuccessDiv(props) {
  const { locale, localeJson, setLoader } = useContext(LayoutContext);
  const layoutReducer = useSelector((state) => state.layoutReducer);
  const {
    regData,
    setCurrentDiv,
    isCheckIn,
    successCallBack,
    staffEventID,
    isEvent,
    dynamicButtonText,
    eventList,
    setGetListPayload,
    setFamilyCode
  } = props;
  const [isEventDisabled, setEventDisabled] = useState(false);
  let payload = {
    event_id: staffEventID ? staffEventID : layoutReducer?.user?.place?.id,
    yapple_id: regData?.yapple_id,
    ppid: "",
  };

  /** Services */
  const { eventCheckIn, eventCheckOut } = CheckInOutServices;
  const { updateCheckInDetail } = TemporaryStaffRegistrantServices;

  useEffect(() => {
    if (layoutReducer?.user?.place?.type === "place" && isCheckIn) {
      if (regData.is_registered == "1" || regData.is_registered == null) {
        return setEventDisabled(true);
      }
    }
    if (eventList.length > 0) {
      eventList.forEach(element => {
        if (element.yapple_id == regData?.yapple_id) {
          if (setGetListPayload) {
            setGetListPayload((prev) => ({
              ...prev,
              filters: {
                ...prev.filters,
                family_code: regData.family_code,
              },
            }));
            setFamilyCode(regData.family_code)
            // setRefugeeName(regData.refugee_name)
          }
          if (layoutReducer?.user?.place?.type === "place" && regData.is_registered != "1") {
            return setEventDisabled(false);
          }
          return setEventDisabled(true);
        }
      });
    }
  }, [locale])

  const displayToastAndClose = (tag) => {
    toastDisplay(translate(localeJson, tag),'','',"error");
  }

  const confirmPlaceDataBeforeCheckIn = () => {
    if (layoutReducer?.user?.place?.id != regData.place_id) {
      let result = window.confirm(translate(localeJson, 'different_evacuation_confirmation'));
      if (result) {
        updateCheckInDetail({
          place_id: layoutReducer?.user?.place?.id,
          lgwan_family_id: regData.lgwan_familiy_id
        }, (res) => {
          setLoader(false);
          if (res && successCallBack) {
            successCallBack(res);
          }
        })
      }
      else {
        setLoader(false);
      }
    }
    else {
      updateCheckInDetail({
        place_id: regData.place_id,
        lgwan_family_id: regData.lgwan_familiy_id
      }, (res) => {
        setLoader(false);
        if (res && successCallBack) {
          successCallBack(res);
        }
      })
    }
  }

  return (
    <div>
      <div className='mt-2'>
        <div className='flex align-items-center'>
          <div className='page-header3'>{translate(localeJson, "name_kanji")}:</div>
          <div className='page-header3-sub ml-1'>{regData.name}</div>
        </div>
      </div>
      <div className='mt-2'>
        <div className='flex align-items-center'>
          <div className='page-header3'>{translate(localeJson, "refugee_name")}:</div>
          <div className='page-header3-sub ml-1'>{regData.refugee_name}</div>
        </div>
      </div>

      <div className='mt-2'>
        <div className='flex'>
          <div className='page-header3' style={{ whiteSpace: 'nowrap' }}>{translate(localeJson, "address")}:</div>
          <div className='page-header3-sub ml-1' style={{ whiteSpace: 'normal' }}>{regData.address}</div>
        </div>
      </div>
      <div className='mt-2'>
        <div className='flex align-items-center'>
          <div className='page-header3'>{translate(localeJson, "tel")}:</div>
          <div className='page-header3-sub ml-1'>{regData.tel}</div>
        </div>
      </div>
      <div className='mt-2'>
        <div className='flex align-items-center'>
          <div className='page-header3'>{layoutReducer?.user?.place?.type === "place" ? translate(localeJson, "evacuation_date_time") : translate(localeJson, "event_admission_date_time")}:</div>
          <div className='page-header3-sub ml-1'>{regData.join_date ? (locale == 'ja' ? getJapaneseDateTimeDisplayFormat(regData.join_date) : getEnglishDateTimeDisplayFormat(regData.join_date)) : ""}</div>
        </div>
      </div>
      <div className='mt-2'>
        <div className='flex align-items-center'>
          <div className='page-header3'>{layoutReducer?.user?.place?.type === "place" ? translate(localeJson, "evacuation_place") : translate(localeJson, "event")}:</div>
          {
            (props.lastSegment == 'checkout') ?
              <div className='page-header3-sub ml-1'>{layoutReducer?.user?.place?.type === "place" ? regData.place_id == layoutReducer?.user?.place.id ? layoutReducer?.user?.place.name : "" : layoutReducer?.user?.place.name}</div> :
              <div className='page-header3-sub ml-1'>{layoutReducer?.user?.place.name}</div>
          }
        </div>
      </div>
      <div>
        <ButtonRounded
          buttonProps={{
            type: "button",
            rounded: "true",
            custom: "",
            buttonClass:
              "mt-3 update-button border-round-3xl custom-icon-button flex justify-content-center",
            text: dynamicButtonText ? translate(localeJson, props.keyJson) : isCheckIn ? translate(localeJson, "admission_button_yapple") : translate(localeJson, "register_checkout_btn"),
            severity: "primary",
            style: { width: "100%" },
            disabled: isEventDisabled,
            onClick: () => {
              let checkIsFromPlace = layoutReducer?.user?.place?.type === "place" ? true : false;
              if (props.lastSegment == 'checkout' && checkIsFromPlace && regData.is_registered == null) {
                displayToastAndClose(layoutReducer?.user?.place?.type === "place" ? 'case_null_notcheck_in_shelter' : 'case_null_notcheck_in_shelter_evt');
                return
              }
              if (props.lastSegment == 'checkout' && checkIsFromPlace && regData.is_registered == "0") {
                displayToastAndClose('case_zero_notcheck_in_shelter');
                return
              }
              setLoader(true);
              isEvent ?
                (isCheckIn
                  ? (props.type == 'event' ? eventCheckIn(payload, (res) => {
                    setLoader(false);
                    if (res && successCallBack) {
                      successCallBack(res);
                    }
                  }) : CheckInOutServices.checkIn({
                    place_id: layoutReducer?.user?.place?.id,
                    lgwan_family_id: regData.lgwan_familiy_id
                  }, (res) => {
                    setLoader(false);
                    if (res && successCallBack) {
                      successCallBack(res);
                    }
                  }))
                  : (props.type == 'event' ? eventCheckOut(payload, (res) => {
                    setLoader(false);
                    if (res && successCallBack) {
                      successCallBack(res);
                    }
                  }) :
                    CheckInOutServices.placeCheckout({
                      place_id: regData.place_id ?? 0,
                      lgwan_family_id: regData.lgwan_familiy_id
                    }, (res) => {
                      setLoader(false);
                      if (res && successCallBack) {
                        successCallBack(res);
                      }
                    })
                  )) : (
                  confirmPlaceDataBeforeCheckIn()
                );
              setCurrentDiv("start");
            },
          }}
          parentClass={
            "border-round-3xl w-full flex justify-content-center lg:mb-0"
          }
        />
      </div>
      <div>
        <ButtonRounded
          buttonProps={{
            type: "button",
            rounded: "true",
            custom: "",
            buttonClass:
              "my-3 back-button border-round-3xl  flex justify-content-center",
            text: translate(localeJson, "yapple_modal_success_div_white_btn"),
            severity: "primary",
            style: { width: "100%" },
            onClick: () => {
              setCurrentDiv("start");
            },
          }}
          parentClass={
            "border-round-3xl w-full flex justify-content-center lg:mb-0 back-button"
          }
        />
      </div>
    </div>
  );
}

function LoaderDiv() {
  return (
    <div className="my-3">
      <div class="loader-container">
        <div class="loader"></div>
      </div>
    </div>
  );
}
