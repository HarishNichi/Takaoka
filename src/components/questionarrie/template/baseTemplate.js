import React, { useContext, useState, useEffect } from 'react';
import { SelectButton } from 'primereact/selectbutton';

import { Button, InputSwitch, NormalCheckBox, Input } from '@/components';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { getValueByKeyRecursively as translate } from "@/helper";

const BaseTemplate = React.forwardRef((props, ref) => {
    const { localeJson, locale } = useContext(LayoutContext);
    const { removeQuestion, handleItemChange, itemIndex } = props;

    const [item, setItem] = useState();
    const [jpTitleError, setJpTitleError] = useState('');
    const [choiceError, setChoiceError] = useState('');
    const selectionMode = [
        {
            "key": 1,
            "name": translate(localeJson, 'selection')
        },
        {
            "key": 3,
            "name": translate(localeJson, 'description')
        },
        {
            "key": 4,
            "name": translate(localeJson, 'numeric')
        }
    ];
    const innerSelectionMode = [
        {
            "key": 1,
            "name": translate(localeJson, 'checkbox')
        },
        {
            "key": 2,
            "name": translate(localeJson, 'radio')
        },
        {
            "key": 5,
            "name": translate(localeJson, 'dropdown')
        }
    ];

    useEffect(() => {
        if (props?.item) {
            setItem(props?.item);
        }
    }, [props?.item])

    const updateInputFieldValue = (value, index, field) => {
        let updatedData = { ...item };
        if (field == "jp") {
            updatedData.option[index] = value;
            if (updatedData.selected_type == 1 && updatedData.option[0] == "") {
                setChoiceError(translate(localeJson, "option_is_required"))
            }
            else {
                setChoiceError("");
            }
        }
        else {
            updatedData.option_en[index] = value;
        }
        setItem(updatedData);
        handleItemChange(updatedData, itemIndex);
    }

    const validateInput = (value, field) => {
        let isValid = true;
        if (field == "jp_title" && !value.trim()) {
            setJpTitleError(translate(localeJson, 'item_title_is_required'));
            isValid = false;
        }
        return isValid;
    };

    const updateFormChangeData = (value, field) => {
        let updatedData = { ...item };
        if (field == "required") {
            updatedData.is_required = value;
        }
        if (field == "visible") {
            updatedData.is_visible = value;
        }
        if (field == "voice") {
            updatedData.is_voice_type = value;
        }
        if (field == "selection_mode") {
            updatedData.selected_type = value;
            if (value == 1 && updatedData.option.length == 0) {
                updatedData.option.push("");
                updatedData.option_en.push("");
            }
            if (value == 1) {
                updatedData.is_voice_type = false;
            }
        }
        if (field == "sub_selection") {
            updatedData.inner_question_type = value;
        }
        if (field == "jp_title") {
            const isValid = validateInput(value, field);
            if (isValid) {
                setJpTitleError("");
                updatedData.questiontitle = value;
            } else {
                updatedData.questiontitle = value;
            }
        }
        if (field == "en_title") {
            updatedData.questiontitle_en = value;
        }
        if (field == "add") {
            updatedData.option.push("");
            updatedData.option_en.push("");
        }
        if (field == "delete") {
            updatedData.option.splice(value, 1)
            updatedData.option_en.splice(value, 1)
        }
        setItem(updatedData);
        handleItemChange(updatedData, itemIndex);
    }

    React.useImperativeHandle(ref, () => ({
        validateQuestionnaires,
    }));

    const validateQuestionnaires = (question) => {
        let validFlag = true;
        if (question.questiontitle == '' || (question.selected_type == 1 && question.option[0] == '')) {
            validFlag = false
        }
        if (question.questiontitle == "") {
            setJpTitleError(translate(localeJson, 'item_title_is_required'));
        }
        if (question.option[0] == "") {
            setChoiceError(translate(localeJson, "option_is_required"));
        }
        return validFlag;
    }

    const itemTemplate = (item) => {
        return (
            <div>
                <form>
                    <div>
                        <div>
                            {/* Questionnaires header */}
                            <div className="flex align-items-center justify-content-end">
                                {/* <div className="">
                                    {translate(localeJson, 'item')} {item.title + (itemIndex + 1)}
                                </div> */}
                                <Button buttonProps={{
                                    text: `${translate(localeJson, 'delete')}`,
                                    buttonClass: "del_ok-button-questionnaire",
                                    rounded: "true",
                                    type: "button",
                                    icon: "pi pi-trash pt-1",
                                    onClick: () => removeQuestion()
                                }} parentClass={"del_ok-button-questionnaire"} />
                            </div>
                            <div className="mt-3 col-12 sm:col-8 md:col-8 lg:col-8 pl-0">
                                <div className='flex align-items-center justify-content-between'>
                                    <div className='flex gap-2 text-sm'>
                                        <NormalCheckBox checkBoxProps={{
                                            checked: item.is_required,
                                            onChange: (e) => updateFormChangeData(e.checked, "required")
                                        }} />
                                        <div className={`${locale == 'en' ? 'pt-1' : 'pt-0'}`}>
                                            {translate(localeJson, 'required') + " " + translate(localeJson, 'item')}
                                        </div>
                                    </div>
                                    <div className='flex gap-2 text-sm'>
                                        <NormalCheckBox checkBoxProps={{
                                            checked: item.is_visible,
                                            onChange: (e) => updateFormChangeData(e.checked, "visible")
                                        }} />
                                        <div className={`${locale == 'en' ? 'pt-1' : 'pt-0'}`}>
                                            {translate(localeJson, 'display_in_registration_screen')}
                                        </div>
                                    </div>
                                </div>
                                <div className='block align-items-center justify-content-between'>
                                    <div className='mt-3 gap-3'>
                                        <div>
                                            <span className='font-bold'>{translate(localeJson, 'item_structure')}</span>
                                        </div>
                                        <div className="flex align-items-center">
                                            <SelectButton
                                                options={selectionMode}
                                                value={selectionMode.find((obj) => item.selected_type == obj.key)}
                                                optionLabel={'name'}
                                                disabled={item.id ? true : false}
                                                onChange={(e) => updateFormChangeData(e.value.key, "selection_mode")}
                                            />
                                        </div>
                                        {item.selected_type == 1 && !item?.id && (
                                            <div className='mt-3 gap-3'>
                                                <div>
                                                    <span className='font-bold'>{translate(localeJson, 'selection_method')}</span>
                                                </div>
                                                <div className="flex align-items-center">
                                                    <SelectButton
                                                        options={innerSelectionMode}
                                                        value={innerSelectionMode.find((obj) => item.inner_question_type == obj.key)}
                                                        optionLabel={'name'}
                                                        onChange={(e) => updateFormChangeData(e.value.key, "sub_selection")}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className='mt-3 custom-switch flex gap-2 align-items-center justify-content-start pr-54px font-14px'>
                                        <InputSwitch inputSwitchProps={{
                                            checked: item.is_voice_type,
                                            onChange: (e) => updateFormChangeData(e.value, "voice"),
                                            disabled: item.selected_type == 1 ? true : false
                                        }} />
                                        {translate(localeJson, 'voice_input')}
                                    </div>
                                </div>
                            </div>
                            {/* Questionnaires */}
                            <div className="mt-3" >
                                <div className="flex font-bold align-items-center justify-content-start">
                                    {translate(localeJson, 'item_title')}<span className='required-color' >*</span>
                                </div>
                                <div className="mt-2">
                                    <div className=''>
                                        <Input inputProps={{
                                            inputClassName: "w-full",
                                            id: "jp_title",
                                            name:"jp_title",
                                            value: item.questiontitle,
                                            maxLength: 255,
                                            placeholder: translate(localeJson, 'jp_title_placeholder'),
                                            onChange: (e) => {
                                                updateFormChangeData(e.target.value, 'jp_title')
                                            }

                                        }} />
                                        {jpTitleError && <div className="error-message">{jpTitleError}</div>}
                                    </div>
                                    <div className='mt-2 align-items-center'>
                                        <Input inputProps={{
                                            inputClassName: "w-full",
                                            id: "en_title",
                                            name:"en_title",
                                            value: item.questiontitle_en,
                                            maxLength: 255,
                                            placeholder: translate(localeJson, 'en_title_placeholder'),
                                            onChange: (e) => {
                                                updateFormChangeData(e.target.value, 'en_title')
                                            }
                                        }} />
                                    </div>
                                </div>
                            </div>
                            {/* Questionnaires options */}
                            {item.selected_type == 1 &&
                                <div className="mt-3 font-bold flex align-items-center justify-content-start">
                                    {translate(localeJson, 'choice')}
                                </div>
                            }
                            {item.selected_type == 1 && (
                                Array.isArray(item.option) && item.option.map((option, i) => (
                                    <div key={i} className="mt-2">
                                        <div className="mt-2" >
                                            <div className='flex gap-1 align-items-center justify-content-between'>
                                                <Input inputProps={{
                                                    inputParentClassName: 'w-12',
                                                    id:"jp_option",
                                                    name:"jp_option",
                                                    value: option,
                                                    inputClassName: "w-12",
                                                    maxLength: 255,
                                                    placeholder: translate(localeJson, 'jp_option_placeholder') + (i + 1),
                                                    onChange: (e) => updateInputFieldValue(e.target.value, i, "jp")
                                                }}
                                                />
                                                <div className='w-12 flex align-items-center gap-2'>
                                                    <Input inputProps={{
                                                        id:"jp_option_en",
                                                        name:"jp_option_en",
                                                        inputParentClassName: 'w-12',
                                                        value: item.option_en[i],
                                                        inputClassName: "w-12",
                                                        maxLength: 255,
                                                        placeholder: translate(localeJson, 'en_option_placeholder') + (i + 1),
                                                        onChange: (e) => updateInputFieldValue(e.target.value, i, "en")
                                                    }}
                                                    />
                                                    <button className="pi pi-trash text-red-600 border-none bg-transparent" type='button' disabled={i === 0} onClick={() => updateFormChangeData(i, 'delete')} />
                                                </div>
                                            </div>
                                            {choiceError && (i == 0) && <div className="error-message">{choiceError}</div>}
                                        </div>
                                    </div>
                                ))
                            )}
                            {item.selected_type == 1 &&
                                <div className='mt-2 flex align-items-center justify-content-center'>
                                    <Button buttonProps={{
                                        text: `＋ ${translate(localeJson, 'add_choice')}`,
                                        buttonClass: "create-button-questionnaire",
                                        rounded: "true",
                                        type: "button",
                                        onClick: () => updateFormChangeData(1, "add")
                                    }} parentClass={"create-button-questionnaire"}
                                    />
                                </div>
                            }
                        </div>
                    </div>
                </form>
            </div>
        );
    };

    return (
        <>
            <div className="grid custom_orderlist">
                <div className="col-12 question-block">
                    {item && (
                        <>
                            {itemTemplate(item)}
                        </>
                    )}
                </div>
            </div>
        </>
    )
});

BaseTemplate.displayName = 'BaseTemplate';
export default BaseTemplate;