import React, { Dispatch, SetStateAction } from "react";
import { analyzeImage } from "../googleCloud/api/cloudVision";
import { transformApiData } from "../util/apiUtils";
import { useNavigate } from "react-router-dom";

type Props = {
  setImage: Dispatch<SetStateAction<string | undefined>>;
  img?: string;
};

export default function PhotoResult(props: Props) {
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
              const totalAmount = transformApiData(result);

              navigate("/");
            }
          }}
        >
          読み込み
        </button>
      </div>
    </div>
  );
}
