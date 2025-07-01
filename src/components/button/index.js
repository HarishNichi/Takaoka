import { Button as PrimeReactButton } from "primereact/button";

export const Button = (props) => {
  const { parentClass, buttonProps = {} } = props;
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
    ariaLabel,
    ...restProps
  } = buttonProps;
  
  let updatedIcon = icon;
  let buttonAriaLabel = ariaLabel;
  
  if (isExport) {
    updatedIcon = "pi pi-download";
    buttonAriaLabel = buttonAriaLabel || "Export data";
  } else if (isCreate) {
    updatedIcon = "pi pi-plus";
    buttonAriaLabel = buttonAriaLabel || "Create new item";
  } else if (isImport) {
    updatedIcon = "pi pi-upload";
    buttonAriaLabel = buttonAriaLabel || "Import data";
  } else if (isDelete) {
    updatedIcon = "pi pi-trash";
    buttonAriaLabel = buttonAriaLabel || "Delete item";
  }

  return (
    <div className={`${parentClass}`}>
      <PrimeReactButton
        className={`${bg} ${hoverBg} ${custom || "custom-button"
          }  ${buttonClass} font-medium`}
        label={text}
        rounded={"true"}
        icon={isLoading ? "pi pi-spin pi-spinner" : icon || updatedIcon}
        disabled={isLoading ? isLoading : false}
        aria-label={buttonAriaLabel}
        aria-busy={isLoading}
        {...restProps}
      />
    </div>
  );
};

export const ButtonRounded = (props) => {
  const { parentClass, buttonProps = {} } = props;
  const { hoverBg, custom, buttonClass, text, icon, bg, ariaLabel, ...restProps } =
    buttonProps;

  return (
    <div className={`${parentClass}`}>
      <PrimeReactButton
        className={`${bg} ${hoverBg} ${icon && "custom-icon-button"} ${custom || "custom-button"
          } ${buttonClass} font-medium border-round-3xl`}
        label={text}
        icon={icon}
        aria-label={ariaLabel}
        {...restProps}
      />
    </div>
  );
};
