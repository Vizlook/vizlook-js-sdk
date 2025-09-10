import Vizlook from "../src/index";

const vizlook = new Vizlook({
  apiKey: process.env.VIZLOOK_API_KEY,
});

async function runExamples() {
  try {
    // Crawl video content in real time when there is no corresponding video in the existing data
    const response = await vizlook.getVideoContents(
      "https://www.youtube.com/watch?v=QdBokRd2ahw",
      {
        crawlMode: "Fallback",
        includeTranscription: true,
        includeSummary: true,
      }
    );
    console.log("response:", response);
  } catch (error) {
    console.error("Error:", error);
  }
}

runExamples();
