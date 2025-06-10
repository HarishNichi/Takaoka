import React, { useContext } from "react";
import { Dialog } from "primereact/dialog";
import { Formik } from "formik";
import * as Yup from "yup";

import { Button, ValidationError, Input } from "@/components"; 
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";

export default function SpecialCareEditModal(props) {
  const { localeJson } = useContext(LayoutContext);
  const { open, close, header, buttonText } = props && props;

  const schema = Yup.object().shape({
    name: Yup.string()
      .required(translate(localeJson, "special_care_name_jp_required"))
      .max(255, translate(localeJson, "special_care_name_max_required")),
    name_en: Yup.string()
      .required(translate(localeJson, "special_care_name_en_required"))
      .max(255, translate(localeJson, "special_care_name_en_max_required")),
  });
  const initialValues = props.currentEditObj;
  
  return (
    <>
      <Formik
        validationSchema={schema}
        initialValues={initialValues}
        enableReinitialize
        onSubmit={(values, actions) => {
          if (
            props.registerModalAction == "create" ||
            props.registerModalAction == "edit"
          ) {
            props.submitForm(values);
          }
          close();
          actions.resetForm({ values: initialValues });
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
          <div>
            <form onSubmit={handleSubmit}>
              <Dialog
                className="new-custom-modal"
                header={header}
                visible={open}
                draggable={false}
                blockScroll={true}
                onHide={() => {
                  close();
                  resetForm();
                }}
                footer={
                  <div className="text-center">
                    <Button
                      buttonProps={{
                        buttonClass: "w-8rem back-button",
                        text: translate(localeJson, "cancel"),
                        type: "reset",
                        onClick: () => {
                          close();
                          resetForm();
                        },
                      }}
                      parentClass={"inline back-button"}
                    />
                    <Button
                      buttonProps={{
                        buttonClass: "w-8rem update-button",
                        type: "submit",
                        text: buttonText,
                        onClick: () => {
                          handleSubmit();
                        },
                      }}
                      parentClass={"inline update-button"}
                    />
                  </div>
                }
              >
                <div className={`modal-content`}>
                  <div className="">
                    <div className="modal-header">{header}</div>
                    <div className="modal-field-bottom-space">
                      <Input
                        inputProps={{
                          inputParentClassName: `${
                            errors.name && touched.name && "p-invalid pb-1"
                          }`,
                          labelProps: {
                            text: translate(localeJson, "special_care_name_jp"),
                            inputLabelClassName: "block",
                            spanText: "*",
                            inputLabelSpanClassName: "p-error",
                            labelMainClassName: "modal-label-field-space",
                          },
                          inputClassName: "w-full",
                          id:"name",
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
                            errors.name_en &&
                            touched.name_en &&
                            "p-invalid pb-1"
                          }`,
                          labelProps: {
                            text: translate(localeJson, "special_care_name_en"),
                            inputLabelClassName: "block",
                            spanText: "*",
                            inputLabelSpanClassName: "p-error",
                            labelMainClassName: "modal-label-field-space",
                          },
                          inputClassName: "w-full",
                          id:"name_en",
                          name: "name_en",
                          value: values.name_en,
                          onChange: handleChange,
                          onBlur: handleBlur,
                        }}
                      />
                      <ValidationError
                        errorBlock={
                          errors.name_en && touched.name_en && errors.name_en
                        }
                      />
                    </div>
                    <div className="text-center">
                      <div className="modal-button-footer-space">
                        <Button
                          buttonProps={{
                            buttonClass: "w-full update-button",
                            type: "submit",
                            text: buttonText,
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
                            type: "reset",
                            onClick: () => {
                              close();
                              resetForm();
                            },
                          }}
                          parentClass={"back-button"}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog>
            </form>
          </div>
        )}
      </Formik>
    </>
  );
}
