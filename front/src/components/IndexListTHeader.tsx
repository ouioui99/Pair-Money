import React from "react";
import { IndexLisHeader } from "../types";

interface Props {
  fixedCosts: FixedCostType[];
  handleEdit: (index: number) => void;
  handleDelete: (index: number) => void;
}

interface FixedCostType {
  amount: number;
  date: string;
  category: string;
}

export default function IndexListTHeader(props: IndexLisHeader) {
  return (
    <thead>
      <tr className="bg-gray-100 text-left">
        {props.tHeaders.map((tHeader) => {
          return <th className="p-4">{tHeader}</th>;
        })}
      </tr>
    </thead>
  );
}
