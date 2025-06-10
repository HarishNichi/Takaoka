import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function HQStaff() {
    const router = useRouter();

    useEffect(() => {
        router.push('/hq-staff/dashboard');
    }, []);

    return (
        <></>
    );
}
