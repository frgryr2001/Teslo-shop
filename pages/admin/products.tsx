import { AddOutlined, CategoryOutlined } from '@mui/icons-material';
import { Box, Button, CardMedia, Grid, Link } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import React from 'react';
import { AdminLayout } from '../../components/layouts';
import useSWR from 'swr';
import { IProduct } from '../../interfaces/products';
import NextLink from 'next/link';

const columns: GridColDef[] = [
  {
    field: 'img',
    headerName: 'Image',
    renderCell: ({ row }: GridRenderCellParams) => {
      return (
        <a href={`/product/${row.slug}`} target="_blank" rel="noreferrer">
          <CardMedia
            component={'img'}
            className="fadeIn"
            alt={row.title}
            image={row.img}
          />
        </a>
      );
    },
  },
  {
    field: 'title',
    headerName: 'Title',
    width: 250,
    renderCell: ({ row }: GridRenderCellParams) => {
      return (
        <NextLink href={`/admin/products/${row.slug}`} passHref legacyBehavior>
          <Link underline="always">{row.title}</Link>
        </NextLink>
      );
    },
  },
  { field: 'gender', headerName: 'Gender' },
  { field: 'type', headerName: 'Total' },
  { field: 'inStock', headerName: 'Quantity in stock' },
  { field: 'price', headerName: 'Price' },
  { field: 'sizes', headerName: 'Size', width: 250 },
];

const ProductPage = () => {
  const { data, error } = useSWR<IProduct[]>('/api/admin/products');

  if (!data && !error) return <></>;

  const rows = data!.map((product) => {
    return {
      id: product._id,
      img: product.images[0],
      title: product.title,
      gender: product.gender,
      type: product.type,
      inStock: product.inStock,
      price: product.price,
      sizes: product.sizes.join(', '),
      slug: product.slug,
    };
  });

  return (
    <AdminLayout
      title={`Products ${data?.length}`}
      pageDescription={'Products management'}
      icon={<CategoryOutlined />}
    >
      <Box display="flex" justifyContent="end" sx={{ mb: 2 }}>
        <Button
          startIcon={<AddOutlined />}
          color="secondary"
          href="/admin/products/new"
        >
          Create product
        </Button>
      </Box>
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default ProductPage;
