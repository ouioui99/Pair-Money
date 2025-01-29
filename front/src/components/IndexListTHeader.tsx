import { IndexLisHeader } from "../types";

export default function IndexListTHeader(props: IndexLisHeader) {
  return (
    <thead>
      <tr className="bg-gray-100 text-left">
        {props.tHeaders.map((tHeader) => {
          return (
            <th className="p-4" key={tHeader}>
              {tHeader}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
