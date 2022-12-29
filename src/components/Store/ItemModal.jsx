import { Box, Button, Grid, TextField } from '@mui/material';
import React from 'react';
import { ModalTitle, ModalWrapper } from '../../lib';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const ItemModal = ({ open, close, closeParent, item, setSupply, supply }) => {
	const [product, setProduct] = React.useState({
		qty: 1, cost: item.pricing.cost
	});
	const handleChange = (prop) => e => {
		setProduct({ ...product, [prop]: e.target.value });
	}
	const [expiryDate, setExpiryDate] = React.useState(dayjs().format("YYYY-MM-DD"));
	const handleDateChange = (val) => setExpiryDate(val.format("YYYY-MM-DD"));
	
	const addItem = () => {
		const newProduct = {
			...item, quantity: Number(product.qty), pricing: {...item.pricing, cost: product.cost}, expiryDate: expiryDate
		}
		setSupply({ ...supply, products: [...supply.products, newProduct] })
		close();
		closeParent();
	};

	return (
		<ModalWrapper open={open} close={close}  modalClass={'newProductModal'}>
			<ModalTitle title={"Add Item - " + item.name} />
			<Box component="form">
				<Grid container spacing={3}>
					<Grid item xs={12} sm={6}>
						<TextField fullWidth type="number" onChange={handleChange("qty")} defaultValue={product.qty} label="Quantity" />
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField fullWidth onChange={handleChange("cost")} defaultValue={Number(product.cost)} label="Cost Price" />
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField fullWidth disabled value={(Number(product.qty) * Number(product.cost)).toLocaleString()} label="Total Cost" />
					</Grid>
					<Grid item xs={12} sm={6}>
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DesktopDatePicker
								label="Expiry Date"
								value={expiryDate}
								onChange={handleDateChange}
								renderInput={(params) => <TextField {...params} fullWidth />}
							/>
						</LocalizationProvider>
					</Grid>
					<Grid item xs={6}>
						<Button sx={{ height: '2.5rem' }} variant='contained' fullWidth onClick={addItem}>Add product</Button>
					</Grid>
					<Grid item xs={6}>
						<Button sx={{ height: '2.5rem' }} variant='outlined' fullWidth onClick={close}>Cancel</Button>
					</Grid>
				</Grid>
			</Box>
		</ModalWrapper>
	)
}

export default ItemModal;