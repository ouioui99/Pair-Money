import { useState, useRef } from "react";
import { Camera, CameraType } from "react-camera-pro";
import { IoCamera } from "react-icons/io5";
import PhotoResult from "../components/PhotoResult";

export default function ReceiptScanning() {
  const camera = useRef<CameraType>(null);
  const [image, setImage] = useState<string | undefined>("");

  return image === "" ? (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Camera
        facingMode="environment"
        aspectRatio={"cover"}
        ref={camera}
        errorMessages={{
          noCameraAccessible:
            "No camera device accessible. Please connect your camera or try a different browser.",
          permissionDenied:
            "Permission denied. Please refresh and give camera permission.",
          switchCamera: undefined,
          canvas: undefined,
        }}
      />
      <button
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text- p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        style={{
          width: "70px",
          height: "70px",
          position: "absolute",
          top: "550px",
          zIndex: 10, // ボタンを前面に表示
        }}
        onClick={() => {
          if (camera.current) {
            const photo = camera.current.takePhoto();
            setImage(photo as string);
          }
        }}
      >
        <IoCamera className="w-5 h-5" />
        <span className="sr-only">Take photo</span>
      </button>
    </div>
  ) : (
    <>
      <PhotoResult img={image} setImage={setImage} />
    </>
  );
}
