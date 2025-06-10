import React from 'react';

export const ValidationError = (props) => {
    const {
        parentClass,
        fontWeight,
        errorBlock,
        parentStyle,
        ...restProps
    } = props;

    return (
        <>
            {errorBlock &&
                <small className={`scroll-check p-error block ${parentClass}`} style={parentStyle} {...restProps}>
                    {errorBlock}
                </small>
            }
        </>
    );
}