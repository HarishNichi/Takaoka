import React from "react";

export const NormalLabel = (props) => {
  const {
    labelClass,
    labelStyle,
    text,
    spanClass,
    spanText,
    htmlFor,
    ...restProps
  } = props;

  return (
    <label
      className={`custom-label ${labelClass}`}
      style={labelStyle}
      htmlFor={htmlFor}
      {...restProps}
    >
      {text}
      <span className={spanClass}>{spanText}</span>
    </label>
  );
};
