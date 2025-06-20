import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { Input } from "@/components";

import {
  Button,
  ButtonRounded,
  CustomHeader,
  QrScannerModal,
} from "@/components";
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { UserQrService } from "@/services";
import { setCheckInData } from "@/redux/qr_app";
import QrAppConfirmDialog from "@/components/modal/qrAppConfirmationModal";
import { Formik } from "formik";
import * as Yup from "yup";
// import _ from "lodash";

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
  const [empId, setEmpId] = useState("");
  const [empName, setEmpName] = useState("");
  const closeQrPopup = () => {
    setOpenQrPopup(false);
  };
  const { register, create } = UserQrService;
  const validationSchema = Yup.object().shape({
    empId: Yup.string().required(translate(localeJson, "employee_id_required")),
    empName: Yup.string().required(
      translate(localeJson, "employee_name_required")
    ),
  });
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
  const handleSearch = () => {
    if (!empId || !empName) return;

    setLoader(true);
    const payload = {
      employee_id: empId,
      employee_name: empName,
      place_id: placeId,
    };

    create(payload, (res) => {
      setLoader(false);
      if (res) {
        dispatch(setCheckInData(res.data?.data));
        router.push("/user/qr/app/register");
      }
    });
  };

  return (
    <div className="">
      <QrScannerModal
        open={openQrPopup}
        close={closeQrPopup}
        callback={qrResult}
      />

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
      {/* Top Title Bar */}
      <div className="flex justify-content-between align-items-center">
        <CustomHeader
          headerClass="page-header1"
          customParentClassName="mb-0"
          header={translate(localeJson, "qr_scan")}
        />
      </div>

      <div className="grid flex-1 p-4 md:p-6">
        {/* Left Section */}
        <div className="col-12 md:col-6 flex flex-column justify-content-center align-items-center gap-6 p-4 md:border-right-1 ">

          <ButtonRounded
            buttonProps={{
              custom: "userDashboard",
              buttonClass:
                "flex align-items-center justify-content-center  primary-button h-3rem md:h-10rem lg:h-10rem ",
              type: "submit",
              rounded: "true",
              text: translate(localeJson, "qr_scanner_popup_btn"),
              onClick: () => {
                setOpenQrPopup(true);
              },
            }}
            parentClass={"userParentDashboard primary-button w-full"}
          />
        </div>

        {/* Right Section */}
        <div className="col-12 md:col-6 flex flex-column justify-content-center gap-4 p-4">

          {/* ⬇️ Employee ID */}
          <Formik
            initialValues={{ empId: "", empName: "" }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              const payload = {
                employee_id: values.empId,
                employee_name: values.empName,
                place_id: placeId,
              };
              setLoader(true);
              create(payload, (res) => {
                setLoader(false);
                if (res) {
                  dispatch(setCheckInData(res.data?.data));
                  router.push("/user/qr/app/register");
                }
              });
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
            }) => (
              <form
                onSubmit={handleSubmit}
                className="col-12 md:col-6 flex flex-column justify-content-center p-4 w-full"
              >
                <div className="mb-3">
                {/* Employee ID (名前) */}
                <Input
                  inputProps={{
                    inputParentClassName: `w-full custom_input ${
                      errors.empId && touched.empId ? "p-invalid" : ""
                    }`,
                    labelProps: {
                      text: translate(localeJson, "employee_id"),
                      inputLabelClassName: "block",
                      spanText: "*",
                      inputLabelSpanClassName: "p-error",
                      labelMainClassName: "pb-1",
                    },
                    inputClassName: "w-full",
                    id: "empId",
                    name: "empId",
                    value: values.empId,
                    onChange: handleChange,
                    onBlur: handleBlur,
                    placeholder: translate(
                      localeJson,
                      "placeholder_please_enter_id"
                    ),
                    hasIcon: false,
                    inputRightIconProps: {
                      display: false,
                      audio: { display: false },
                      icon: "",
                    },
                  }}
                />
                </div>
                {/* Employee Name (世帯番号) */}
                <div className="mb-3">
                <Input
                  inputProps={{
                    inputParentClassName: `w-full custom_input ${
                      errors.empName && touched.empName ? "p-invalid" : ""
                    }`,
                    labelProps: {
                      text: translate(localeJson, "employee_name"),
                      inputLabelClassName: "block",
                      spanText: "*",
                      inputLabelSpanClassName: "p-error",
                      labelMainClassName: "pb-1",
                    },
                    inputClassName: "w-full",
                    id: "empName",
                    name: "empName",
                    value: values.empName,
                    onChange: handleChange,
                    onBlur: handleBlur,
                    placeholder: translate(
                      localeJson,
                      "placeholder_please_enter_employee_name"
                    ),
                    hasIcon: false,
                    inputRightIconProps: {
                      display: false,
                      audio: { display: false },
                      icon: "",
                    },
                  }}
                />
                </div>
                {/* Search Button */}
                <Button
                  parentClass="w-full mt-2"
                  buttonProps={{
                    type: "submit",
                    rounded: true,
                    text: translate(localeJson, "search"),
                    buttonClass: "w-full py-3 border-none text-lg font-bold",
                  }}
                />
              </form>
            )}
          </Formik>

        </div>
      </div>
    </div>
  );
}
