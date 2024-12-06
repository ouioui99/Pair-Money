import { HandleDeleteArgs } from "../types";

export const handleDelete = <T>(args: HandleDeleteArgs<T>) => {
  args.selectedDocumentIDSetter(args.documentID);
  args.selectedItemSetter(args.selectedItem);
  args.showModalSetter(true);
};
