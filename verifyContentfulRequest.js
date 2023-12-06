import {verifyRequest} from '@contentful/node-apps-toolkit';
import {Readable} from "stream";

/**
 * Validate a Request, wrap your nextJs route handler in this
 *
 * @param reqHandlerFunc
 * @param secret
 * @returns {(function(*): Promise<Response|*>)|*}
 */
export const verifyContentfulRequest = (reqHandlerFunc, secret) => {
    return async function(req)  {
        let bodyForVerification;
        if(req.body) {
            const cloneReq = req.clone();
            bodyForVerification = await cloneReq.text();
        }

        const headerObj = {};
        req.headers.forEach((value, header) => {
            headerObj[header] = value;
        });

        const canonicalRequest = {
            path: req.nextUrl.pathname,
            headers: headerObj,
            method: req.method,
            body: bodyForVerification,
        };

        try {
            if (!verifyRequest(secret || process.env.CONTENTFUL_SIGNING_SECRET, canonicalRequest)) {
                throw new Error(`Unauthorized`)
            }
        } catch (e) {
            return new Response(e.message, {status: 403});
        }

        return reqHandlerFunc.apply(this, arguments);
    }
}

export default verifyContentfulRequest;