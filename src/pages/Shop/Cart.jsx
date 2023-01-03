import React from 'react';
import { ModalWrapper, ModalBody, ModalTitle } from '../../lib';
import { Box, Button, Grid, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useNewOrderMutation } from '../../redux/api/Transactions';
import { toast } from 'react-toastify';
import { customAlphabet } from 'nanoid';

const HeaderText = ({ text }) => (
	<Typography variant="h5" sx={{ fontSize: 12, fontWeight: 600 }}>{text}</Typography>
)

const Cart = ({ open, close, cart, setCart, refetch }) => {
	const [newOrder, { isLoading, isError, error}] = useNewOrderMutation();

	const removeItem = id => {
		const newCart = cart.filter(item => item._id !== id);
		setCart(newCart);
		localStorage.setItem('cart', JSON.stringify(newCart));
	}
	const [total, setTotal] = React.useState(0);

	React.useEffect(() => {
		let cartTotal = 0;
		cart.forEach( item => {
			cartTotal += Number(item.pricing.retail) * item.orderQty;
		});
		setTotal(cartTotal);
	}, [cart, setCart, removeItem]);

	// form
	const [paymentMode, setPaymentMode] = React.useState('cash');
	const [bank, setBank] = React.useState('');
	const [referenceNumber, setReferenceNumber] = React.useState('');
	const [amountTendered, setAmountTendered] = React.useState(0);
	const [balance, setBalance] = React.useState(0);
	const handlePaymentChange = e => setPaymentMode(e.target.value);
	const [customer, setCustomer] = React.useState('');

	const nanoidI = customAlphabet('1234567890QWERTYUIO-PASDFGHJKLZXCVBNM', 10);
	const transactionId = nanoidI();
	const submit = async (e) => {
		e.preventDefault();
		const formData = {
			transactionId,
			products: cart,
			transactionTotal: total,
			paymentMode,
			bank,
			amountTendered: Number(amountTendered),
			balance,
			customerName: customer.trim() === '' ? 'Customer' : customer,
			referenceNumber,
			transactionDate: new Date().toISOString()
		}
		
		try {
			const response = await newOrder(formData);
			if(response.data) {
				toast.success("Transaction completed!");
				setCart([]);
				localStorage.setItem('cart', JSON.stringify([]));
				refetch();
				close();
			} else {
				toast.error(response.error?.data?.message);
			}
		} catch (error) {
			toast.error("500 server error");
		}
	}

	const disableBtn = () => {
		if(paymentMode === "cash" && total > amountTendered) {
			return true;
		}
		if(paymentMode === "card" && (referenceNumber.trim() === '' || bank.trim() === '')) {
			return true;
		}
		if(paymentMode === "transfer" && (referenceNumber.trim() === '' || bank.trim() === '')) {
			return true;
		}
	}

	React.useEffect(() => {
		if(amountTendered > total) {
			setBalance(amountTendered - total);
		} else if(amountTendered <= total || amountTendered === 0) {
			setBalance(0);
		}
	}, [total, amountTendered]);

	return (
		<ModalWrapper open={open} close={close}  modalClass={'cartModal'}>
			<ModalBody>
				<ModalTitle title="Checkout" />
				<form onSubmit={submit}>
					<TableContainer component={Box} sx={{ width: '100%', height: '30vh', border: '1px solid rgba(0, 0, 0, 0.3)', borderRadius: '0.25rem' }}>
						<Table stickyHeader size="small">
							<TableHead>
								<TableRow>
									<TableCell sx={{ padding: '1rem' }}><HeaderText text="Product Name" /></TableCell>
									<TableCell align="center"><HeaderText text="Quantity" /></TableCell>
									<TableCell align="right"><HeaderText text="Cost" /></TableCell>
									<TableCell align="right"><HeaderText text="Item Total" /></TableCell>
									<TableCell align="center"><HeaderText text="Action" /></TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{cart.map(item => (
									<TableRow key={item._id}>
										<TableCell>{item.name}</TableCell>
										<TableCell align="center">{item.orderQty}</TableCell>
										<TableCell align="right">{Number(item.pricing.retail).toLocaleString()}</TableCell>
										<TableCell align="right">{(Number(item.pricing.retail) * item.orderQty).toLocaleString()}</TableCell>
										<TableCell align="center">
											<Tooltip placement='left' title='Remove'>
												<Delete onClick={() => removeItem(item._id)} sx={{ color: 'rgba(0, 0, 0, 0.54)', cursor: 'pointer' }} />
											</Tooltip>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
					<Box sx={{ margin: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
						<Typography variant="h6">Total -</Typography>
						<Typography variant="h6">{total.toLocaleString()}</Typography>
					</Box>
					<Grid container columnSpacing={2} rowSpacing={3} sx={{ marginTop: '0.25rem' }} alignItems="center">
						<Grid item xs={12}>
							<TextField size="small" name="customer" value={customer} onChange={e => setCustomer(e.target.value)} fullWidth label="Customer" />
						</Grid>
						<Grid item xs={4}>
							<TextField select fullWidth label="Payment Method" value={paymentMode} onChange={handlePaymentChange} size="small">
								<MenuItem value="cash">Cash</MenuItem>
								<MenuItem value="card">Card</MenuItem>
								<MenuItem value="transfer">Transfer</MenuItem>
							</TextField>
						</Grid>
						<React.Fragment>
							{
								paymentMode === "cash" &&
								<Grid item xs={8}>
									<Grid container spacing={3}>
										<Grid item xs={6}>
											<TextField size="small" name="amountTendered" label="Amount Tendered" autoFocus fullWidth value={amountTendered} onChange={e => setAmountTendered(e.target.value)} />
										</Grid>
										<Grid item xs={6}>
											<TextField size="small" name="change" label="Change" fullWidth value={balance.toLocaleString()} disabled />
										</Grid>
									</Grid>
								</Grid>
							}
						</React.Fragment>
						<React.Fragment>
							{
								(paymentMode === "card" || paymentMode === "transfer") &&
								<Grid item xs={8}>
									<Grid container spacing={3}>
										<Grid item xs={6}>
											<TextField size="small" name="bank" label="Issuer / Bank" fullWidth value={bank} onChange={e => setBank(e.target.value)} />
										</Grid>
										<Grid item xs={6}>
											<TextField size="small" name="referenceNumber" label="Reference Number" fullWidth value={referenceNumber} onChange={e => setReferenceNumber(e.target.value)} />
										</Grid>
									</Grid>
								</Grid>
							}
						</React.Fragment>
						<Grid item xs={12}>
							<Grid container spacing={3}>
								<Grid item xs={6}>
									<Button disabled={disableBtn()} type="submit" variant="contained" fullWidth sx={{ height: '3rem' }}>Submit</Button>
								</Grid>
								<Grid item xs={6}>
									<Button type="button" variant="outlined" fullWidth sx={{ height: '3rem' }} onClick={close}>close</Button>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</form>
			</ModalBody>
		</ModalWrapper>
	)
}

export default Cart;