import React, { useEffect, useState, useContext } from "react";

import ButtonGroup from "@/components/masterQuestion/multiSelect.js";
import SingleSelectButtonGroup from "@/components/masterQuestion/singleSelect.js";
import { CommonServices } from "@/services";
import { convertToSingleByte, getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { Input, InputDropdown } from "@/components";

const QuestionList = ({
  questions,
  isModal,
  isRecording,
  setIsRecording,
  setQuestions,
  isEdit,
  isFormSubmitted = false,
  setHasErrors = false,
  count = 0,
}) => {
  const { locale, localeJson } = useContext(LayoutContext);
  const { getText } = CommonServices;
  const [isFormSubmit, setIsFormSubmit] = useState(false);
  const [isQRecording, setQIsRecording] = useState(isRecording);

  useEffect(() => {
    setQIsRecording(isRecording);
  }, [isRecording]);

  const handleRecordingStateChange = (isRecord) => {
    setIsRecording(isRecord);
    setQIsRecording(isRecord);
  };

  useEffect(() => {
    const hasError = questions.some(
      (question) => question.isRequired === 1 && (question?.answer ? question.answer.length == 0 : true)
    );
    let val = hasError;
    // Set hasErrors based on the result
    setHasErrors(val);
    setIsFormSubmit(isFormSubmitted);
  }, [locale, count, questions]);

  const handleSelectionChange = (selectedNames, id) => {
    // Assuming you want to update both question.answer and question.answer_en for multiple-selection (type 1)
    setQuestions((prevQuestions) => {
      const updatedQuestions = prevQuestions.map((question) => {
        if (question.id === id) {
          // Update question.answer and question.answer_en with selectedNames
          const updatedAnswer = [];
          const updatedAnswerEn = [];
          const processedNames = new Set();

          selectedNames?.forEach((selectedName) => {
            if (!processedNames.has(selectedName)) {
              const indexInOptions = question.options.indexOf(selectedName);
              const indexInOptionsEn = question.options_en.indexOf(selectedName);

              if (indexInOptions !== -1) {
                updatedAnswer.push(selectedName);
                updatedAnswerEn.push(question.options_en[indexInOptions]);
              } else if (indexInOptionsEn !== -1) {
                updatedAnswer.push(question.options[indexInOptionsEn]);
                updatedAnswerEn.push(question.options_en[indexInOptionsEn]);
              }

              processedNames.add(selectedName);
            }
          });

          return { ...question, answer: updatedAnswer, answer_en: updatedAnswerEn };
        }
        return question;
      });
      return updatedQuestions;
    });
  };

  const handleSingleSelectionChange = (selectedName, id) => {
    // Assuming you want to update both question.answer and question.answer_en for single-selection (type 2)
    setQuestions((prevQuestions) => {
      const updatedQuestions = prevQuestions.map((question) => {
        if (question.id === id) {
          let selectedIndex = question.options.indexOf(selectedName);

          // If the selectedName is not found in options, check options_en
          if (selectedIndex === -1) {
            selectedIndex = question.options_en.indexOf(selectedName);

            if (selectedIndex !== -1) {
              // Update question.answer_en with selectedName
              // Update question.answer with the corresponding translation
              return {
                ...question,
                answer: [question.options[selectedIndex]],
                answer_en: [question.options_en[selectedIndex]],
              };
            }
          } else {
            // Update question.answer with selectedName
            // Update question.answer_en with the corresponding translation
            return {
              ...question,
              answer: [selectedName],
              answer_en: [question.options_en[selectedIndex]],
            };
          }
        }
        return question;
      });
      return updatedQuestions;
    });
  };

  const handleNumberTypeQuestion = (value, id) => {
    // Assuming you want to update question.answer for number type (type 3 and type 4)
    setQuestions((prevQuestions) => {
      const updatedQuestions = prevQuestions.map((question) => {
        if (question.id === id) {
          // Update question.answer with the number value
          const re = /^[0-9-]+$/;
          if ((re.test(convertToSingleByte(value))) || value == "") {
            let ogValue = value;
            let newValue = convertToSingleByte(value);
            const updatedAnswer = newValue !== "" ? [newValue] : []; // Handle empty value
            const updatedOgAnswer = ogValue !== "" ? [ogValue] : [];
            return { ...question, answer: updatedAnswer, answer_en: updatedAnswer, ogAnswer: updatedOgAnswer };
          }
        }
        return question;
      });
      return updatedQuestions;
    });
  };

  const handleTextTypeQuestion = (value, id) => {
    // Assuming you want to update question.answer for number type (type 3 and type 4)
    setQuestions((prevQuestions) => {
      const updatedQuestions = prevQuestions.map((question) => {
        if (question.id === id) {
          // Update question.answer with the number value
          const updatedAnswer = value !== "" ? [value] : []; // Handle empty value
          return { ...question, answer: updatedAnswer, answer_en: updatedAnswer };
        }
        return question;
      });
      return updatedQuestions;
    });
  };

  const handleSelectTypeQuestion = (value, id) => {
    // Assuming you want to update question.answer for dropdown type (type 5)
    setQuestions((prevQuestions) => {
      const updatedQuestions = prevQuestions.map((question) => {
        if (question.id === id) {
          // Update question.answer with the selected value
          let selectedIndex;
          if (locale == 'ja') {
            selectedIndex = question.options.indexOf(value)
          } else {
            selectedIndex = question.options_en.indexOf(value)
          }
          return {
            ...question,
            answer: [question.options[selectedIndex]],
            answer_en: [question.options_en[selectedIndex]]
          };
        }
        return question;
      });
      return updatedQuestions;
    });
  };

  function convertOptions(options) {
    return options.map((option) => {
      return { name: option, value: option };
    });
  }

  return (
    <div>
      {questions?.map((question, index) => (
        <div key={index} className={`${isModal ? 'mb-4' : 'mb-4'}`}>
          <label className={`custom-label flex ${isModal ? "col-12 mb-0 pb-0" : "pb-0"} font-bold`}>
            {locale == 'ja' ? question.title : (question.title_en ? question.title_en : question.title)}
            {question.isRequired == 1 && <span className="p-error scroll-check" style={{ display: "contents" }}>*</span>}
          </label>
          {question.type === 1 && (
            <div className="">
              <div className={`${isModal ? "col-12 pt-0 pb-0" : "mb-1"}`}>
                {locale == 'ja' && <ButtonGroup
                  id={question.id}
                  names={question.options}
                  SNames={
                    isEdit ? (question.answer ? question.answer : []) : []
                  }
                  onSelectionChange={handleSelectionChange}
                  isModal={isModal}
                />}
                {locale == 'en' && <ButtonGroup
                  id={question.id}
                  names={question.options_en}
                  SNames={
                    isEdit ? (question.answer_en ? question.answer_en : []) : []
                  }
                  onSelectionChange={handleSelectionChange}
                  isModal={isModal}
                />}
                {question.isRequired === 1 &&
                  (!question.answer || question.answer?.length == 0 || question.answer[0] == "") &&
                  isFormSubmit && (
                    <div style={{ fontSize: '13px' }} className="p-error scroll-check">{translate(localeJson, "c_required")}</div>
                  )}
              </div>
            </div>
          )}
          {question.type === 2 && (
            <div className={`${isModal ? "col-12 pt-0 pb-0" : "mb-1"}`}>
              {locale == 'ja' && <SingleSelectButtonGroup
                id={question.id}
                names={question.options}
                SNames={
                  isEdit ? (question.answer ? question.answer[0] : "") : ""
                }
                onSelectionChange={handleSingleSelectionChange}
                isModal={isModal}
              />}
              {locale == 'en' && <SingleSelectButtonGroup
                id={question.id}
                names={question.options_en}
                SNames={
                  isEdit ? (question.answer_en ? question.answer_en[0] : "") : ""
                }
                onSelectionChange={handleSingleSelectionChange}
                isModal={isModal}
              />}
              {question.isRequired === 1 &&
                (!question.answer || question.answer?.length == 0 || question.answer[0] == "") &&
                isFormSubmit && (
                  <>
                    <div style={{ fontSize: '13px' }} className="p-error scroll-check">{translate(localeJson, "c_required")}</div>
                  </>
                )}
            </div>
          )}
          {question.type === 3 && (
            <div className={`${isModal ? "col-12 pt-1" : "pt-1 mb-0 col-12 pl-0 pr-0 pb-0 mt-0"}`}>
              <Input
                inputProps={{
                  inputParentClassName: `custom_input w-full`,
                  labelProps: {
                    text: "",
                    inputLabelClassName: "w-full font-bold",
                    labelMainClassName: "pb-1",
                  },
                  inputClassName: "w-full",
                  id: "text",
                  name: "text",
                  value: question?.answer && question.answer[0] !== "" ? question.answer[0] : "",
                  disabled: isQRecording ? true : false,
                  onChange: (evt) => {
                    let numberValue = evt.target.value;
                    handleTextTypeQuestion(numberValue, question.id);
                  },
                  inputRightIconProps: {
                    display: question?.isVoiceRequired || false,
                    audio: {
                      display: question?.isVoiceRequired || false,
                    },
                    icon: "",
                    isRecording: isQRecording,
                    onRecordValueChange: (rec) => {
                      const fromData = new FormData();
                      fromData.append("audio_sample", rec);
                      getText(fromData, (res) => {
                        let Value = res?.data?.content;
                        if (Value) {
                          handleTextTypeQuestion(Value, question.id);
                        }
                      });
                    },
                    onRecordingStateChange: handleRecordingStateChange,
                  },
                }}
              />
              {question.isRequired === 1 &&
                (!question.answer || question.answer?.length == 0 || question.answer[0] == "") &&
                isFormSubmit && (
                  <div style={{ fontSize: '13px' }} className="p-error scroll-check">{translate(localeJson, "c_required")}</div>
                )}
            </div>
          )}
          {question.type === 4 && (
            <div className={`${isModal ? "col-12 pt-1" : "pt-1 mb-0 col-12 pl-0 pr-0 pb-0 mt-0"}`}>
              <Input
                inputProps={{
                  inputParentClassName: `custom_input w-full`,
                  labelProps: {
                    text: "",
                    inputLabelClassName: "w-full font-bold",
                    labelMainClassName: "pb-1",
                  },
                  inputClassName: "w-full",
                  id: "text",
                  name: "text",
                  value: question?.answer && question.answer[0] !== "" ? question?.ogAnswer ? question?.ogAnswer[0] : question?.answer[0] : "",
                  disabled: isQRecording ? true : false,
                  keyfilter: "int",
                  inputMode: "numeric",
                  onChange: (evt) => {
                    let numberValue = evt.target.value;
                    handleNumberTypeQuestion(numberValue, question.id);
                  },
                  inputRightIconProps: {
                    display: question?.isVoiceRequired || false,
                    audio: {
                      display: question?.isVoiceRequired || false,
                    },
                    icon: "",
                    isRecording: isQRecording,
                    onRecordValueChange: (rec) => {
                      const fromData = new FormData();
                      fromData.append("audio_sample", rec);
                      getText(fromData, (res) => {
                        let numberValue = res?.data?.content;
                        numberValue = parseInt(numberValue);
                        if (numberValue) {
                          handleNumberTypeQuestion(numberValue, question.id);
                        }
                      });
                    },
                    onRecordingStateChange: handleRecordingStateChange,
                  },
                }}
              />
              {question.isRequired === 1 &&
                (!question.answer || question.answer?.length == 0 || question.answer[0] == "") &&
                isFormSubmit && (
                  <div style={{ fontSize: '13px' }} className="p-error scroll-check">{translate(localeJson, "c_required")}</div>
                )}
            </div>
          )}
          {question.type === 5 && (
            <div className={`${isModal ? "col-12 pt-1" : "mb-1 col-12 pl-0 pr-0 mt-0 p-0 pt-1"}`}>
              <InputDropdown inputDropdownProps={{
                inputDropdownParentClassName: `custom_input `,
                inputDropdownClassName: "w-full",
                name: "id",
                value: locale == 'ja' ? (question?.answer ? question.answer[0] : "") : (question?.answer_en ? question.answer_en[0] : ""),
                options: convertOptions(locale == 'ja' ? question.options : (question.options_en.length > 0 ? question.options_en : question.options)),
                optionLabel: "name",
                onChange: (evt) => {
                  let numberValue = evt.target.value;
                  handleSelectTypeQuestion(numberValue, question.id);
                },
                emptyMessage: translate(localeJson, "data_not_found"),
              }}
              />
              {question.isRequired === 1 &&
                (!question.answer || question.answer?.length == 0 || question.answer[0] == "") &&
                isFormSubmit && (
                  <div style={{ fontSize: '13px' }} className="p-error scroll-check">{translate(localeJson, "c_required")}</div>
                )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuestionList;
