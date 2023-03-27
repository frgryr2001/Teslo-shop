import {
  AccessTimeOutlined,
  AttachMoneyOutlined,
  CancelPresentationOutlined,
  CategoryOutlined,
  CreditCardOffOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  GroupOutlined,
  ProductionQuantityLimitsOutlined,
} from '@mui/icons-material';

import { AdminLayout } from '../../components/layouts';
import useSWR from 'swr';
import { SummaryTitle } from '../../components/admin/';
import React from 'react';
import { Grid } from '@mui/material';
import { DashboardSummaryResponse } from '../../interfaces';
import { useEffect, useState } from 'react';

const DashboardPage = () => {
  const { data, error } = useSWR<DashboardSummaryResponse>(
    '/api/admin/dashboard',
    {
      refreshInterval: 30 * 1000,
    }
  );

  const [refreshIn, setRefreshIn] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshIn((refreshIn) => (refreshIn > 0 ? refreshIn - 1 : 30));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!error && !data) return <></>;
  if (error) return <div>Failed to load</div>;

  const {
    numberOfOrders,
    paidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory,
    notPaidOrders,
  } = data!;

  return (
    <AdminLayout
      title="Dashboard"
      pageDescription="Admin dashboard management"
      icon={<DashboardOutlined />}
    >
      <Grid container spacing={2}>
        <SummaryTitle
          icon={<CreditCardOutlined color="secondary" sx={{ fontSize: 40 }} />}
          title={numberOfOrders}
          subTitle={'Orders total'}
        />
        <SummaryTitle
          icon={<AttachMoneyOutlined color="success" sx={{ fontSize: 40 }} />}
          title={paidOrders}
          subTitle={'Paid orders'}
        />
        <SummaryTitle
          icon={<CreditCardOffOutlined color="error" sx={{ fontSize: 40 }} />}
          title={notPaidOrders}
          subTitle={'Not paid orders'}
        />
        <SummaryTitle
          icon={<GroupOutlined color="primary" sx={{ fontSize: 40 }} />}
          title={numberOfClients}
          subTitle={'Clients'}
        />
        <SummaryTitle
          icon={<CategoryOutlined color="warning" sx={{ fontSize: 40 }} />}
          title={numberOfProducts}
          subTitle={'Products'}
        />
        <SummaryTitle
          icon={
            <CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} />
          }
          title={productsWithNoInventory}
          subTitle={'Products with no inventory'}
        />
        <SummaryTitle
          icon={
            <ProductionQuantityLimitsOutlined
              color="warning"
              sx={{ fontSize: 40 }}
            />
          }
          title={lowInventory}
          subTitle={'Low inventory'}
        />
        <SummaryTitle
          icon={<AccessTimeOutlined color="secondary" sx={{ fontSize: 40 }} />}
          title={refreshIn}
          subTitle={'Time refresh'}
        />
      </Grid>
    </AdminLayout>
  );
};
export default DashboardPage;
