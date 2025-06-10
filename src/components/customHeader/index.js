import React from 'react';

const CustomHeader = ({ header,headerClass,customParentClassName, requiredSymbol=false }) => {
    return (
        <div className={`flex gap-2 align-items-center mb-2 ${customParentClassName}`}>
            <div className="hitachi_header_container">
                <div className="hitachi_header_bg"></div>
                <div className={`ml-2 ${headerClass}`}>{header} <span className={requiredSymbol?"p-error":""}>{requiredSymbol? "*":""}</span></div>
            </div>
        </div>
    );
};

export default CustomHeader;
