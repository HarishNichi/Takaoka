/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber as InputNum } from "primereact/inputnumber";
import { Password as Pwd } from "primereact/password";
import { Dropdown } from "primereact/dropdown";
import { Dropdown as Drp } from "antd";
import { MultiSelect as MulSel } from "primereact/multiselect";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Checkbox } from 'primereact/checkbox';
import { AudioRecorder, NormalLabel } from "@/components";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

export const Input = React.memo((props) => {
  const {
    inputParentClassName,
    hasIcon,
    inputParentStyle,
    labelProps,
    inputLeftIconProps,
    inputClassName,
    inputRightIconProps,
    labelDownProps,
    isLoading,
    iconProps,
    float,
    floatLabelProps,
    ariaLabel,
    id,
    name,
    required,
    placeholder,
    ...restProps
  } = props && props.inputProps;

  const [localIsRecording, setLocalIsRecording] = useState(false);
  const [inputId] = useState(id || `input-${Math.random().toString(36).substr(2, 9)}`);

  const handleAudioRecorded = (audioBlob) => {
    inputRightIconProps?.onRecordValueChange(audioBlob);
  };

  const handleRecordingStateChangeLocal = (isRecord) => {
    setLocalIsRecording(isRecord);
    inputRightIconProps?.onRecordingStateChange(isRecord);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputRightIconProps?.onEnter) {
      inputRightIconProps.onEnter(e);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!inputRightIconProps?.isRecording) {
      setLocalIsRecording(inputRightIconProps?.isRecording);
    }
  }, [inputRightIconProps?.isRecording]);

  // Generate meaningful aria-label
  const generateAriaLabel = () => {
    if (ariaLabel) return ariaLabel;
    if (labelProps?.text) return labelProps.text;
    if (name) return name
    if (placeholder) return placeholder;
    return "Input field";
  };

  const ariaLabelText = generateAriaLabel();

  return (
   <>
  {labelProps?.text && inputRightIconProps?.display && (
    <div className={labelProps.labelMainClassName || "pb-1"}>
      <NormalLabel
        labelClass={labelProps.inputLabelClassName}
        text={labelProps.text}
        labelStyle={labelProps.parentStyle}
        spanText={labelProps.spanText}
        spanClass={labelProps.inputLabelSpanClassName}
        htmlFor={inputId}
      />
    </div>
  )}

  <div
    className={`custom_input ${inputParentClassName} 
      ${inputRightIconProps?.audio?.display ? "p-icon-field-right" : ""} 
      ${hasIcon ? "p-icon-field-right" : ""} 
      ${float ? "p-float-label" : ""}`}
    style={inputParentStyle}
  >
    {labelProps?.text && !inputRightIconProps?.display && (
      <div className={labelProps.labelMainClassName || "pb-1"}>
        <NormalLabel
          labelClass={labelProps.inputLabelClassName}
          text={labelProps.text}
          labelStyle={labelProps.parentStyle}
          spanText={labelProps.spanText}
          spanClass={labelProps.inputLabelSpanClassName}
          htmlFor={inputId}
        />
      </div>
    )}

{(inputLeftIconProps?.display || inputRightIconProps?.display || isLoading || localIsRecording) ? (
   <IconField
  iconPosition={
    inputLeftIconProps?.display ? "left" :
    inputRightIconProps?.display ? "right" :
    undefined
  }
>
  <InputIcon className={localIsRecording||isLoading?'w-full':''}>

    {localIsRecording && (
      <i className="flex justify-content-center w-full" aria-hidden="true">
        <i className="pi pi-spin pi-spinner pl-0" />
      </i>
    )}

    {isLoading && (
      <i className="flex justify-content-center w-full" aria-hidden="true">
        <i className="pi pi-spin pi-spinner pt-2 pb-2" />
      </i>
    )}
  </InputIcon>
  {/* Left Icon (Safe fallback) */}
  <InputIcon>
    {inputLeftIconProps?.display ? (
      inputLeftIconProps?.audio?.display ? (
        <AudioRecorder
          onAudioRecorded={handleAudioRecorded}
          onRecordingStateChange={handleRecordingStateChangeLocal}
          disabled={
            inputLeftIconProps?.disabled ||
            (inputLeftIconProps?.isRecording && !localIsRecording)
          }
          isRecording={localIsRecording}
          customClass={inputLeftIconProps.audioCustomClass}
          customStyle={inputLeftIconProps.audioCustomStyle}
          aria-label={`Record audio for ${ariaLabelText}`}
        />
      ) : (
        <span aria-hidden="true">{inputLeftIconProps?.icon || <></>}</span>
      )
    ) : <></>}
  </InputIcon>

  {/* Always render the input */}
  <InputText
    id={inputId}
    name={name}
    className={`${inputClassName}`}
    aria-label={ariaLabelText}
    aria-required={required}
    aria-describedby={restProps['aria-describedby']}
    onKeyDown={handleKeyDown}
    {...restProps}
    autoComplete={process?.env?.NEXT_PUBLIC_AUTO_COMPLETE}
  />

  {/* Right Icon (Safe fallback) */}
  <InputIcon>
    {inputRightIconProps?.display ? (
      inputRightIconProps?.audio?.display ? (
        <i className="flex align-items-center">
          {inputRightIconProps?.password?.display && (
            <i
              className={inputRightIconProps?.password?.className}
              onClick={inputRightIconProps?.password?.onClick}
              role="button"
              tabIndex={0}
              aria-label="Toggle password visibility"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  inputRightIconProps?.password?.onClick(e);
                }
              }}
            />
          )}
          <AudioRecorder
            onAudioRecorded={handleAudioRecorded}
            onRecordingStateChange={handleRecordingStateChangeLocal}
            disabled={
              inputRightIconProps.disabled ||
              (inputRightIconProps.isRecording && !localIsRecording)
            }
            isRecording={localIsRecording}
            customParentClassName={
              inputRightIconProps.audioCustomParentClass
            }
            customClass={inputRightIconProps.audioCustomClass}
            customStyle={inputRightIconProps.audioCustomStyle}
            aria-label={`Record audio for ${ariaLabelText}`}
          />
        </i>
      ) : (
        <span aria-hidden="true">{inputRightIconProps?.icon || <></>}</span>
      )
    ) : <></>}
  </InputIcon>
</IconField>
) : (
  <InputText
    id={inputId}
    name={name}
    className={`${inputClassName}`}
    aria-label={ariaLabelText}
    aria-required={required}
    aria-describedby={restProps['aria-describedby']}
    onKeyDown={handleKeyDown}
    {...restProps}
    autoComplete={process?.env?.NEXT_PUBLIC_AUTO_COMPLETE}
  />
)}


    {labelDownProps?.text && (
      <div className={labelProps.labelMainClassName || "pb-1"}>
        <NormalLabel
          labelClass={labelDownProps.inputLabelClassName}
          text={labelDownProps.text}
        />
      </div>
    )}

    {floatLabelProps?.text && (
      <label
        className={`custom-label ${floatLabelProps.inputLabelClassName}`}
        htmlFor={floatLabelProps.id}
      >
        {floatLabelProps.text}
        <span className={floatLabelProps.inputLabelSpanClassName}>
          {floatLabelProps.spanText}
        </span>
      </label>
    )}
  </div>
</>



  );
});
Input.displayName = 'Input';

export const TextArea = React.memo((props) => {
  const {
    textAreaParentClassName,
    textAreaParentStyle,
    labelProps,
    textAreaClass,
    float,
    floatLabelProps,
    ...restProps
  } = props && props.textAreaProps;

  return (
    <div
      className={`${textAreaParentClassName} ${float ? "p-float-label" : ""}`}
      style={textAreaParentStyle}
    >
      {labelProps?.text && (
        <div className={`${labelProps.labelMainClassName || "pb-1"}`}>
          <NormalLabel
            labelClass={labelProps.textAreaLabelClassName}
            text={labelProps.text}
            id={labelProps.id}
            labelStyle={labelProps.parentStyle}
            spanText={labelProps.spanText}
            spanClass={labelProps.textAreaLabelSpanClassName}
          />
        </div>
      )}
      <InputTextarea
        className={`custom-textArea ${textAreaClass}`}
        {...restProps}
        autoComplete={process?.env?.NEXT_PUBLIC_AUTO_COMPLETE}
      />
      {floatLabelProps?.text && (
        <label
          className={`custom-label ${floatLabelProps.textAreaLabelClassName}`}
          htmlFor={floatLabelProps.id}
        >
          {floatLabelProps.text}
          <span className={floatLabelProps.textAreaLabelSpanClassName}>
            {floatLabelProps.spanText}
          </span>
        </label>
      )}
    </div>
  );
});
TextArea.displayName = 'TextArea';

export const InputNumber = React.memo((props) => {
  const {
    inputNumberParentClassName,
    hasIcon,
    inputNumberParentStyle,
    labelProps,
    inputLeftIconProps,
    inputNumberClassName,
    inputRightIconProps,
    labelDownProps,
    isLoading,
    float,
    floatLabelProps,
    ...restProps
  } = props?.inputNumberProps || {};

  const [localIsRecording, setLocalIsRecording] = useState(false);

  const handleAudioRecorded = (audioBlob) => {
    inputRightIconProps?.onRecordValueChange?.(audioBlob);
  };

  const handleRecordingStateChangeLocal = (isRecord) => {
    setLocalIsRecording(isRecord);
    inputRightIconProps?.onRecordingStateChange?.(isRecord);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!inputRightIconProps?.isRecording) {
      setLocalIsRecording(inputRightIconProps?.isRecording);
    }
  }, [inputRightIconProps?.isRecording]);

  return (
    <>
      {labelProps?.text && inputRightIconProps?.display && (
        <div className={labelProps.labelMainClassName || "pb-1"}>
          <NormalLabel
            labelClass={labelProps.inputNumberLabelClassName}
            text={labelProps.text}
            labelStyle={labelProps.parentStyle}
            spanText={labelProps.spanText}
            spanClass={labelProps.inputNumberLabelSpanClassName}
          />
        </div>
      )}

      <div
        className={`custom_input ${inputNumberParentClassName}
          ${inputRightIconProps?.audio?.display ? "p-icon-field-right" : ""}
          ${hasIcon ? "p-icon-field-right" : ""}
          ${float ? "p-float-label" : ""}`}
        style={inputNumberParentStyle}
      >
        {labelProps?.text && !inputRightIconProps?.display && (
          <div className={labelProps.labelMainClassName || "pb-1"}>
            <NormalLabel
              labelClass={labelProps.inputNumberLabelClassName}
              text={labelProps.text}
              labelStyle={labelProps.parentStyle}
              spanText={labelProps.spanText}
              spanClass={labelProps.inputNumberLabelSpanClassName}
            />
          </div>
        )}

        {(inputLeftIconProps?.display || inputRightIconProps?.display || isLoading || localIsRecording) ? (
          <IconField
            iconPosition={
              inputLeftIconProps?.display ? "left" :
              inputRightIconProps?.display ? "right" : undefined
            }
          >
            <InputIcon className={localIsRecording || isLoading ? 'w-full' : ''}>
              {localIsRecording && (
                <i className="flex justify-content-center w-full">
                  <i className="pi pi-spin pi-spinner pl-0" />
                </i>
              )}
              {isLoading && (
                <i className="flex justify-content-center w-full">
                  <i className="pi pi-spin pi-spinner pt-2 pb-2" />
                </i>
              )}
            </InputIcon>

            {/* Left Icon */}
            <InputIcon>
              {inputLeftIconProps?.display ? (
                inputLeftIconProps?.audio?.display ? (
                  <AudioRecorder
                    onAudioRecorded={handleAudioRecorded}
                    onRecordingStateChange={handleRecordingStateChangeLocal}
                    disabled={
                      inputLeftIconProps?.disabled ||
                      (inputLeftIconProps?.isRecording && !localIsRecording)
                    }
                    isRecording={localIsRecording}
                    customClass={inputLeftIconProps.audioCustomClass}
                    customStyle={inputLeftIconProps.audioCustomStyle}
                  />
                ) : (
                  inputLeftIconProps?.icon || <></>
                )
              ) : <></>}
            </InputIcon>

            {/* Input Number */}
            <InputNum
              className={`custom_input ${inputNumberClassName}`}
              aria-label={labelProps.text || "input-number-field"}
              {...restProps}
              autoComplete={process?.env?.NEXT_PUBLIC_AUTO_COMPLETE}
            />

            {/* Right Icon */}
            <InputIcon>
              {inputRightIconProps?.display ? (
                inputRightIconProps?.audio?.display ? (
                  <i className="flex align-items-center">
                    {inputRightIconProps?.password?.display && (
                      <i
                        className={inputRightIconProps?.password?.className}
                        onClick={inputRightIconProps?.password?.onClick}
                      />
                    )}
                    <AudioRecorder
                      onAudioRecorded={handleAudioRecorded}
                      onRecordingStateChange={handleRecordingStateChangeLocal}
                      disabled={
                        inputRightIconProps.disabled ||
                        (inputRightIconProps.isRecording && !localIsRecording)
                      }
                      isRecording={localIsRecording}
                      customParentClassName={inputRightIconProps.audioCustomParentClass}
                      customClass={inputRightIconProps.audioCustomClass}
                      customStyle={inputRightIconProps.audioCustomStyle}
                    />
                  </i>
                ) : (
                  inputRightIconProps?.icon || <></>
                )
              ) : <></>}
            </InputIcon>
          </IconField>
        ) : (
          <InputNum
            className={`custom_input ${inputNumberClassName}`}
            aria-label={labelProps.text || "input-number"}
            {...restProps}
            autoComplete={process?.env?.NEXT_PUBLIC_AUTO_COMPLETE}
          />
        )}

        {/* Down Label */}
        {labelDownProps?.text && (
          <div className={labelProps.labelMainClassName || "pb-1"}>
            <NormalLabel
              labelClass={labelDownProps.inputLabelClassName}
              text={labelDownProps.text}
            />
          </div>
        )}

        {/* Float Label */}
        {floatLabelProps?.text && (
          <label
            className={`custom-label ${floatLabelProps.inputNumberLabelClassName}`}
            htmlFor={floatLabelProps.id}
          >
            {floatLabelProps.text}
            <span className={floatLabelProps.inputNumberLabelSpanClassName}>
              {floatLabelProps.spanText}
            </span>
          </label>
        )}
      </div>
    </>
  );
});
InputNumber.displayName = 'InputNumber';


export const Password = React.memo((props) => {
  const {
    passwordParentClassName,
    passwordParentStyle,
    labelProps,
    passwordClassName,
    float,
    floatLabelProps,
    ...restProps
  } = props && props.passwordProps;

  return (
    <div
      className={`custom_input_password ${passwordParentClassName}  ${float ? "p-float-label" : ""
        }`}
    >
      {labelProps?.text && (
        <div className={`${labelProps.labelMainClassName || "pb-1"}`}>
          <NormalLabel
            labelClass={labelProps.passwordLabelClassName}
            text={labelProps.text}
            labelStyle={labelProps.parentStyle}
            spanText={labelProps.spanText}
            spanClass={labelProps.passwordLabelSpanClassName}
          />
        </div>
      )}
      <Pwd
        className={passwordClassName}
        toggleMask
        feedback={false}
        aria-label={restProps.name}
        {...restProps}
        autoComplete={process?.env?.NEXT_PUBLIC_AUTO_COMPLETE_PASSWORD}
      />
      {floatLabelProps?.text && (
        <label
          className={`custom-label ${floatLabelProps.passwordLabelClassName}`}
          htmlFor={floatLabelProps.id}
        >
          {floatLabelProps.text}
          <span className={floatLabelProps.passwordLabelSpanClassName}>
            {floatLabelProps.spanText}
          </span>
        </label>
      )}
    </div>
  );
});
Password.displayName = 'Password';

export const InputGroup = React.memo((props) => {
  const {
    inputGroupParentClassName,
    inputGroupParentStyle,
    labelProps,
    inputGroupClassName,
    leftIcon,
    rightIcon,
    float,
    floatLabelProps,
    ...restProps
  } = props?.inputGroupProps || {};

  const hasIcon = leftIcon?.display || rightIcon?.display;

  return (
    <>
      {/* Top Label */}
      {labelProps?.text && (
        <div className={`${labelProps.labelMainClassName || "pb-1"}`}>
          <NormalLabel
            labelClass={labelProps.inputGroupLabelClassName}
            text={labelProps.text}
            spanText={labelProps.spanText}
            spanClass={labelProps.inputGroupLabelSpanClassName}
            labelStyle={labelProps.parentStyle}
          />
        </div>
      )}

      <div
        className={`p-inputgroup ${inputGroupParentClassName || ""} ${
          hasIcon ? "p-icon-field-right" : ""
        } ${float ? "p-float-label" : ""}`}
        style={inputGroupParentStyle}
      >
        {hasIcon ? (
          <IconField iconPosition={leftIcon?.display ? "left" : "right"}>
            {/* Left Icon */}
            {leftIcon?.display && (
              <InputIcon>
                <span
                  className={`p-inputgroup-addon ${leftIcon.leftClassName || ""}`}
                  style={leftIcon.leftStyleName}
                >
                  <i className={`${leftIcon.icon || ""}`}>
                    {leftIcon.antLeftIcon || null}
                  </i>
                </span>
              </InputIcon>
            )}

            {/* Input Text */}
            <InputText
              className={`custom_input w-full ${inputGroupClassName || ""}`}
              aria-label={restProps.name || "input-field"}
              {...restProps}
              autoComplete={process?.env?.NEXT_PUBLIC_AUTO_COMPLETE}
            />

            {/* Right Icon */}
            {rightIcon?.display && (
              <InputIcon>
                <span
                  className={`p-inputgroup-addon ${rightIcon.rightClassName || ""}`}
                  style={rightIcon.rightStyle}
                >
                  <i className={`${rightIcon.icon || ""}`}>
                    {rightIcon.antRightIcon || null}
                  </i>
                </span>
              </InputIcon>
            )}
          </IconField>
        ) : (
          <InputText
            className={`custom_input w-full ${inputGroupClassName || ""}`}
            aria-label={restProps.name || "input-field"}
            {...restProps}
            autoComplete={process?.env?.NEXT_PUBLIC_AUTO_COMPLETE}
          />
        )}

        {/* Floating Label */}
        {floatLabelProps?.text && (
          <label
            className={`custom-label ${floatLabelProps.inputGroupLabelClassName || ""}`}
            htmlFor={floatLabelProps.id}
          >
            {floatLabelProps.text}
            <span className={floatLabelProps.inputGroupLabelSpanClassName}>
              {floatLabelProps.spanText}
            </span>
          </label>
        )}
      </div>
    </>
  );
});
InputGroup.displayName = 'InputGroup';


export const InputDropdown = React.memo((props) => {
  const {
    inputDropdownParentClassName,
    inputDropdownParentStyle,
    labelProps,
    inputDropdownClassName,
    inputPanelDropdownClassName,
    customPanelDropdownClassName,
    float,
    floatLabelProps,
    ...restProps
  } = props && props.inputDropdownProps;

  return (
    <div
      className={`custom-select ${inputDropdownParentClassName} ${float ? "p-float-label" : ""
        }`}
      style={inputDropdownParentStyle}
    >
      {labelProps?.text && (
        <div className={`${labelProps.labelMainClassName || "pb-1"}`}>
          <NormalLabel
            labelClass={labelProps.inputDropdownLabelClassName}
            text={labelProps.text}
            spanText={labelProps.spanText}
            spanClass={labelProps.inputDropdownLabelSpanClassName}
            labelStyle={labelProps.parentStyle}
          />
        </div>
      )}
      <Dropdown
        className={`${inputDropdownClassName}`}
        panelClassName={`custom_dropdownPanel ${inputPanelDropdownClassName} ${customPanelDropdownClassName}`}
        pt={{
          trigger: {
            'aria-label': restProps.ariaLabel || restProps.name,
            title: restProps.ariaLabel || restProps.name,
          },
          input: {
            'aria-label': restProps.ariaLabel || restProps.name,
            title: restProps.ariaLabel || restProps.name,
          },
          select: {
            'aria-label': restProps.ariaLabel || restProps.name,
            title: restProps.ariaLabel || restProps.name,
          },
          panel: {
            'aria-live': 'polite',
            'aria-atomic': 'true',
          },
        }}
        {...restProps}
      />
      {floatLabelProps?.text && (
        <label
          className={`custom-label ${floatLabelProps.inputDropdownLabelClassName}`}
          htmlFor={floatLabelProps.id}
        >
          {floatLabelProps.text}
          <span className={floatLabelProps.inputDropdownLabelSpanClassName}>
            {floatLabelProps.spanText}
          </span>
        </label>
      )}
    </div>
  );
});
InputDropdown.displayName = 'InputDropdown';

/**
 *
 * @param {*} props
 * @returns Multi select dropdown component
 */
export const MultiSelect = React.memo((props) => {
  const {
    multiSelectParentClassName,
    multiSelectParentStyle,
    labelProps,
    multiSelectClassName,
    float,
    floatLabelProps,
    onChange,
    selectAllLabel="Select All", // Default label for "Select All"
    ...restProps
  } = props && props.multiSelectProps;

  const disabledOptions = restProps.options?.filter((option) => option.disabled).map((option) => option.value) || [];

  // Ensure disabled options are always selected initially
  const [selectedValues, setSelectedValues] = useState(() => [
    ...new Set([...disabledOptions, ...(restProps.value || [])]),
  ]);
  // State for allValues, updated dynamically
  const [allValues, setAllValues] = useState(
    restProps.options?.map((option) => option.value) || []
  );
  const [allSelected, setAllSelected] = useState(false);

    // Update allValues and selectedValues when options come dynamically from API
  useEffect(() => {
    const newAllValues = restProps.options?.map((option) => option.value) || [];
    setAllValues(newAllValues);

    const updatedSelected = [
      ...new Set([...disabledOptions, ...(restProps.value || [])]),
    ];
    setSelectedValues(updatedSelected);
  }, [restProps.options]);
  useEffect(() => {
    setSelectedValues(() => [
      ...new Set([...disabledOptions, ...(restProps.value || [])]),
    ]);
  }, [restProps.value]);
    useEffect(() => {
      setAllSelected(selectedValues.length === allValues.length && allValues.length > 0);
    }, [selectedValues, allValues,restProps.value]);

  // Toggle Select All functionality
   const toggleSelectAll = () => {
    let updatedValues = allSelected ? [] : allValues;

    // Ensure disabled options remain selected
    updatedValues = [...new Set([...disabledOptions, ...updatedValues])];

    setSelectedValues(updatedValues);
    if (onChange) {
      onChange({ value: updatedValues });
    }
  };

  // Handle selection change
  const handleSelectionChange = (e) => {
    let updatedValues = e.value;

    // Ensure disabled options remain selected
    updatedValues = [...new Set([...disabledOptions, ...updatedValues])];

    setSelectedValues(updatedValues);
    if (onChange) {
      onChange(e);
    }
  };

  // Custom panel header with a "Select All" checkbox and label
  const panelHeaderTemplate = () => (
    <div className="flex justify-content-start p-multiselect-header">
      <Checkbox inputId="selectAll" checked={allSelected} onChange={toggleSelectAll} />
      <label htmlFor="selectAll" className="ml-2">{selectAllLabel}</label>
    </div>
  );

  return (
    <div
      className={`custom-select ${multiSelectParentClassName} ${float ? "p-float-label" : ""}`}
      style={multiSelectParentStyle}
    >
      {labelProps?.text && (
        <div className={`${labelProps.labelMainClassName || "pb-1"}`}>
          <NormalLabel
            labelClass={labelProps.inputMultiSelectLabelClassName}
            text={labelProps.text}
            spanText={labelProps.spanText}
            labelStyle={labelProps.parentStyle}
            spanClass={labelProps.inputMultiSelectLabelSpanClassName}
          />
        </div>
      )}
      <MulSel
        className={multiSelectClassName}
        value={selectedValues}
         aria-label={restProps.name}
        onChange={(e)=>{
          handleSelectionChange(e);
        }}
        panelHeaderTemplate={panelHeaderTemplate} // Custom panel header with "Select All" checkbox
        {...restProps}
      />
      {floatLabelProps?.text && (
        <label
          className={`custom-label ${floatLabelProps.inputMultiSelectLabelClassName}`}
          htmlFor={floatLabelProps.id}
        >
          {floatLabelProps.text}
          <span className={floatLabelProps.inputMultiSelectLabelSpanClassName}>
            {floatLabelProps.spanText}
          </span>
        </label>
      )}
    </div>
  );
});
MultiSelect.displayName = 'MultiSelect';

export const DropdownSelect = React.memo((props) => {
  const {
    dropDownSelectParentClassName,
    dropDownSelectParentStyle,
    items,
    icon,
    text,
    ...restProps
  } = props;

  return (
    <div
      className={`custom-select ${dropDownSelectParentClassName}`}
      style={dropDownSelectParentStyle}
    >
      <Drp overlay={items} >
        <button type="button" className="p-link layout-topbar-button" aria-label={restProps.name|| "dropdown-button"}>
          {text && <div className="header-dropdown-name">{text}</div>}
          {icon}
        </button>
      </Drp>
    </div>
  );
});
DropdownSelect.displayName = 'DropdownSelect';

export const InputGroups = React.memo((props) => {
  const { custom, parentClass, parentStyle, inputGroupProps = {} } = props;
  const {
    leftClass,
    leftStyle,
    leftIcon,
    onLeftClick,
    type,
    inputClass,
    value,
    id,
    name,
    style,
    keyfilter,
    placeholder,
    onChange,
    onBlur,
    ref,
    required,
    readOnly,
    disabled,
    rightClass,
    rightStyle,
    rightIcon,
    onRightClick,
    leftDisabled,
    rightDisabled,
    maxLength,
    minLength,
    ...restProps
  } = inputGroupProps;

  return (
    <div
      className={`p-inputgroup flex-1${custom || "custom_input"
        } ${parentClass} `}
      style={parentStyle}
    >
      <Button
        type="button"
        icon={`${leftIcon}`}
        className={`${leftClass}`}
        style={leftStyle}
        onClick={onLeftClick}
        disabled={leftDisabled}
      />
      {props.supplies && (
        <Button
          type="button"
          icon={`${rightIcon}`}
          className={`${rightClass}`}
          style={rightStyle}
          onClick={onRightClick}
          disabled={rightDisabled}
        />
      )}
      <InputText
        type={type || "text"}
        className={`${inputClass}`}
        value={value}
        id={id}
        name={name}
        style={style}
        keyfilter={keyfilter}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        ref={ref}
        required={required}
        readOnly={readOnly}
        disabled={disabled}
        maxLength={maxLength}
        minLength={minLength}
         aria-label={restProps.name}
        {...restProps}
        autoComplete={process?.env?.NEXT_PUBLIC_AUTO_COMPLETE}
      />
      {props.register && (
        <Button
          type="button"
          icon={`${rightIcon}`}
          className={`${rightClass}`}
          style={rightStyle}
          onClick={onRightClick}
          disabled={rightDisabled}
        />
      )}
    </div>
  );
});
InputGroups.displayName = 'InputGroups';
