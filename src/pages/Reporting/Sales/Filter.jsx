import { Box, Button, Grid, MenuItem, TextField } from '@mui/material';
import React from 'react';
import { ModalTitle, ModalWrapper } from '../../../lib';
import dayjs from 'dayjs';
import { DesktopDatePicker, DesktopDateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const Filter = ({ open, close, refetch, data, setTransactions }) => {
	const [date, setDate] = React.useState({ start: dayjs().startOf('d'), end: dayjs().endOf('d')});
	const [paymentMode, setPaymentMode] = React.useState('');

	const handleStartDateChange = (value) => {
		setDate({ ...date, start: value });
	}
	const handleEndDateChange = (value) => {
		setDate({ ...date, end: value });
	}

	const submit = (e) => {
		e.preventDefault();
		let filteredData = [];
		filteredData = data.filter(item => dayjs(item.transactionDate) >= date.start && date.end >= dayjs(item.transactionDate));
		if(paymentMode.trim().length > 1) {
			filteredData = filteredData.filter(item => item.paymentMode === paymentMode);
		}
		setTransactions(filteredData);
		close();
	}

	React.useEffect(() => {
		refetch();
	}, []);

	return (
		<ModalWrapper open={open} close={close}  modalClass={'newProductModal'}>
			<ModalTitle title="Filter Report" />
			<Box component="form" onSubmit={submit}>
				<Grid container spacing={3}>
					<Grid item xs={6}>
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DesktopDateTimePicker
								label="Start Date"
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
								value={date.end}
								onChange={handleEndDateChange}
								renderInput={(params) => <TextField {...params} fullWidth />}
							/>
						</LocalizationProvider>
					</Grid>
					<Grid item xs={6}>
						<TextField select fullWidth label="Payment Mode" value={paymentMode} onChange={e => setPaymentMode(e.target.value)}>
							<MenuItem value="">All</MenuItem>
							<MenuItem value="cash">Cash</MenuItem>
							<MenuItem value="card">Card</MenuItem>
							<MenuItem value="transfer">Transfer</MenuItem>
						</TextField>
					</Grid>
					<Grid item xs={6}>
						<TextField select fullWidth label="Cashier" value={paymentMode} onChange={e => setPaymentMode(e.target.value)}>
							<MenuItem value="">All</MenuItem>
							<MenuItem value="cash">Cash</MenuItem>
							<MenuItem value="card">Card</MenuItem>
							<MenuItem value="transfer">Transfer</MenuItem>
						</TextField>
					</Grid>
					<Grid item xs={6}>
						<Button variant="contained" fullWidth type="submit">Submit</Button>
					</Grid>
					<Grid item xs={6}>
						<Button variant="outlined" fullWidth onClick={close}>Close</Button>
					</Grid>
				</Grid>
			</Box>
		</ModalWrapper>
	)
}

export default Filter;