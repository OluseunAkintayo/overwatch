import React, { Dispatch, SetStateAction } from 'react'
import { ModalBody, ModalTitle, ModalWrapper } from '../../lib';
import { Box, Button, CircularProgress, Grid, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { customAlphabet } from 'nanoid';
import axios from 'axios';

interface ProductProps {
	_id: string;
	name: string;
	productCode: string;
	description: string;
	brand: string;
	category: string;
	subcategory: string;
	pricing: {
		cost: string;
		retail: string | number;
	},
	inStock: boolean;
	isActive: boolean
	imgUrl?: string;
	expiryDate?: string;
	createdAt: string;
	modifiedAt?: string;
	quantity: number;
	orderQty: number;
}

interface CartProps {
	open: boolean;
	close: () => void;
	cart: ProductProps[];
	setCart: Dispatch<SetStateAction<ProductProps[]>>;
	refetch: () => void;
}

interface HeaderTextProps {
	text: string;
}

const HeaderText = ({ text }: HeaderTextProps) => (
	<Typography variant="h5" sx={{ fontSize: 12, fontWeight: 600 }}>{text}</Typography>
)

const Cart = ({ open, close, cart, setCart, refetch }: CartProps) => {
	const [loading, setLoading] = React.useState<boolean>(false);

	const removeItem = (id: string): void => {
		const newCart = cart.filter(item => item._id !== id);
		setCart(newCart);
		localStorage.setItem('cart', JSON.stringify(newCart));
	}

	const clear = (): void => {
		setCart([]);
		localStorage.setItem('cart', JSON.stringify([]));
	}

	const [total, setTotal] = React.useState<number>(0);

	// caculate cart total
	React.useEffect(() => {
		let cartTotal = 0;
		cart.forEach( item => {
			cartTotal += Number(item.pricing.retail) * item.orderQty;
		});
		setTotal(cartTotal);
	}, [cart, setCart, removeItem]);

	// form
	const [paymentMode, setPaymentMode] = React.useState<string>('cash');
	const [bank, setBank] = React.useState<string>('');
	const [referenceNumber, setReferenceNumber] = React.useState<string>('');

	// manage amount tendered and change
	const [amountTendered, setAmountTendered] = React.useState<number>(0);
	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => setAmountTendered(Number(e.target.value));
	const [balance, setBalance] = React.useState(0);
	React.useEffect(() => {
		if(amountTendered > total) {
			setBalance(amountTendered - total);
		} else if(amountTendered <= total || amountTendered === 0) {
			setBalance(0);
		}
	}, [total, amountTendered]);


	const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => setPaymentMode(e.target.value);
	const [customer, setCustomer] = React.useState('');

	const disableBtn = () => {
		if(paymentMode === "cash" && total > amountTendered) return true;
		if(paymentMode === "card" && (referenceNumber.trim() === '' || bank.trim() === '')) return true;
		if(paymentMode === "transfer" && (referenceNumber.trim() === '' || bank.trim() === '')) return true;
		if(cart.length < 1) return true;
	}

	const nanoid = customAlphabet('1234567890QWERTYUIO-PASDFGHJKLZXCVBNM', 10);
	const transactionId = nanoid();
	const token = localStorage.getItem('token');

	const submit = async (e: React.FormEvent): Promise<void> => {
		setLoading(true);
		e.preventDefault();
		const transactionData = {
			customerName: customer.trim() === '' ? 'Customer' : customer,
			transactionId,
			transactionDate: new Date().toISOString(),
			transactionTotal: total,
			products: cart,
			paymentMode,
			bank,
			amountTendered: Number(amountTendered),
			balance,
			referenceNumber,
			transactionType: 'sale'
		}

		const config = {
			url: 'transactions/new-sale',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Headers': '*',
				'Authorization': `Bearer ${token}`
			},
			data: transactionData
		}
		
		try {
			const response = await axios.request(config);
			setLoading(false);
			if(response.status === 201) {
				toast.success("Transaction completed!");
				setCart([]);
				localStorage.setItem('cart', JSON.stringify([]));
				refetch();
				close();
			} else {
				toast.error("Unable to complete transaction");
			}
		} catch (error) {
			setLoading(false);
			console.log(error);
			toast.error("500 server error: unable to complete transaction");
		}
	}

	return (
		<ModalWrapper open={open} close={close} modalClass={'cartModal'}>
			<ModalBody>
				<ModalTitle title='Checkout' />
				<form onSubmit={submit} style={{ marginTop: 24 }}>
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
					<Box sx={{ margin: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.375rem', justifyContent: 'space-between' }}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
							<Typography variant="h6">Total -</Typography>
							<Typography variant="h6">{total.toLocaleString()}</Typography>
						</Box>
						<Button variant='outlined' onClick={clear}>clear</Button>
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
											<TextField size="small" name="amountTendered" label="Amount Tendered" autoFocus fullWidth value={amountTendered} onChange={handleAmountChange} />
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
									<Button disabled={disableBtn() || loading} type="submit" variant="contained" fullWidth sx={{ height: '3rem' }}>
										{ loading ? <CircularProgress size="2rem" /> : 'submit' }
									</Button>
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