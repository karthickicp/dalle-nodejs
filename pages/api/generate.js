import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const animal = req.body.animal || "";
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      },
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(animal),
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Suggest three names for an animal that is a superhero.

Animal: Cat
Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
Animal: Dog
Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
Animal: ${capitalizedAnimal}
Names:`;
}

function addImageProcess(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.height = image.naturalHeight;
      canvas.width = image.naturalWidth;
      ctx.drawImage(image, 0, 0);
      const dataUrl = canvas.toDataURL();
      console.log(dataUrl, 'data url')
    };
  });
}

export const generateImages = async () => {
  const response = await openai.createImage({
    prompt: "coffee",
    n: 4,
    size: "256x256",
  });
  addImageProcess('https://oaidalleapiprodscus.blob.core.windows.net/private/org-MWjozX4bIe2lPYAsyr3s70Xk/user-kxhu6DGgStGrLrwOjRf8AR5n/img-VjHMcHukPExJlP5ZKgevlvZH.png?st=2023-02-23T17%3A30%3A14Z&se=2023-02-23T19%3A30%3A14Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-02-23T02%3A53%3A31Z&ske=2023-02-24T02%3A53%3A31Z&sks=b&skv=2021-08-06&sig=n6p8Rf2kDa/2i1hBfIci3dmH067QdR%2BZxUr7H57AkQo%3D').then(res => console.log(res))
  return response.data;
};


const getBase64FromUrl = async (url) => {
  const data = await fetch(url);
  const blob = await data.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob); 
    reader.onloadend = () => {
      const base64data = reader.result;   
      resolve(base64data);
    }
  });
}

