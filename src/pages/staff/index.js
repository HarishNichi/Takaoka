import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Staff() {
    const router = useRouter();

    useEffect(() => {
        router.push("/staff/dashboard");
    }, []);

    return (
        <></>
    );
}
