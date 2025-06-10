import React from 'react';
import { InputSwitch as InputSwitcher } from 'primereact/inputswitch';
import { ToggleButton } from 'primereact/togglebutton';

export const InputSwitch = (props) => {
    const {
        parentClass,
        parentStyle,
        custom,
        inputSwitchProps = {}
    } = props;
    const {
        switchClass,
        id,
        style,
        checked,
        onChange,
        readOnly,
        onBlur,
        disabled,
        ...restProps
    } = inputSwitchProps;

    return (
        <div className={`${parentClass} ${custom || 'custom-switch'} `} style={parentStyle}>
            <InputSwitcher className={` ${switchClass}`}
                checked={checked}
                id={id}
                style={style}
                onChange={onChange}
                readOnly={readOnly}
                disabled={disabled}
                onBlur={onBlur}
                {...restProps}
            />
        </div>
    );
};

export const ToggleSwitch = (props) => {
    const {
        bgColor,
        parentClass,
        custom,
        id,
        style,
        onLabel,
        offLabel,
        onIcon,
        offIcon,
        checked,
        onChange,
        disabled,
        ...restProps
    } = props && props;

    return (
        <div>
            <ToggleButton className={`${bgColor} ${parentClass} ${custom || 'person-count-button'}`}
                id={id}
                style={style}
                onLabel={onLabel}
                offLabel={offLabel}
                onIcon={onIcon}
                offIcon={offIcon}
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                {...restProps}
            />
        </div>
    );
};
