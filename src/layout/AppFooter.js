import React from 'react';

import { useAppSelector } from "@/redux/hooks";

const AppFooter = () => {
    const settings_data = useAppSelector((state) => state?.layoutReducer?.layout);

    return (
        <div className="layout-footer">
            <div>
                {settings_data.footer}
            </div>
        </div>
    );
};

export default AppFooter;