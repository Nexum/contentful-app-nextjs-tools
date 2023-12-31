import {createClient} from 'contentful-management';
import {create} from 'zustand';
import {init as initContentfulApp} from '@contentful/app-sdk';

/**
 *
 * @type {{resolve: ((function(): never)|*), reject: ((function(): never)|*), promise: {Promise<unknown>}}}
 */
const waitForContentfulPromiseStore = {
    promise: null,
    resolve: () => {
        throw new Error(`Promise not initialized!`);
    },
    reject: () => {
        throw new Error(`Promise not initialized!`);
    }
}

/**
 *
 * @type {Promise<unknown>}
 */
waitForContentfulPromiseStore.promise = new Promise((resolve, reject) => {
    waitForContentfulPromiseStore.resolve = resolve;
    waitForContentfulPromiseStore.reject = reject;
});

/**
 *
 * @type {UseBoundStore<Mutate<StoreApi<{client: null, setSdk: function(*): void, waitForContentful: null, sdk: null}>, []>>}
 */
export const useContentful = create((set) => ({
    client: null,
    sdk: null,
    setSdk: (sdk) => {
        set({sdk, client: createClient({apiAdapter: sdk.cmaAdapter})});
        waitForContentfulPromiseStore.resolve();
    },
    waitForContentful: waitForContentfulPromiseStore.promise
}))

initContentfulApp((sdk) => {
    useContentful.getState().setSdk(sdk)
});

/**
 * returns the contentful-management client if initialized
 *
 * @returns {null}
 */
export const useContentfulClient = () => {
    return useContentful(store => store.client);
}

/**
 *
 * @returns {CMAClient | PlainClientAPI}
 */
export const useContentfulCma = () => {
    return useContentful(store => store.sdk?.cma);
}

/**
 *
 * @returns {null}
 */
export const useContentfulSdk = () => {
    return useContentful(store => store.sdk);
}

/**
 * Takes the regular fetch options, passes them through extended by the signed contentful headers
 *
 * @param url
 * @param options
 * @returns {Promise<Response>}
 */
export const contentfulSignedFetch = async (url, options = {method: "GET"}) => {
    return fetch(url, await applyContentfulHeaders({url, ...options}));
}

/**
 *
 * @param req
 * @returns {Promise<{url: string}>}
 */
export const applyContentfulHeaders = async (req) => {
    await useContentful.getState().waitForContentful;

    const sdk = useContentful.getState().sdk;

    if (typeof req === "string") {
        req = {url: req};
    }

    req.method ??= "GET";
    req.headers ??= {};

    const {additionalHeaders} = await sdk.cma.appSignedRequest.create({
        appDefinitionId: sdk.ids.app,
    }, {
        method: req.method,
        headers: req.headers,
        body: req.body,
        path: req.url,
    });

    Object.assign(req.headers, additionalHeaders);

    return req;
}