/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { OpenCvProvider } from 'opencv-react';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'react-hot-toast';

import { persistor } from '@/redux/store';
import { Providers } from "@/redux/provider";
import { LayoutProvider } from '../layout/context/layoutcontext';
import { AccessibilityProvider } from '../context/AccessibilityContext';
import Layout from '../layout/layout';
import withAuth from '@/middleware/withAuth';

/**
 * Import global CSS for entire application
*/
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '@/styles/layout/layout.scss';
import '@/styles/components/components.scss';
import '@/styles/pages/pages.scss';
import 'primereact/resources/primereact.min.css';

function MyApp({ Component, pageProps, authorizedStatus }) {
    const toastStyle = {
        padding: '10px',
        color: '#2b3d51',
        borderRadius: '5px',
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
    const userLocale = localStorage.getItem('locale') || 'ja';
    document.documentElement.lang = userLocale;
  }, [])

    return (
        <OpenCvProvider>
            <Providers>
                <PersistGate loading={null} persistor={persistor}>
                    <AccessibilityProvider>
                        <LayoutProvider>
                            <Toaster
                                reverseOrder={true}
                                toastOptions={{
                                    duration: 5000,
                                    style: toastStyle
                                }}
                            />
                            {authorizedStatus ? (
                                Component.getLayout ? (
                                    <>
                                        {Component.getLayout(<Component {...pageProps} />)}
                                    </>
                                ) : (
                                    <Layout>
                                        <Component {...pageProps} />
                                    </Layout>
                                )
                            ) : (
                                <div style={{
                                    height: '100vh',
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    {"Loading..."}
                                </div>
                            )}
                        </LayoutProvider>
                    </AccessibilityProvider>
                </PersistGate>
            </Providers>
        </OpenCvProvider>
    );
}

export default withAuth(MyApp);