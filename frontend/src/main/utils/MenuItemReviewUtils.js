import { toast } from "react-toastify";
// Stryker disable all
export function onDeleteSuccess(message) {
  console.log(message);
  toast(message);
}

export function cellToAxiosParamsDelete(cell) {
  return {
    url: "/api/menuitemreview",
    method: "DELETE",
    params: {
      id: cell.row.values.id,
    },
  };
}

// Stryker restore all
