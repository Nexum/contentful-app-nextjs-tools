# Usage
This package enables you to easily use nextjs apps as contentful apps

currently it implements helper functions to manage the contentful SDK in the client (not server components!)
and functions to help you verify requests to your api (see https://www.contentful.com/developers/docs/extensibility/app-framework/request-verification/)

# Examples
## Client Components
```javascript
import {Validator} from "@/app/components/Validator";

export default function Home() {
  return <div><Validator /></div>;
}
```

```javascript
// app/components/Validator.jsx
"use client";

import {useEffect, useState} from "react";
import {contentfulSignedFetch} from "contentful-app-nextjs-tools";

export const Validator = () => {
    const [status, setStatus] = useState("loading");

    const validate = async () => {
        const response = await contentfulSignedFetch("/api/secure");
        setStatus(await response.text());
    }

    useEffect(() => {
        validate();
    }, []);

    return <div>
        Status: {status}<br/>
        <button onClick={e => validate()}>Reload</button>
    </div>;

}
```

## Route Handlers
```javascript
// app/api/secure/route.js
import {verifyContentfulRequest} from "contentful-app-nextjs-tools/verifyContentfulRequest";

export const GET = verifyContentfulRequest(async (req) => {
    // this code will only run if the request is valid
    return new Response("valid");
}, process.env.CONTENTFUL_SIGNING_SECRET) // process.env.CONTENTFUL_SIGNING_SECRET can be omitted, will be taken from this env by default!
```