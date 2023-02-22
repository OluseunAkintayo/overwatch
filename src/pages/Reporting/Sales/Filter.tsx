import React, { FormEvent } from 'react';
import dayjs from 'dayjs';
import { ModalTitle, ModalWrapper } from '../../../lib';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, Button, Grid, MenuItem, TextField } from '@mui/material';
import { DesktopDateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';

interface FilterModalProps {
	open: boolean;
	close: () => void;
	refetch: () => void;
	data: TransactionProps[] | null;
	setTransactions: any;
}

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

const Filter = ({ open, close, refetch, data, setTransactions }: FilterModalProps) => {
	const [date, setDate] = React.useState({ start: dayjs().startOf('d'), end: dayjs().endOf('d')});
	const [paymentMode, setPaymentMode] = React.useState<string>('');

	const handleStartDateChange = (value: any) => {
		setDate({ ...date, start: value });
	}
	const handleEndDateChange = (value: any) => {
		setDate({ ...date, end: value });
	}

	const submit = (e: FormEvent) => {
		e.preventDefault();
		let filteredData: TransactionProps[] | undefined = [];
		filteredData = data?.filter(item => dayjs(item.transactionDate) >= date.start && date.end >= dayjs(item.transactionDate));
		if(paymentMode.trim().length > 1) {
			filteredData = filteredData?.filter(item => item.paymentMode === paymentMode);
		}
		// console.log(filteredData);
		setTransactions(filteredData);
		close();
	}

	// React.useEffect(() => {
	// 	refetch();
	// }, []);

	return (
		<ModalWrapper open={open} close={close}  modalClass={'newProductModal'}>
			<ModalTitle title="Filter Report" />
			<Box component="form" onSubmit={submit} sx={{ marginTop: 4 }}>
				<Grid container spacing={3} marginTop={2}>
					<Grid item xs={6}>
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DesktopDateTimePicker
								label="Start Date"
								disableFuture
								value={date.start}
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
								value={date.end}
								onChange={handleEndDateChange}
								renderInput={(params) => <TextField {...params} fullWidth />}
							/>
						</LocalizationProvider>
					</Grid>
					<Grid item xs={12}>
						<TextField select fullWidth label="Payment Mode" value={paymentMode} onChange={e => setPaymentMode(e.target.value)}>
							<MenuItem value="">Choose</MenuItem>
							<MenuItem value="cash">Cash</MenuItem>
							<MenuItem value="card">Card</MenuItem>
							<MenuItem value="transfer">Transfer</MenuItem>
						</TextField>
					</Grid>
					<Grid item xs={12}>
						{/* <TextField select fullWidth label="Cashier" value={paymentMode} onChange={e => setPaymentMode(e.target.value)}>
							<MenuItem value="">All</MenuItem>
							<MenuItem value="cash">Cash</MenuItem>
							<MenuItem value="card">Card</MenuItem>
							<MenuItem value="transfer">Transfer</MenuItem>
						</TextField> */}
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