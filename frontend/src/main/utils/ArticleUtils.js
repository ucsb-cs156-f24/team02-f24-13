import { toast } from "react-toastify";

export function onDeleteSuccess(response) {
  console.log("Article deleted successfully:", response);
  toast("Article deleted successfully!");
}

export function cellToAxiosParamsDelete(cell) {
  return {
    url: `/api/articles/${cell.row.values.id}`, 
    method: "DELETE",
  };
}