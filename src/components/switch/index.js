import React, { useContext } from 'react';
import { InputSwitch as InputSwitcher } from 'primereact/inputswitch';
import { ToggleButton } from 'primereact/togglebutton';
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from '@/layout/context/layoutcontext';

export const InputSwitch = (props) => {
    const { localeJson } = useContext(LayoutContext);
    const {
        parentClass,
        custom,
        inputSwitchProps = {}
    } = props;
    const {
        switchClass,
        id,
        checked,
        onChange,
        readOnly,
        onBlur,
        disabled,
        ...restProps
    } = inputSwitchProps;

    return (
        <div className={`${parentClass} ${custom || 'custom-switch'} `}>
            <InputSwitcher className={` ${switchClass}`}
                checked={checked}
                id={restProps["ariaLabel"] || translate(localeJson, "toggle_place")}
                onChange={onChange}
                readOnly={readOnly}
                disabled={disabled}
                tabIndex={0}
                aria-label={restProps["ariaLabel"] || translate(localeJson, "toggle_place")}
                onBlur={onBlur}
                pt={{root: { tabIndex: 0,"aria-readonly":true}, input: { tabIndex: 0, role: "switch" } }}
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
                onLabel={onLabel}
                offLabel={offLabel}
                onIcon={onIcon}
                offIcon={offIcon}
                checked={checked}
                onChange={onChange}
                tabIndex={0}
                disabled={disabled}
                {...restProps}
            />
        </div>
    );
};
