import Vizlook from "../src/index";

const vizlook = new Vizlook({
  apiKey: process.env.VIZLOOK_API_KEY,
});

async function runExamples() {
  try {
    // Crawl video contents in real-time
    const response1 = await vizlook.getVideoContents(
      "https://www.youtube.com/watch?v=QdBokRd2ahw",
      {
        crawlMode: "Always",
      }
    );
    console.log("results 1:", response1.results);

    // Get video contents from existing data
    const response2 = await vizlook.getVideoContents(
      "https://www.youtube.com/watch?v=QdBokRd2ahw"
    );
    console.log("results 2:", response2.results);

    // Crawl video content in real time when there is no corresponding video in the existing data
    const response3 = await vizlook.getVideoContents(
      "https://www.youtube.com/watch?v=QdBokRd2ahw",
      {
        crawlMode: "Fallback",
      }
    );
    console.log("results 3:", response3.results);
  } catch (error) {
    console.error("Error:", error);
  }
}

runExamples();
