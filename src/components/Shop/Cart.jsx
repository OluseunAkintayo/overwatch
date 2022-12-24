import React from 'react';
import { ModalWrapper, ModalBody, ModalTitle } from '../../lib';
import { DataGrid } from '@mui/x-data-grid';
import styled from 'styled-components';
import { Box, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material';
import { Delete } from '@mui/icons-material';

const HeaderText = ({ text }) => (
	<Typography variant="h5" sx={{ fontSize: 12, fontWeight: 600 }}>{text}</Typography>
)

const Cart = ({ open, close, cart, setCart }) => {
	console.log(cart);

	const removeItem = id => {
		const newCart = cart.filter(item => item.id !== id);
		setCart(newCart);
		localStorage.setItem('cart', JSON.stringify(newCart));
		console.log(newCart);
	}
	const [total, setTotal] = React.useState(0);

	React.useEffect(() => {
		let cartTotal = 0;
		cart.forEach( item => {
			cartTotal += Number(item.pricing.retail) * item.added;
		});
		setTotal(cartTotal);
	}, [cart, setCart, removeItem]);

	return (
		<ModalWrapper open={open} close={close}  modalClass={'cartModal'}>
			<ModalBody>
				<ModalTitle title="Checkout" />
					<TableContainer component={Box} sx={{ width: '100%', maxHeight: '40vh' }}>
						<Table stickyHeader size="small">
							<TableHead>
								<TableRow>
									<TableCell><HeaderText text="Product Name" /></TableCell>
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
										<TableCell align="center">{item.added}</TableCell>
										<TableCell align="right">{Number(item.pricing.cost).toLocaleString()}</TableCell>
										<TableCell align="right">{(Number(item.pricing.cost) * item.added).toLocaleString()}</TableCell>
										<TableCell align="center">
											<Tooltip placement='left' title='Remove'>
												<Delete onClick={() => removeItem(item.id)} sx={{ color: 'rgba(0, 0, 0, 0.54)', cursor: 'pointer' }} />
											</Tooltip>
										</TableCell>
									</TableRow>
								))}
								<TableRow>
									{/* <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
									<TableCell sx={{ fontWeight: 700 }}></TableCell>
									<TableCell sx={{ fontWeight: 700 }}></TableCell>
									<TableCell sx={{ fontWeight: 700 }}></TableCell>
									<TableCell sx={{ fontWeight: 700 }}></TableCell> */}
								</TableRow>
							</TableBody>
						</Table>
					</TableContainer>
					<Grid container spacing={3} sx={{ marginTop: '0.1rem' }} alignItems="center">
						<Grid item xs={6}>
							<Typography>Payment Method</Typography>
							<TextField size="small" select variant='outlined' fullWidth defaultValue="Cash">
								<MenuItem value="Cash">Cash</MenuItem>
								<MenuItem value="Transfer">Bank Transfer</MenuItem>
								<MenuItem value="POS">POS</MenuItem>
							</TextField>
						</Grid>
						<Grid item xs={6}></Grid>
						<Grid item xs={3}>
							<Typography variant="h5">Total</Typography>
						</Grid>
						<Grid item xs={6}>
							{total.toLocaleString()}
						</Grid>
					</Grid>
			</ModalBody>
		</ModalWrapper>
	)
}

export default Cart;