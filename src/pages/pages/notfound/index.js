import React from 'react';

import { useAppSelector } from "@/redux/hooks";
import { ImageComponent } from '@/components';

const NotFoundPage = () => {
    const settings_data = useAppSelector((state) => state?.layoutReducer?.layout);

    return (
        <div className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
            <div className="card flex flex-column align-items-center justify-content-center">
                <div style={{ padding: '0.3rem' }}>
                    <div className="w-full surface-card py-6 px-6 flex flex-column align-items-center">
                        <ImageComponent imageProps={{
                            src: settings_data?.image_logo_path ? settings_data?.image_logo_path : ``,
                            width: 150,
                            height: 45,
                            alt: "logo",
                        }} />
                        <br />
                        <div className="text-red-600 font-bold text-2xl mb-2">404</div>
                        <div className="text-900 font-bold text-2xl mb-2">Not Found</div>
                        <div className="text-600 ">Requested resource is not available</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

NotFoundPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
        </React.Fragment>
    );
};

export default NotFoundPage;
