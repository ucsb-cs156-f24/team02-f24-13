import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import {
  cellToAxiosParamsDelete,
  onDeleteSuccess,
} from "main/utils/UCSBOrganizationUtils";
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function UCSBOrganizationTable({
  organizations,
  currentUser,
  testIdPrefix = "UCSBOrganizationTable",
}) {
  const navigate = useNavigate();

  const editCallback = (cell) => {
    navigate(`/ucsbOrganization/edit/${cell.row.values.orgCode}`);
  };

  // Stryker disable all : hard to test for query caching

  const deleteMutation = useBackendMutation(
    cellToAxiosParamsDelete,
    { onSuccess: onDeleteSuccess },
    ["/api/ucsbOrganization/all"],
  );
  // Stryker restore all

  // Stryker disable next-line all : TODO try to make a good test for this
  const deleteCallback = async (cell) => {
    // const orgId = cell.row.values.orgCode; // or the correct identifier
    deleteMutation.mutate(cell);
  };

  const columns = [
    {
      Header: "Org Code",
      accessor: "orgCode", // accessor is the "key" in the data
    },

    {
      Header: "Org Translation Short",
      accessor: "orgTranslationShort",
    },
    {
      Header: "Org Translation",
      accessor: "orgTranslation",
    },
    {
      Header: "Inactive",
      accessor: "inactive",
      Organizations: ({organizations}) => organizations.row.original.inactive.toString(),
    }
  ];
  // (organizations) => organizations.inactive.toString(),
  if (hasRole(currentUser, "ROLE_ADMIN")) {
    columns.push(ButtonColumn("Edit", "primary", editCallback, testIdPrefix));
    columns.push(
      ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix),
    );
  }

  return (
    <OurTable data={organizations} columns={columns} testid={testIdPrefix} />
  );
}
