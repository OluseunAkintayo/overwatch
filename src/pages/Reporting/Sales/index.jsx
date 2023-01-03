import React from 'react';
import styled from 'styled-components';
import { TitleBar } from '../../../lib';
import { useGetSalesQuery } from '../../../redux/api/Transactions';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import dayjs from 'dayjs';
import Filter from './Filter';
import View from './View';

const Section = styled.div`
	position: relative;
`;
const Container = styled.div`
	padding: 1rem;
`;
const DataContainer = styled.div`
	height: calc(100vh - 170px);
`;

const Reporting = () => {
	const { data, isLoading, isError, error, refetch } = useGetSalesQuery();
	const [filterModal, setFilterModal] = React.useState(false);
	const [transactions, setTransactions] = React.useState(null);
	const [viewModal, setViewModal] = React.useState(false);
	const [transaction, setTransaction] = React.useState(null);
	const openTransaction = item => {
		setTransaction(item);
		setViewModal(true);
	}
	const cols = [
		{
			field: 'transactionDate', headerName: 'Date', width: 150,
			renderCell: params => <span style={{ cursor: 'pointer' }} onDoubleClick={() => openTransaction(params.row)}>{dayjs(params.row.transactionDate).format("DD-MM-YYYY HH:mm:ss")}</span>
		},
		{
			field: 'transactionId', headerName: 'Transaction ID', width: 270,
			renderCell: params => <Typography style={{ cursor: 'pointer' }} onDoubleClick={() => openTransaction(params.row)}>{params.row.transactionId}</Typography>
		},
		{ 
			field: 'paymentMode', headerName: 'Payment Mode', width: 120,
			renderCell: params => <Typography sx={{ textTransform: 'capitalize', fontSize: '0.75rem', fontFamily: 'inherit' }}>{params.row.paymentMode}</Typography>
		},
		{
			field: 'transactionTotal', headerName: 'Amount', width: 120,
			renderCell: params => params.row.transactionTotal.toLocaleString()
		},
		{ field: 'user', headerName: 'User', width: 250 },
	];

	React.useEffect(() => {
		const today = data?.data?.filter(item => dayjs(item.transactionDate) >= dayjs().startOf('d') && dayjs(item.transactionDate) <= dayjs().endOf('d'))
		setTransactions(today);
	}, [data]);

	return (
		<Section>
			<TitleBar text="Sales Report" />
			<Button onClick={() => setFilterModal(true)} variant="outlined" sx={{ position: 'absolute', top: '0.25rem', right: '1rem' }}>Filter</Button>
			<Container>
				<DataContainer>
					{
						isLoading ?
						<Box><CircularProgress size="6rem" /></Box>
						: (
							isError ? <Typography color="error" variant="h5">{error?.status}: Error loading transactions</Typography> :
							transactions &&
							<DataGrid
								rows={transactions}
								columns={cols}
								getRowId={row => row._id}
							/>
						)
					}
				</DataContainer>
			</Container>
			<React.Fragment>
				{ filterModal && <Filter open={filterModal} close={() => setFilterModal(false)} data={data.data} setTransactions={setTransactions} refetch={refetch} /> }
				{ viewModal && <View open={viewModal} close={() => setViewModal(false)} data={transaction} /> }
			</React.Fragment>
		</Section>
	)
}

export default Reporting;