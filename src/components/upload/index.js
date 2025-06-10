import React, { useRef, useState, useContext, useEffect } from 'react';
import { getValueByKeyRecursively as translate } from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";
import _ from 'lodash';

export const InputFile = (props) => {
    const {
        parentClass,
        parentStyle,
        inputFileProps = {}
    } = props;
    const {
        name,
        height,
        inputFileClass,
        accept,
        onChange,
        onBlur,
        ref,
        inputFileStyle,
        placeholder,
        value,
        required,
        readOnly,
        disabled,
        custom,
        buttonText,
        ...restProps
    } = inputFileProps;
    const divStyle = {
        // You can adjust the border style as needed
        padding: '10px', // Add padding for spacing
        ...parentStyle, // Allow overriding styles from props
    };
    const [selectedFileName, setSelectedFileName] = useState('');
    const fileInputRef = useRef(null);
    const { localeJson, locale } = useContext(LayoutContext);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFileName(file ? file.name : '');
        if (onChange) {
            onChange(event);
        }
    };
    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    useEffect(()=>{
        if(_.isNull(value)){
            setSelectedFileName('');
            fileInputRef.current.value = null;
        }
    },[value])

    return (
        <div className={`input-parent-file-border bg-white ${parentClass}`} style={divStyle}>
            <input type="file"
                name={name}
                className={`${inputFileClass} ${custom || 'input_file'} ${height || 'custom_input'}`}
                accept={accept}
                onChange={handleFileChange}
                onBlur={onBlur}
                ref={fileInputRef}
                style={{ display: 'none' }}
                value={value}
                required={required}
                readOnly={readOnly}
                disabled={disabled}
                {...restProps}
            />
            <button
                type='button'
                className={`${inputFileClass} ${custom || 'input_file'} ${height || 'custom_input'}`}
                onClick={handleButtonClick}
            >{buttonText || translate(localeJson, 'file_choose')}
            </button>
            <span className='pl-2' style={{ wordBreak: "break-word" }}>
                {selectedFileName || placeholder}
            </span>
        </div>
    );
};