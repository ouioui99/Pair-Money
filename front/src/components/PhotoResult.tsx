import React, { Dispatch, SetStateAction, useState } from "react";
import { analyzeImage } from "../googleCloud/api/cloudVision";
import { transformApiData } from "../util/apiUtils";
import { useNavigate } from "react-router-dom";
import PopupExample from "./PopupExample";

type Props = {
  setImage: Dispatch<SetStateAction<string | undefined>>;
  img?: string;
};

interface TransformResult {
  totalAmount?: number;
  error?: { title: string; message: string };
}

export default function PhotoResult(props: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<
    { title: string; message: string } | undefined
  >();

  const togglePopup = () => {
    console.log(isOpen);

    setIsOpen(!isOpen);
  };
  const navigate = useNavigate();
  return (
    <div className="h-dvh">
      <div className="h-4/5">
        <img
          src={props.img}
          className="w-full h-full object-cover"
          alt="Image"
        />
      </div>
      <div className="h-1/5  flex justify-center items-center gap-4">
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text- p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 justify-center"
          style={{
            width: "150px",
            height: "50px",
            top: "0px",
          }}
          onClick={() => {
            props.setImage("");
          }}
        >
          再撮影
        </button>
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text- p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 justify-center"
          style={{
            width: "150px",
            height: "50px",
          }}
          onClick={async () => {
            if (props.img) {
              const result = await analyzeImage(props.img);
              const transformResult: TransformResult = transformApiData(result);

              console.log(transformResult);

              if (transformResult.error) {
                setIsOpen(true);
                setErrorMessage(transformResult.error);
              } else {
                navigate("/", {
                  state: { totalAmount: transformResult.totalAmount },
                });
              }
            }
          }}
        >
          読み込み
        </button>
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">{errorMessage?.title}</h2>
            <p className="mb-4">{errorMessage?.message}</p>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={togglePopup}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
