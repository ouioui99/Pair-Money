import CustomBottomNavigation from "../components/CustomBottomNavigation";
import GroupCreateForm from "../components/GroupCreateForm";
import Header from "../components/Header";

export default function Group() {
  const handleGroupCreate = (groupName: string) => {
    console.log(groupName);
  };
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header title={"グループ"}></Header>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-lg">
          <GroupCreateForm
            handleGroupCreate={handleGroupCreate}
          ></GroupCreateForm>
        </div>
      </div>

      {/* カスタムボトムナビゲーション */}
      <footer className="w-full mt-auto">
        <CustomBottomNavigation />
      </footer>
    </div>
  );
}
