import React from 'react';
import styled from '@emotion/styled';
import { TitleBar } from '../../../lib';
import { Box, Button, CircularProgress, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import dayjs from 'dayjs';
import Filter from './Filter';
import View from './View';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Visibility } from '@mui/icons-material';

interface TransactionProps {
	_id: string;
	products: [];
	user: string;
	userId: string;
	transactionDate: string;
	transactionId: string;
	transactionTotal: number;
	transactionType: number;
	other: {
		customer?: string;
	}
	payment: {
		bank?: string;
		paymentMode: string;
		referenceNumber?: string;
	}
}

const SalesReport = () => {
	const [error, setError] = React.useState<any>(null);
	const [usersError, setUsersError] = React.useState<any>(null);
	const [filterModal, setFilterModal] = React.useState<boolean>(false);
	const [transactions, setTransactions] = React.useState<TransactionProps[] | null>(null);
	const [transaction, setTransaction] = React.useState<TransactionProps | null>(null);
	const [viewModal, setViewModal] = React.useState(false);
	const navigate = useNavigate();

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

	const selectItem = (e: React.MouseEvent, item: TransactionProps) => {
		setTransaction(item);
		if(e.detail >= 2) setViewModal(true);
	};
	
	const openTransaction = (e: React.MouseEvent, item: TransactionProps) => {
		setTransaction(item)
		setViewModal(true);
	}

	React.useEffect((): () => void => {
		document.title = "Sales Report: Overwatch";
		return () => null;
	}, []);

	// check token and redirect to login if token has expired
  React.useEffect(() => {
    if(error && error.response?.status === 401 && error.response?.data?.message.toLowerCase().includes("expired")) navigate("/auth/login");
  }, [error]);

	return (
		<Section>
			<Topbar>
				<TitleBar text="Sales Report" />
				<Button onClick={() => setFilterModal(true)} variant="outlined">Filter</Button>
			</Topbar>
			<Container>
				<DataContainer>
					{
						isLoading ?
						<Box sx={{ height: '50vh', display: 'grid', placeItems: 'center' }}><CircularProgress size="6rem" /></Box>
						: (
							error ?
							<Box sx={{ height: "100%", display: "grid", placeItems: "center", overflow: 'auto' }}>
								<Typography variant="h5" color="error">
									{
										error.response?.status === 401 ?
										<Box>
											Error {error.response.status}: {error.response?.data?.message} <br />
											<Link to="/auth/login" style={{ textDecoration: 'underline' }}>Sign out</Link> and sign in again
										</Box>
										: JSON.stringify(error, null, 2)
									}
								</Typography>
							</Box>
							: transactions &&
							<TableContainer sx={{ height: 'calc(100vh - 185px)' }} component={Box}>
								<Table sx={{ minWidth: 0 }} size="small" aria-label="report table" stickyHeader>
									<TableHead>
										<TableRow>
											<TableCell sx={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', fontWeight: 700, paddingLeft: 1 }}>Date</TableCell>
											<TableCell sx={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', fontWeight: 700 }} align="left">Transaction ID</TableCell>
											<TableCell sx={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', fontWeight: 700 }} align="right">Amount</TableCell>
											<TableCell sx={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', fontWeight: 700 }} align="center">User</TableCell>
											<TableCell sx={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', fontWeight: 700 }} align="center">View</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{transactions.map((item: TransactionProps) => (
											<TableRow key={item.transactionId} sx={{ cursor: 'pointer', backgroundColor: transaction?.transactionId === item.transactionId ? 'rgba(0, 0, 0, 0.07)' : '', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.07)' } }} onClick={(e) => selectItem(e, item)}>
												<TableCell component="th" scope="row">{dayjs(item.transactionDate).format('DD-MM-YYYY hh:mm:ss A')}</TableCell>
												<TableCell align="left">{item._id}</TableCell>
												<TableCell align="right">{Number(item.transactionTotal).toLocaleString()}</TableCell>
												<TableCell align="center">{item.user}</TableCell>
												<TableCell align="center">
													<IconButton size="small" onClick={(e) => openTransaction(e, item)}><Visibility /></IconButton>
												</TableCell>
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

const Section = styled.div``;

const Container = styled.div``;

const DataContainer = styled.div`
	height: calc(100vh - 170px);
`;

const Topbar = styled.div`
	margin-top: 0.5rem;
	display: flex;
	width: 100%;
	gap: 1rem;
	align-items: center;
	justify-content: space-between;
	position: relative;
	button {
		padding: 0.15rem 0.5rem;
		position: absolute;
		right: 0;
		bottom: 50%;
	}
`;
