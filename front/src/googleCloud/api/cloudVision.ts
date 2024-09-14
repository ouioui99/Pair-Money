import axios from "axios";

export const analyzeImage = async (image: string) => {
  const API_KEY = import.meta.env.VITE_REACT_APP_GOOGLE_CLOUD_VISION_API_KEY;
  console.log(API_KEY);

  const url = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

  const cleanedBase64 = image.replace(/^data:image\/jpeg;base64,/, "");

  const request = {
    requests: [
      {
        image: {
          content: cleanedBase64,
        },
        features: [
          {
            type: "TEXT_DETECTION",
          },
        ],
      },
    ],
  };

  try {
    const response = await axios.post(url, request);
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("Error calling the Vision API", error);
    return;
  }
};
