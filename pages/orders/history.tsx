import React from "react";
import { ShopLayout } from "../../components/layouts";
import { Chip, Grid, Typography, Link } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import NextLink from "next/link";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "fullname", headerName: "Fullname", width: 300 },
  {
    field: "paid",
    headerName: "Paid",
    width: 200,
    description: "Status of payment",
    renderCell: (params: GridRenderCellParams<any, any, any>) => {
      return params.row.paid ? (
        <Chip label="Paid" color="success" variant="outlined" />
      ) : (
        <Chip label="No paid" color="error" variant="outlined" />
      );
    },
  },
  {
    field: "Order",
    headerName: "View orders",
    width: 200,
    sortable: false,
    description: "Order of payment",
    renderCell: (params: GridRenderCellParams<any, any, any>) => {
      return (
        <NextLink href={`/orders/${params.row.id}`} passHref legacyBehavior>
          <Link underline="always">View order</Link>
        </NextLink>
      );
    },
  },
];

const rows = [
  { id: 1, paid: false, fullname: "Nguyen Van A" },
  { id: 2, paid: true, fullname: "Nguyen Van B" },
  { id: 3, paid: true, fullname: "Nguyen Van C" },
  { id: 4, paid: false, fullname: "Nguyen Van D" },
];

const HistoryPage = () => {
  return (
    <ShopLayout
      title={"Order history "}
      pageDescription={"Order history of customer"}
    >
      <Typography variant="h1" component={"h1"}>
        Order History
      </Typography>

      <Grid container>
        <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default HistoryPage;
