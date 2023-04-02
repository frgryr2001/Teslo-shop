import { PeopleOutline } from '@mui/icons-material';
import React from 'react';
import { AdminLayout } from '../../components/layouts';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Grid, MenuItem, Select } from '@mui/material';
import { IUser } from '../../interfaces';
import useSWR from 'swr';
import requestApi from '../../api/requestApi';
import { useEffect } from 'react';

const UsersPage = () => {
  const { data, error } = useSWR<IUser[]>('/api/admin/users');
  const [users, setUsers] = React.useState<IUser[]>([]);

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  if (!data && !error) return <></>;

  const onRoleUpdated = async (userId: string, newRole: string) => {
    const previosUsers = users!;
    const updatedusers = users!.map((user) => {
      if (user._id === userId) {
        return { ...user, role: newRole };
      }
      return user;
    });
    setUsers(updatedusers);

    try {
      await requestApi.put(`/admin/users/`, { userId, role: newRole });
    } catch (error) {
      setUsers(previosUsers);
      alert('Error updating role');
    }
  };

  const columns: GridColDef[] = [
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'name', headerName: 'Fullname', width: 300 },
    {
      field: 'role',
      headerName: 'Role',
      width: 300,
      renderCell: ({ row }: GridRenderCellParams) => {
        return (
          <Select
            value={row.role}
            label="Rol"
            onChange={(e) => onRoleUpdated(row.id, e.target.value)}
            sx={{ width: '300px' }}
          >
            <MenuItem value="admin">admin</MenuItem>
            <MenuItem value="client">client</MenuItem>
            <MenuItem value="super-user">super-user</MenuItem>
            <MenuItem value="SEO">SEO</MenuItem>
          </Select>
        );
      },
    },
  ];

  const rows = users!.map((user, index) => {
    return {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  });
  return (
    <AdminLayout
      title="Users"
      pageDescription="User management"
      icon={<PeopleOutline />}
    >
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            loading={data ? false : true}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default UsersPage;
