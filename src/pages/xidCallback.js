import React from 'react';

const XidCallBack = () => {
    const style = {
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '25PX',
    };

    return (
        <div style={style}>XID TESTING, BOOM !!!</div>
    );
};

XidCallBack.getLayout = function getLayout(page) {
    return page;
};

export default XidCallBack;
