import React, { FormEvent } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { ModalTitle, ModalWrapper } from '../../../lib';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Autocomplete, Box, Button, Grid, MenuItem, TextField } from '@mui/material';
import { DesktopDateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface FilterModalProps {
	open: boolean;
	close: () => void;
	refetch: () => void;
	data: TransactionDataProps[];
	setTransactions: any;
	users: { name: string; id: string }[];
}

interface TransactionDataProps {
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

interface CashierProps {
	name: string;
}

const Filter = ({ open, close, refetch, data, setTransactions, users: cashiers }: FilterModalProps) => {
	React.useEffect(() => {
		refetch();
	}, []);

	const filterParams = {
		startDate: sessionStorage.getItem('startDate'),
		endDate: sessionStorage.getItem('endDate'),
		paymentMode: sessionStorage.getItem('transactionType')
	}

	const [startDate, setStartDate] = React.useState<Dayjs | null>(filterParams.startDate ? dayjs(filterParams.startDate) : dayjs().startOf('d'));
	const handleStartDateChange = (newValue: Dayjs | null) => {
		if(newValue) {
			setStartDate(newValue);
			sessionStorage.setItem('startDate', newValue.toISOString());
		}
	};

	const [endDate, setEndDate] = React.useState<Dayjs | null>(filterParams.endDate ? dayjs(filterParams.endDate) : dayjs().endOf('d'));
	const handleEndDateChange = (newValue: Dayjs | null) => {
		if(newValue) {
			setEndDate(newValue);
			sessionStorage.setItem('endDate', newValue.toISOString());
		}
	};

	const [paymentMode, setPaymentMode] = React.useState<string>(filterParams.paymentMode || "");
	const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPaymentMode(e.target.value);
		sessionStorage.setItem('transactionType', e.target.value);
	};

	const retrievedCashier = sessionStorage.getItem('cashier');
	const parsedCashier: CashierProps = retrievedCashier && JSON.parse(retrievedCashier);
	const [cashier, setCashier] = React.useState<CashierProps | null>(parsedCashier);

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();
		let filteredData = data;
		if(startDate && endDate) {
			filteredData = filteredData?.filter((item: TransactionDataProps) => startDate <= dayjs(item.transactionDate) && endDate >= dayjs(item.transactionDate));
		}
		setTransactions(filteredData);
		close();
	}

	return (
		<ModalWrapper open={open} close={close}  modalClass={'filterModal'}>
			<ModalTitle title="Filter Report" />
			<Box component="form" onSubmit={submit} sx={{ marginTop: 4 }}>
				<Grid container spacing={3} marginTop={2}>
					<Grid item xs={6}>
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DesktopDateTimePicker
								label="Start Date"
								disableFuture
								value={startDate}
								onChange={handleStartDateChange}
								renderInput={(params) => <TextField {...params} fullWidth />}
							/>
						</LocalizationProvider>
					</Grid>
					<Grid item xs={6}>
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DesktopDateTimePicker
								label="End Date"
								disableFuture
								value={endDate}
								onChange={handleEndDateChange}
								renderInput={(params) => <TextField {...params} fullWidth />}
							/>
						</LocalizationProvider>
					</Grid>
					<Grid item xs={6}>
						<TextField select fullWidth label="Payment Mode" value={paymentMode} onChange={handlePaymentChange}>
							<MenuItem value="">Choose</MenuItem>
							<MenuItem value="cash">Cash</MenuItem>
							<MenuItem value="card">Card</MenuItem>
							<MenuItem value="transfer">Transfer</MenuItem>
						</TextField>
					</Grid>
					<Grid item xs={6}>
						<Autocomplete
							id="cashier"
							options={cashiers}
							value={cashier}
							getOptionLabel={(val) => val?.name || ""}
							onChange={(e, value) => {
								value && setCashier(value);
								value && sessionStorage.setItem('cashier', JSON.stringify(value));
							}}
							renderInput={(params) =>(
								<TextField {...params} name="cashier" label="User" fullWidth />
							)}
						/>
					</Grid>
					<Grid item xs={6}>
						<Button variant="contained" fullWidth type="submit" sx={{ height: '57px' }}>Submit</Button>
					</Grid>
					<Grid item xs={6}>
						<Button variant="outlined" fullWidth onClick={close} sx={{ height: '57px' }}>Close</Button>
					</Grid>
				</Grid>
			</Box>
		</ModalWrapper>
	)
}

export default Filter;