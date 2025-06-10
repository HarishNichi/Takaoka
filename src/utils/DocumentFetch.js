import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import ScanbotSDKService from "@/utils/scanbot";

/**
 * Next.js requires useSearchParams to be used within a Suspense component, 
 * and it must be therefore wrapped in a separate component. 
 * It's a bit dumb in our use-case, but it is what it is.
 * At least we could unify router push and document retrieval in one component.
 * Reference: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
 */
export default function DocumentFetch(props) {
    const router = useRouter();
    const params = useSearchParams();

    useEffect(() => {
        const document = ScanbotSDKService.instance.findDocument(params.get("id"));

        // if (!document) {
        //     router.push('/', { scroll: false });
        //     return;
        // }
        props.onDocumentFound(document);
    }, [router, params, props]);

    return null;
}
