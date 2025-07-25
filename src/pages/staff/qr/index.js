import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { Input, ValidationError } from "@/components";
import { useMemo } from "react";

import {
  Button,
  ButtonRounded,
  CustomHeader,
  QrScannerModal,
} from "@/components";
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { UserQrService,StaffEvacuationServices } from "@/services";
import { setCheckInData } from "@/redux/qr_app";
import QrAppConfirmDialog from "@/components/modal/qrAppConfirmationModal";
import { Formik } from "formik";
import * as Yup from "yup";
import { reset } from "@/redux/layout";
// import _ from "lodash";

export default function App() {
  const { localeJson, locale, setLoader } = useContext(LayoutContext);
  const router = useRouter();
  const dispatch = useDispatch();
  const placeId = localStorage.getItem("place_id");
  const placeName = localStorage.getItem("evacuationPlaceName");
  const placeName_En = localStorage.getItem("evacuationPlaceNameEnglish");
  const [openQrPopup, setOpenQrPopup] = useState(false);
  const [empId, setEmpId] = useState("");
  const [empName, setEmpName] = useState("");
  const closeQrPopup = () => {
    setOpenQrPopup(false);
  };
  const { register, create } = UserQrService;
  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      empId: Yup.string().required(
        translate(localeJson, "employee_id_required")
      ),
    });
  }, [localeJson]);
  
  const qrResult = (res) => {
    let formData = new FormData();
    formData.append("content", res);
    formData.append("place_id", placeId);
     setOpenQrPopup(false);
              setLoader(true);
              StaffEvacuationServices.manualCheckIn(formData, (res) => {
                setLoader(false);
              });
  };


  return (
    <div className="">
      <QrScannerModal
        open={openQrPopup}
        close={closeQrPopup}
        callback={qrResult}
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
            initialValues={{ empId: ""}}
            validationSchema={validationSchema}
            enableReinitialize={true}
            onSubmit={(values, { resetForm }) => {
              const payload = {
                employee_code: values.empId,
                place_id: placeId,
              };
              setLoader(true);
              StaffEvacuationServices.manualCheckIn(payload, (res) => {
                setLoader(false);
                resetForm();
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
              resetForm,
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
                  <ValidationError
                    errorBlock={errors.empId && touched.empId && errors.empId}
                  />
                </div>
                {/* Employee Name (世帯番号) */}
                {/* <div className="mb-3">
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
                  <ValidationError
                    errorBlock={
                      errors.empName && touched.empName && errors.empName
                    }
                  />
                </div> */}
                {/* Search Button */}
                <Button
                  parentClass="w-full mt-2"
                  buttonProps={{
                    type: "submit",
                    rounded: true,
                    text: translate(localeJson, "check_in"),
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
