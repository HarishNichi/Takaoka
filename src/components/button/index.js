import { Button as PrimeReactButton } from "primereact/button";

export const Button = (props) => {
  const { parentClass, parentStyle, buttonProps = {} } = props;
  const {
    hoverBg,
    custom,
    buttonClass,
    text,
    icon,
    bg,
    rounded,
    isLoading,
    export: isExport,
    create: isCreate,
    import: isImport,
    delete: isDelete,
    ...restProps
  } = buttonProps;
  let updatedIcon = icon;
  if (isExport) {
    updatedIcon = "pi pi-download";
  } else if (isCreate) {
    updatedIcon = "pi pi-plus";
  } else if (isImport) {
    updatedIcon = "pi pi-upload";
  } else if (isDelete) {
    updatedIcon = "pi pi-trash";
  }

  return (
    <div className={`${parentClass}`} style={parentStyle}>
      <PrimeReactButton
        className={`${bg} ${hoverBg} ${custom || "custom-button"
          }  ${buttonClass} font-medium`}
        label={text}
        rounded={"true"}
        icon={isLoading ? "pi pi-spin pi-spinner" : icon || updatedIcon}
        disabled={isLoading ? isLoading : false}
        {...restProps}
      />
    </div>
  );
};

export const ButtonRounded = (props) => {
  const { parentClass, parentStyle, buttonProps = {} } = props;
  const { hoverBg, custom, buttonClass, text, icon, bg, ...restProps } =
    buttonProps;

  return (
    <div className={`${parentClass}`} style={parentStyle}>
      <PrimeReactButton
        className={`${bg} ${hoverBg} ${icon && "custom-icon-button"} ${custom || "custom-button"
          } ${buttonClass} font-medium border-round-3xl`}
        label={text}
        icon={icon}
        {...restProps}
      />
    </div>
  );
};
