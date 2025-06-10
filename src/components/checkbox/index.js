import React from "react";
import { Checkbox } from "primereact/checkbox";

import { NormalLabel } from "@/components"; 

const NormalCheckBox = (props) => {
    const {
        parentClass,
        parentStyle,
        custom,
        checkBoxProps = {}
    } = props;
    const {
        checkboxClass,
        id,
        name,
        value,
        onChange,
        checked,
        disabled,
        style,
        labelClass,
        linkLabel,
        ...restProps
    } = checkBoxProps;

    return (
        <div className={`${parentClass} ${custom || 'custom-checkbox'}`} style={parentStyle}>
            <Checkbox className={`${checkboxClass} `}
                inputId={id}
                name={name}
                value={value}
                onChange={onChange}
                checked={checked}
                disabled={disabled}
                style={style}
                {...restProps}
            />
            {!linkLabel &&
                <NormalLabel htmlFor={id}
                    className={`${labelClass}`}
                    text={value}
                />}

            {linkLabel &&
                <NormalLabel htmlFor={id}
                    className={`${labelClass}`}
                    text={linkLabel}
                />}

        </div>
    )
}

export {
    NormalCheckBox
}