import { toastDisplay } from "@/helper";
import axios from "@/utils/api";

/* Identity and Access management (IAM) */
export const PublicEvacueeService = {
    getList: _getList,
};

/**
 * Get place list
 * @param {*} payload
 * @param {*} callBackFun
 */
function _getList(payload, callBackFun) {
    axios
        .post("/user/public/evacuees", payload)
        .then((response) => {
            if (response && response.data) {
                callBackFun(response.data);
            }
        })
        .catch((error) => {
            toastDisplay(error?.response);
        });
}