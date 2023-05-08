import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const station = req.body.station || '';
  if (station.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid station",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(station),
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(station) {
  const capitalizedStation =
  station[0].toUpperCase() + station.slice(1).toLowerCase();
  return `Suggest three names for a new band that might one day be played on the radio.

  Station: Byte
  Names: Wet Leg, Galaxie 500
  Station: BBC 6
  Names: Cool Greenhouse, Egyptian Blue, Dry Cleaning, Porridge Radio
  Station: ${capitalizedStation}
  Names:
`;
}
