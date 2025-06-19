import React from 'react';

export const ValidationError = (props) => {
    const {
        parentClass,
        fontWeight,
        errorBlock,
        ...restProps
    } = props;

    return (
        <>
            {errorBlock &&
                <small className={`scroll-check p-error block ${parentClass}`} {...restProps}>
                    {errorBlock}
                </small>
            }
        </>
    );
}