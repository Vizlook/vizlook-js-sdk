import Vizlook from "../src/index";

const vizlook = new Vizlook({
  apiKey: process.env.VIZLOOK_API_KEY,
});

async function runExamples() {
  try {
    // Answer in non-stream mode
    const response = await vizlook.answer("how to be productive");
    console.log("Answer:", response.answer);
    console.log("Citations:", response.citations);

    // Answer in stream mode
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
  } catch (error) {
    console.error("Example error:", error);
  }
}

runExamples();
