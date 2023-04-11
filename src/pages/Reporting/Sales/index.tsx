import React from 'react';
import styled from '@emotion/styled';
import { TitleBar } from '../../../lib';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import dayjs from 'dayjs';
import Filter from './Filter';
import View from './View';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const Section = styled.div`
	position: relative;
`;
const Container = styled.div`
	padding: 1rem;
`;
const DataContainer = styled.div`
	height: calc(100vh - 170px);
`;

interface TransactionProps {
	_id: string;
	products: [],
	total: number;
	paymentMode: string;
	bank: string | undefined,
	amountTendered: number;
	balance: number;
	customerName: string;
	referenceNumber: string | undefined,
	transactionDate: string;
	transactionId: string;
	transactionTotal: number;
	user: string;
}

const SalesReport = () => {
	const [error, setError] = React.useState<any>(null);
	const [usersError, setUsersError] = React.useState<any>(null);
	const [filterModal, setFilterModal] = React.useState<boolean>(true);
	const [transactions, setTransactions] = React.useState<TransactionProps[] | null>(null);
	const [transaction, setTransaction] = React.useState<TransactionProps | null>(null);
	const [viewModal, setViewModal] = React.useState(false);

	const fetchFn = async () => {
		const token = localStorage.getItem('token') as string | null;
		const config = {
			url: 'transactions/sales',
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Headers': '*',
				'Authorization': `Bearer ${token}`
			}
		}
	
		try {
			const response = await axios.request(config);
			if(response.status === 200 && response.data.status === 1) {
				return response.data;
			}
		} catch (error) {
			setError(error);
		}
	}

	const { data, isLoading, refetch } = useQuery({
		queryKey: ['salesReport'], queryFn: fetchFn,
		keepPreviousData: true, cacheTime: 600000, staleTime: 600000,
		networkMode: 'offlineFirst'
	});

	const fetchCashiers = async () => {
		const token = localStorage.getItem('token') as string | null;
		const config = {
			url: 'users/lite',
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Headers': '*',
				'Authorization': `Bearer ${token}`
			}
		}
	
		try {
			const response = await axios.request(config);
			if(response.status === 200 && response.data.status === 1) {
				return response.data;
			}
		} catch (error) {
			setUsersError(error);
		}
	}

	const { data: users, isLoading: userLoading, refetch: usersRefetch } = useQuery({
		queryKey: ['cashiers'], queryFn: fetchCashiers,
		keepPreviousData: true, cacheTime: 600000, staleTime: 600000,
		networkMode: 'offlineFirst'
	});

	React.useEffect(() => {
		if(data?.data) setTransactions(data?.data);
	}, [data]);

	const openTransaction = (e: React.MouseEvent, item: TransactionProps) => {
		setTransaction(item);
		if(e.detail >= 2) setViewModal(true);
	}

	React.useEffect((): () => void => {
		document.title = "Sales Report: Overwatch";
		return () => null;
	}, []);

	// React.useEffect(() => {
	// 	const today = data?.data?.filter((item: TransactionProps) => dayjs(item.transactionDate) >= dayjs().startOf('d') && dayjs(item.transactionDate) <= dayjs().endOf('d'))
	// 	setTransactions(today);
	// }, [data]);

	return (
		<Section>
			<TitleBar text="Sales Report" />
			<Button onClick={() => setFilterModal(true)} variant="outlined" sx={{ position: 'absolute', top: '0.25rem', right: '1rem' }}>Filter</Button>
			<Container>
				<DataContainer>
					{
						isLoading ?
						<Box sx={{ height: '50vh', display: 'grid', placeItems: 'center' }}><CircularProgress size="6rem" /></Box>
						: (
							error ?
							<Box sx={{ height: '50vh', display: 'grid', placeItems: 'center' }}>
								<Typography color="error" variant="h5">{error?.status}: Error loading transactions</Typography>
							</Box>
							: transactions &&
							<TableContainer component={Paper}>
								<Table sx={{ minWidth: 0, height: 'calc(100vh - 185px)' }} size="small" aria-label="report table" stickyHeader>
									<TableHead>
										<TableRow>
											<TableCell>Date</TableCell>
											<TableCell align="left">Transaction ID</TableCell>
											<TableCell align="left">Payment Mode</TableCell>
											<TableCell align="right">Amount</TableCell>
											<TableCell align="left">User</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{transactions.map((item: TransactionProps) => (
											<TableRow key={item.transactionId} sx={{ cursor: 'pointer', backgroundColor: transaction?.transactionId === item.transactionId ? '#2F3E4615' : '', '&:hover': { backgroundColor: '#2F3E4615' } }} onClick={(e) => openTransaction(e, item)}>
												<TableCell component="th" scope="row">{dayjs(item.transactionDate).format('DD-MM-YYYY hh:mm:ss A')}</TableCell>
												<TableCell align="left">{item._id}</TableCell>
												<TableCell align="left">{item.paymentMode}</TableCell>
												<TableCell align="right">{Number(item.transactionTotal).toLocaleString()}</TableCell>
												<TableCell align="right">{item.user}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						)
					}
				</DataContainer>
			</Container>
			<React.Fragment>
				{ filterModal && <Filter open={filterModal} close={() => setFilterModal(false)} data={data && data.data} setTransactions={setTransactions} refetch={refetch} users={users?.data} /> }
				{ viewModal && <View open={viewModal} close={() => setViewModal(false)} data={transaction} /> }
			</React.Fragment>
		</Section>
	)
}

export default SalesReport;