import React, { useContext, useState } from "react";
import { Member } from "../types";
import { UserContext } from "../contexts/UserContextProvider";

type friendIdForm = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (friendId: string) => Promise<Member[] | undefined>; // 非同期で検索結果を返す関数
};

const MemberInviteForm: React.FC<friendIdForm> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [friendId, setFriendId] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const userContext = useContext(UserContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (friendId) {
        const results = await onSubmit(friendId); // 非同期で検索結果を取得
        if (results) {
          setSearchResults(results); // 検索結果を保存
        }
      }
    } catch (error) {
      setErrorMessage("検索中にエラーが発生しました。");
    } finally {
      setIsLoading(false); // ローディング状態を解除
    }
  };

  const handleCancel = () => {
    setFriendId("");
    setSearchResults([]);
    onClose();
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setFriendId("");
      setSearchResults([]);
      onClose();
    }
  };

  const handleInvite = (selectedMember: Member) => {
    console.log(`Invited: ${selectedMember}`);
    setSearchResults([]);
    setFriendId("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={handleBackgroundClick}
    >
      <div
        className="w-full max-w-md mx-auto p-6 bg-gradient-to-b from-white via-gray-50 to-gray-100 rounded-xl shadow-2xl max-h-[80vh] overflow-auto"
        onClick={(e) => e.stopPropagation()} // 背景クリック時の閉じ動作を無効化
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          メンバー招待
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* メンバー名入力 */}
          <div>
            <label
              htmlFor="friendId"
              className="block text-gray-800 font-medium mb-2 text-sm"
            >
              フレンドID
            </label>
            <input
              type="text"
              id="friendId"
              value={friendId}
              onChange={(e) => setFriendId(e.target.value || "")}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent text-base"
              placeholder="例: 太郎"
              required
            />
          </div>

          {/* 検索ボタン */}
          <button
            type="submit"
            className="w-full py-3 text-base font-semibold text-white bg-indigo-500 rounded-md shadow-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            disabled={isLoading}
          >
            {isLoading ? "検索中..." : "検索"}
          </button>

          {/* キャンセルボタン */}
          <button
            type="button"
            onClick={handleCancel}
            className="w-full py-3 text-base font-semibold text-gray-700 bg-gray-200 rounded-md shadow hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            disabled={isLoading}
          >
            キャンセル
          </button>
        </form>

        {/* エラーメッセージ表示 */}
        {errorMessage && (
          <p className="text-red-500 text-center mt-4">{errorMessage}</p>
        )}

        {/* 検索結果表示 */}
        {searchResults.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              検索結果
            </h3>
            <ul className="space-y-3">
              {searchResults.map((result, index) => (
                <li
                  key={result.uid} // Use `uid` as the unique key
                  className="flex justify-between items-center p-3 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition"
                >
                  <div>
                    <p className="text-gray-800 font-medium">{result.name}</p>
                    <p className="text-sm text-gray-600">ID: {result.fid}</p>
                    {result.uid === userContext?.user?.uid && ( // Compare with logged-in user ID
                      <p className="text-sm text-green-500 font-semibold mt-1">
                        自分のフレンドIDです
                      </p>
                    )}
                  </div>
                  {result.uid !== userContext?.user?.uid && ( // Hide the invite button if it's the logged-in user
                    <button
                      onClick={() => handleInvite(result)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                    >
                      招待
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 検索結果がない場合 */}
        {searchResults.length === 0 && !isLoading && !errorMessage && (
          <p className="text-gray-600 text-center mt-4">
            検索結果がありません。
          </p>
        )}
      </div>
    </div>
  );
};

export default MemberInviteForm;
