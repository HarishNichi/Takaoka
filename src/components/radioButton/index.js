import React from "react";
import { RadioButton } from "primereact/radiobutton";

import { NormalLabel } from "@/components"; 

export function RadioBtn(props) {
    const {
        parentClass,
        parentStyle,
        custom,
        radioBtnProps = {}
    } = props;
    const {
        radioClass,
        inputId,
        name,
        value,
        style,
        onChange,
        checked,
        disabled,
        labelClass,
        ...restProps
    } = radioBtnProps;

    return (
        <div className={`${parentClass} ${custom || 'custom-radioBtn'}`} style={parentStyle} >
            <RadioButton className={`${radioClass}`}
                inputId={inputId}
                name={name}
                value={value}
                style={style}
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