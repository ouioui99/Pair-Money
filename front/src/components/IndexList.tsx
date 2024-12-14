import React from "react";

//可変の型にする
interface thead {
  date: string;
}

interface Exam {
  date: string;
  amount: string;
  type: string;
}

type IndexListProps = {
  header: String;
  theadList: thead[];
  exam: Exam[];
};

export default function IndexList(props: IndexListProps) {
  return (
    <div className="bg-gray-50 min-h-screen min-w-full p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg">
        <header className="p-4 border-b ">
          <h1 className="text-xl font-semibold">{props.header}</h1>
        </header>

        {/* Responsive Table */}
        <div className="overflow-hidden">
          <table className="min-w-full hidden md:table table-auto">
            <thead>
              <tr className="bg-gray-100 text-left">
                {props.theadList.map((thead) => {
                  return <th className="p-4">{thead.date}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {props.exam.map((exam, index) => (
                <tr key={index} className="border-t hover:bg-gray-200">
                  {/* ホバー時の色を設定 */}
                  <td className="p-4 whitespace-nowrap">{exam.date}</td>
                  <td className="p-4">{exam.amount}</td>
                  <td className="p-4">{exam.type}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile View */}
          <div className="block md:hidden">
            {props.exam.map((exam, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 bg-white shadow-md" // ホバー時の色を設定
              >
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Date:</span>
                  <span>{exam.date}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Amount:</span>
                  <span>{exam.amount}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Type:</span>
                  <span>{exam.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
