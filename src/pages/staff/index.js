/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Staff() {
    const router = useRouter();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        router.push("/staff/family");
    }, []);

    return (
        <></>
    );
}
