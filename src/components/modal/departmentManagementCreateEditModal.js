import React, { useContext } from "react";
import { Dialog } from "primereact/dialog";
import { Formik } from "formik";
import * as Yup from "yup";

import { Input, Button, ValidationError } from "@/components";
import {
  convertToSingleByte,
  getValueByKeyRecursively as translate,
} from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { DepartmentManagementServices } from "@/services";

export default function DepartmentCreateEditModal(props) {
  const { localeJson } = useContext(LayoutContext);
  const { open, close, registerModalAction, currentObj, refreshList } = props;

  /* -------------------- Validation Schema -------------------- */
  const schema = Yup.object().shape({
    name: Yup.string()
      .required(translate(localeJson, "department_name_required")),
    code: Yup.string()
      .required(translate(localeJson, "department_code_required"))
  });

  /* -------------------- Render -------------------- */
  return (
    <Formik
      initialValues={currentObj}
      validationSchema={schema}
      enableReinitialize={true}
      onSubmit={(values, { resetForm }) => {
        const payload = {
          name: convertToSingleByte(values.name),
          code: convertToSingleByte(values.code),
        };
        props.onRegister(payload);

        if (registerModalAction === "create") {
          DepartmentManagementServices.addDepartment(payload, (res) => {
            if (res.success) {
              refreshList();
              resetForm();
              close();
            }
          });
        } else if (registerModalAction === "edit") {
          DepartmentManagementServices.updateDepartment(
            currentObj.id,
            payload,
            (res) => {
              if (res.success) {
                refreshList();
                resetForm();
                close();
              }
            }
          );
        }
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
      }) => (
        <form onSubmit={handleSubmit}>
          <Dialog
            className="new-custom-modal"
            header={
              registerModalAction === "create"
                ? translate(localeJson, "add_department")
                : translate(localeJson, "edit_department")
            }
            visible={open}
            draggable={false}
            blockScroll={true}
            onHide={() => {
              resetForm();
              close();
            }}
            footer={
              /* ---- Footer Buttons (desktop) ---- */
              <div className="text-center">
                <Button
                  buttonProps={{
                    buttonClass: "w-8rem back-button",
                    text: translate(localeJson, "cancel"),
                    onClick: () => {
                      resetForm();
                      close();
                    },
                  }}
                  parentClass="inline back-button"
                />
                <Button
                  buttonProps={{
                    buttonClass: "w-8rem update-button",
                    type: "submit",
                    text:
                      registerModalAction === "create"
                        ? translate(localeJson, "submit")
                        : translate(localeJson, "update"),
                  }}
                  parentClass="inline update-button"
                />
              </div>
            }
          >
            {/* ---- Form Fields ---- */}
            <div className="modal-content">
              <div className="modal-field-bottom-space">
                <Input
                  inputProps={{
                    inputParentClassName: `${
                      errors.name && touched.name ? "p-invalid pb-1" : ""
                    }`,
                    labelProps: {
                      text: translate(localeJson, "name"),
                      inputLabelClassName: "block",
                      spanText: "*",
                      inputLabelSpanClassName: "p-error",
                      labelMainClassName: "modal-label-field-space",
                    },
                    inputClassName: "w-full",
                    id: "name",
                    name: "name",
                    value: values.name,
                    onChange: handleChange,
                    onBlur: handleBlur,
                  }}
                />
                <ValidationError
                  errorBlock={errors.name && touched.name && errors.name}
                />
              </div>

              <div className="modal-field-bottom-space">
                <Input
                  inputProps={{
                    inputParentClassName: `${
                      errors.code && touched.code ? "p-invalid pb-1" : ""
                    }`,
                    labelProps: {
                      text: translate(localeJson, "department_id"),
                      inputLabelClassName: "block",
                      spanText: "*",
                      inputLabelSpanClassName: "p-error",
                      labelMainClassName: "modal-label-field-space",
                    },
                    inputClassName: "w-full",
                    id: "code",
                    name: "code",
                    value: values.code,
                    onChange: handleChange,
                    onBlur: handleBlur,
                  }}
                />
                <ValidationError
                  errorBlock={errors.code && touched.code && errors.code}
                />
              </div>

              <div className="text-center">
                <div className="modal-button-footer-space">
                  <Button
                    buttonProps={{
                      buttonClass: "w-full update-button",
                      type: "submit",
                      text:
                        props.registerModalAction == "create"
                          ? translate(localeJson, "submit")
                          : translate(localeJson, "update"),
                      severity: "primary",
                      onClick: () => {
                        handleSubmit();
                      },
                    }}
                    parentClass={"update-button"}
                  />
                </div>
                <div>
                  <Button
                    buttonProps={{
                      buttonClass: "w-full back-button",
                      text: translate(localeJson, "cancel"),
                      onClick: () => {
                        resetForm();
                        close();
                      },
                    }}
                    parentClass={"back-button"}
                  />
                </div>
              </div>
            </div>
          </Dialog>
        </form>
      )}
    </Formik>
  );
}
