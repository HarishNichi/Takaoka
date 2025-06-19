import React from "react";
import { RadioButton } from "primereact/radiobutton";

import { NormalLabel } from "@/components"; 

export function RadioBtn(props) {
    const {
        parentClass,
        custom,
        radioBtnProps = {}
    } = props;
    const {
        radioClass,
        inputId,
        name,
        value,
        onChange,
        checked,
        disabled,
        labelClass,
        ...restProps
    } = radioBtnProps;

    return (
        <div className={`${parentClass} ${custom || 'custom-radioBtn'}`}>
            <RadioButton className={`${radioClass}`}
                inputId={inputId}
                name={name}
                value={value}
                onChange={onChange}
                checked={checked}
                disabled={disabled}
                {...restProps}
            />
            <NormalLabel htmlFor={inputId}
                className={`${labelClass}`}
                text={name}
            />
        </div>
    );
}