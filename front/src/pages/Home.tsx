import React from "react";
import { Link } from "react-router-dom";
import FixedCostsInputForm from "../components/FixedCostsInputForm";

export default function Home() {
  return (
    <div className=" flex items-center justify-center w-100">
      <FixedCostsInputForm></FixedCostsInputForm>
    </div>
  );
}
