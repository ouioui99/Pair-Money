import React, { ChangeEvent } from "react";

type Props = {
  id: string;
  name: string;
  type: string;
  autoComplete: string;
  required: boolean;
  value: string;
  onChange: (value: string) => void;
};

export default function TextFormInput(props: Props) {
  return (
    <input
      id={props.id}
      name={props.name}
      type={props.type}
      autoComplete={props.autoComplete}
      required={props.required}
      value={props.value}
      onChange={(e: ChangeEvent<HTMLInputElement>) =>
        props.onChange(e.target.value)
      }
      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
  );
}