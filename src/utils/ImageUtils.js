export class ImageUtils {
    static MIME_TYPE_JPEG = "image/jpeg";
    static MIME_TYPE_PDF = "application/pdf";

    static pick(mime, asDataUrl) {
        return new Promise((resolve) => {
            const picker = document.createElement("input");
            picker.id = 'picker';
            document.body.appendChild(picker);
            document.getElementById("picker").style.visibility = "hidden";

            picker.type = "file";
            picker.accept = mime;
            picker.click();

            picker.onchange = (e) => {
                e.preventDefault();
                let reader = new FileReader();
                let file = e.target.files[0]; // No type annotations
                if (asDataUrl) {
                    reader.readAsDataURL(file);
                } else {
                    reader.readAsArrayBuffer(file);
                }

                reader.onload = (e) => {
                    const result = reader.result;
                    if (asDataUrl) {
                        resolve({ data: result });
                    } else {
                        resolve({ original: new Uint8Array(result) });
                    }

                    picker.remove();
                };
            };
        });
    }

    static saveBytes(data, name) {
        const extension = name.split(".")[1];
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none"; // No TypeScript ignore needed
        const blob = new Blob([data], { type: `application/${extension}` });
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = name;
        a.click();
        // Workaround for iOS 12, to avoid WebKitBlobResource error
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
        }, 100);
    }
}
