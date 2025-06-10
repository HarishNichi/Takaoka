import React, { useState } from "react";

import { InputGroups } from "@/components";

export const Counter = (props) => {
  const {
    name,
    readOnly,
    disabled,
    parentClass,
    inputClass,
    style,
    min,
    max,
    leftStyle,
    rightStyle,
  } = props;
  const [value, setValue] = useState(props.value);

  const handleIncrement = () => {
    const newValue = parseInt(value) ? parseInt(value) + 1 : 1;
    setValue(newValue);
    props.onValueChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = parseInt(value) ? parseInt(value) - 1 : 0;
    setValue(newValue);
    props.onValueChange(newValue);
  };

  return (
    <InputGroups
      inputGroupProps={{
        inputClass: inputClass,
        id: props.id,
        value: value,
        name: name,
        style: style,
        custom: "custom-input font-bold",
        onChange: (e) => {
          let val = e.target.value;
          if (min == 0 && max > 0) {
            if (parseInt(val) > min && parseInt(val) <= max) {
              props.onValueChange(
                e.target.value ? parseInt(e.target.value) : 0
              );
              setValue(parseInt(e.target.value) ? parseInt(e.target.value) : 0);
            } else {
              props.onValueChange(0);
              setValue(0);
            }
          } else {
            props.onValueChange(e.target.value ? parseInt(e.target.value) : 0);
            setValue(parseInt(e.target.value) ? parseInt(e.target.value) : 0);
          }
        },
        onRightClick: handleIncrement,
        onLeftClick: handleDecrement,
        rightIcon: "pi pi-plus",
        leftIcon: "pi pi-minus",
        leftDisabled: value <= min,
        rightDisabled: value >= max,
        leftStyle: {
          cursor: value <= min ? `not-allowed` : `pointer`,
          ...leftStyle,
        },
        rightStyle: {
          cursor: value >= max ? `not-allowed` : `pointer`,
          ...rightStyle,
        },
        readOnly: readOnly,
        disabled: disabled,
      }}
      parentClass={parentClass}
      register={"true"}
    />
  );
};

export const CounterSupplies = (props) => {
  const {
    name,
    readOnly,
    disabled,
    parentClass,
    inputClass,
    style,
    min,
    max,
    leftStyle,
    rightStyle,
    leftDisabled,
  } = props;
  const [value, setValue] = useState(props.value);
  const [isIncrementing, setIsIncrementing] = useState(true);
  const [isDecrementing, setIsDecrementing] = useState(false);

  const handleIncrement = () => {
    const newValue = value;
    props.onValueChange(newValue, "increment");
    setValue(newValue);
    setIsIncrementing(true);
    setIsDecrementing(false);
  };

  const handleDecrement = () => {
    const newValue = value; // Ensure value doesn't go below 0
    props.onValueChange(newValue, "decrement");
    setValue(newValue);
    setIsDecrementing(true);
    setIsIncrementing(false);
  };

  return (
    <InputGroups
      inputGroupProps={{
        inputClass: inputClass,
        id: props.id,
        value: value,
        name: name,
        style: style,
        custom: "custom-input font-bold",
        onChange: (e) => {
          const val = e.target.value;
          props.onValueChange(
            parseInt(val) || 0,
            isIncrementing ? "increment" : "decrement"
          );
          setValue(parseInt(val) || 0);
        },
        onLeftClick: handleDecrement,
        onRightClick: handleIncrement,
        leftDisabled: leftDisabled,
        leftIcon: "pi pi-minus",
        leftStyle: {
          cursor: leftDisabled ? `not-allowed` : `pointer`,
          ...leftStyle,
          borderRadius: "5px 0 0 5px",
          height: "40px",
          background: isDecrementing ? "" : "white",
          color: isDecrementing ? "" : "black",
        },
        rightDisabled: value >= max,
        rightIcon: "pi pi-plus",
        rightStyle: {
          cursor: value >= max ? `not-allowed` : `pointer`,
          ...rightStyle,
          borderRadius: "0 5px 5px 0",
          height: "40px",
          background: isIncrementing ? "" : "white",
          color: isIncrementing ? "" : "black",
        },
        readOnly: readOnly,
        disabled: disabled,
      }}
      parentClass={parentClass}
      supplies={"true"}
    />
  );
};