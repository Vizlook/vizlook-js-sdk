import Vizlook from "../src/index";

const vizlook = new Vizlook({
  apiKey: process.env.VIZLOOK_API_KEY,
});

async function runExamples() {
  try {
    const response = await vizlook.search("how to be productive", {
      startPublishedDate: "2025-08-19T15:01:36.000Z",
      endPublishedDate: Date.now(),
      maxResults: 5,
      includeTranscription: true,
      includeSummary: true,
    });
    console.log("response:", response);
  } catch (error) {
    console.error("Error:", error);
  }
}

runExamples();
