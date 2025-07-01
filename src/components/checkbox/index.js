import React from "react";
import { Checkbox } from "primereact/checkbox";

import { NormalLabel } from "@/components"; 

const NormalCheckBox = React.memo((props) => {
    const {
        parentClass,
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
        labelClass,
        linkLabel,
        ...restProps
    } = checkBoxProps;

    return (
        <div className={`${parentClass} ${custom || 'custom-checkbox'}`}>
            <Checkbox className={`${checkboxClass} `}
                inputId={id}
                name={name}
                value={value}
                onChange={onChange}
                checked={checked}
                disabled={disabled}
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
});
NormalCheckBox.displayName = 'NormalCheckBox';

export {
    NormalCheckBox
}