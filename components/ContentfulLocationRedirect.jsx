"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useContentfulSdk} from "../index";
import {locations} from '@contentful/app-sdk';

export const ContentfulLocationRedirect = ({
                                               appConfig = "/contentful/app-config",
                                               dialog = "/contentful/dialog",
                                               entryEditor = "/contentful/entry-editor",
                                               entryField = "/contentful/entry-field",
                                               entryFieldSidebar = "/contentful/entry-field-sidebar",
                                               entrySidebar = "/contentful/entry-sidebar",
                                               home = "/contentful/home",
                                               page = "/contentful/page",
                                           }) => {
    const router = useRouter();
    const sdk = useContentfulSdk();

    useEffect(() => {
        if (!sdk?.location || !router) {
            return;
        }

        if (sdk.location.is(locations.LOCATION_APP_CONFIG)) {
            router.push(appConfig);
        } else if (sdk.location.is(locations.LOCATION_DIALOG)) {
            router.push(dialog);
        } else if (sdk.location.is(locations.LOCATION_ENTRY_EDITOR)) {
            router.push(entryEditor);
        } else if (sdk.location.is(locations.LOCATION_ENTRY_FIELD)) {
            router.push(entryField);
        } else if (sdk.location.is(locations.LOCATION_ENTRY_FIELD_SIDEBAR)) {
            router.push(entryFieldSidebar);
        } else if (sdk.location.is(locations.LOCATION_ENTRY_SIDEBAR)) {
            router.push(entrySidebar);
        } else if (sdk.location.is(locations.LOCATION_HOME)) {
            router.push(home);
        } else if (sdk.location.is(locations.LOCATION_PAGE)) {
            router.push(page);
        }

    }, [sdk, router]);

    return null;
}