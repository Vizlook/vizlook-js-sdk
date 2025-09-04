import Vizlook from "../src/index";

const vizlook = new Vizlook({
  apiKey: process.env.VIZLOOK_API_KEY,
});

async function runExamples() {
  try {
    const response1 = await vizlook.search("how to be productive");
    console.log("results 1:", response1.results);

    // Search with transcription contents
    const response2 = await vizlook.search("how to be productive", {
      config: {
        needTranscription: true,
      },
    });
    console.log("results 2:", response2.results);

    // Search with summary
    const response3 = await vizlook.search("how to be productive", {
      config: {
        needSummary: true,
      },
    });
    console.log("results 3:", response3.results);

    // Search by published date
    const response4 = await vizlook.search("how to be productive", {
      startPublishedDate: "2025-08-19T15:01:36.000Z", // or 1755615696000
    });
    console.log("results 4:", response4.results);
  } catch (error) {
    console.error("Error:", error);
  }
}

runExamples();
