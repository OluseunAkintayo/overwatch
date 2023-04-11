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
	data: TransactionProps[] | null;
	setTransactions: any;
	users: { name: string; id: string }[];
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

interface DataProps {
	startDate: Dayjs;
	endDate: Dayjs;
	paymentMode: string;
	user: string;
}

const Filter = ({ open, close, refetch, data, setTransactions, users }: FilterModalProps) => {

	const submit = async (data: DataProps) => {
		console.log(data);
		// let filteredData: TransactionProps[] | undefined = [];
		// filteredData = data?.filter(item => dayjs(item.transactionDate) >= date.start && date.end >= dayjs(item.transactionDate));
		// if(paymentMode.trim().length > 1) {
		// 	filteredData = filteredData?.filter(item => item.paymentMode === paymentMode);
		// }
		// // console.log(filteredData);
		// setTransactions(filteredData);
		// close();
	}

	const initialValues = {
		startDate: dayjs().startOf('M'), endDate: dayjs().endOf('d'), paymentMode: '', user: ''
	}

	const validationSchema = Yup.object().shape({
		
	});

	const formik = useFormik({
		initialValues, validationSchema,
		validateOnChange: false, enableReinitialize: true,
		onSubmit: (values) => submit(values)
	});

	const { handleSubmit, handleChange, touched, errors, values, setFieldValue } = formik;

	console.log(errors);

	return (
		<ModalWrapper open={open} close={close}  modalClass={'newProductModal'}>
			<ModalTitle title="Filter Report" />
			<Box component="form" onSubmit={handleSubmit} sx={{ marginTop: 4 }}>
				<Grid container spacing={3} marginTop={2}>
					<Grid item xs={6}>
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DesktopDateTimePicker
								label="Start Date"
								disableFuture
								value={values.startDate}
								onChange={(val) => setFieldValue('startDate', val)}
								renderInput={(params) => <TextField {...params} fullWidth />}
							/>
						</LocalizationProvider>
					</Grid>
					<Grid item xs={6}>
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DesktopDateTimePicker
								label="End Date"
								disableFuture
								value={values.endDate}
								onChange={(val) => setFieldValue('endDate', val)}
								renderInput={(params) => <TextField {...params} fullWidth />}
							/>
						</LocalizationProvider>
					</Grid>
					<Grid item xs={6}>
						<TextField select fullWidth
							label="Payment Mode" value={values.paymentMode} onChange={handleChange}
							error={touched.paymentMode && Boolean(errors.paymentMode)}
							helperText={touched.paymentMode && errors.paymentMode}
						>
							<MenuItem value="">Choose</MenuItem>
							<MenuItem value="cash">Cash</MenuItem>
							<MenuItem value="card">Card</MenuItem>
							<MenuItem value="transfer">Transfer</MenuItem>
						</TextField>
					</Grid>
					<Grid item xs={6}>
						<Autocomplete
							id="user"
							options={users}
							getOptionLabel={(val) => val.name}
							onChange={(e, value) => setFieldValue("user", value?.name)}
							renderInput={(params) =>(
								<TextField
									{...params}
									name="user" label="User" fullWidth
									error={touched.user && Boolean(errors.user)}
									helperText={touched.user && errors.user}
								/>
							)}
						/>
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