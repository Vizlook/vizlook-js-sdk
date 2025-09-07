# @vizlook/sdk

Official Vizlook Javscript SDK.

https://www.npmjs.com/package/@vizlook/sdk

## Install

```
npm install @vizlook/sdk
```

## Usage

```js
import Vizlook from "@vizlook/sdk";

const vizlook = new Vizlook({
  apiKey: process.env.VIZLOOK_API_KEY,
});
```

Performs a video search on the Vizlook system.

```javascript
const response = await vizlook.search("how to be productive", {
  maxResults: 5,
  startPublishedDate: "2025-08-19T15:01:36.000Z",
  config: {
    needTranscription: true,
    needSummary: true,
  },
});
```

Generates an answer to a query.

```javascript
const response = await vizlook.answer("how to be productive", {
  needTranscription: true,
});
```

Streams an answer to a query.

```javascript
const streamResponse = vizlook.streamAnswer("how to be productive");
let answer = "";

for await (const chunk of streamResponse) {
  switch (chunk.type) {
    case "answer-chunk":
      answer += chunk.data;
      console.log("Answer chunk:", chunk.data);
      break;
    case "data-citations":
      console.log("Citations:", chunk.data.citations);
      break;
    case "data-cost":
      console.log("Cost:", chunk.data.dollarCost);
      break;
    case "error":
      console.log("Error:", chunk.data.errorText);
      break;
  }
}
console.log("Final answer:", answer);
```

Retrieves contents of videos based on specified URLs.

```javascript
const response = await vizlook.getVideoContents(
  "https://www.youtube.com/watch?v=QdBokRd2ahw",
  {
    crawlMode: "Always",
  }
);
```

## Documentation

https://docs.vizlook.com

## API

https://docs.vizlook.com/documentation/api-reference/search

## Contributing

Feel free to submit pull requests. For larger-scale changes, though, it's best to open an issue first so we can deliberate on your plans.
