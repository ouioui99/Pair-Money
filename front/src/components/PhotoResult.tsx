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
  const [transformResult, setTransformResult] = useState<
    TransformResult | undefined
  >();

  const togglePopup = () => {
    console.log(isOpen);

    setIsOpen(!isOpen);
  };
  const navigate = useNavigate();

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const intValue = Number(value);
    if (!isNaN(intValue)) {
      setTransformResult({ totalAmount: intValue });
    }
  };
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

              setIsOpen(true);
              setTransformResult(transformResult);
            }
          }}
        >
          読み込み
        </button>
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            {transformResult?.error ? (
              <>
                <h2 className="text-2xl font-semibold mb-4 text-red-600">
                  {transformResult?.error.title}
                </h2>
                <p className="mb-4 text-gray-700">
                  {transformResult?.error.message}
                </p>
                <button
                  className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                  onClick={togglePopup}
                >
                  Close
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-semibold mb-4 text-green-600">
                  合計金額
                </h2>
                <p className="mb-2 text-gray-700">
                  認識された合計金額を編集できます:
                </p>
                <input
                  type="text"
                  value={transformResult?.totalAmount}
                  onChange={handleAmountChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                />
                <div className="flex gap-2 mt-4">
                  <button
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    onClick={() => {
                      navigate("/", {
                        state: { totalAmount: transformResult?.totalAmount },
                      });
                      togglePopup();
                    }}
                  >
                    読み込み
                  </button>
                  <button
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    onClick={togglePopup}
                  >
                    再撮影
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
