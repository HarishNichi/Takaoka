import React, { useContext } from 'react';

import { LayoutContext } from '@/layout/context/layoutcontext';
import { getValueByKeyRecursively as translate } from '@/helper'
import { CustomHeader } from '@/components';

const Privacy = () => {
    const { localeJson } = useContext(LayoutContext);

    return (
        <div className='grid pr-0 col-12 justify-content-center'>
            <div className='col-12 pr-0' style={{ maxWidth: "600px" }}>
                <div className='grid pb-2'>
                    <div className='col-12'>
                        <CustomHeader headerClass={"privacy-page-header1"} header={translate(localeJson, 'privacy_policy_header1')} />
                        <div className='outer-label w-12 pb-1'>
                            {translate(localeJson, 'privacy_policy_desc1')}
                        </div>
                    </div>
                    <div className='col-12'>
                        <CustomHeader headerClass={"privacy-page-header1"} header={translate(localeJson, 'privacy_policy_header2')} />
                        <div className='outer-label w-12 pb-1'>
                            {translate(localeJson, 'privacy_policy_desc2')}
                        </div>
                    </div>
                    <div className='col-12'>
                        <CustomHeader headerClass={"privacy-page-header1"} header={translate(localeJson, 'privacy_policy_header3')} />
                        <div className='outer-label w-12 pb-1'>
                            {translate(localeJson, 'privacy_policy_desc3')}
                            <div className='mt-2'>
                                {translate(localeJson, 'privacy_policy_desc3_sub1')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Privacy;
