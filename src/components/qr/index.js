import { useState } from "react";
import { useZxing } from "react-zxing";

export const BarcodeScanner = (props) => {
    const [result, setResult] = useState("");
    const { ref,
        torch: { on, off, isOn, isAvailable },
    } = useZxing({
        onResult(result) {
            setResult(result.getText());
        },
    });

    return (
        <>
            <video ref={ref} width={props.width} />
        </>
    );
};