import { Box, Button, Grid, TextField } from '@mui/material';
import React from 'react';
import { ModalTitle, ModalWrapper } from '../../../lib';

interface SelectedProductProps {
	_id: string;
  name: string;
  productCode: string;
  pricing: {
    cost: number;
    retail: number;
  };
  inStock?: boolean;
  quantity: number;
}

interface SupplyProps {
	transactionDate?: string;
	invoiceNumber: string | number;
	products: SelectedProductProps[] | any; // gotta get back to this..., it's throwing errors at setSupply({ ...supply, products: [...supply.products, newProduct] }) in addItem()
	supplyDate: string;
	vendor: string;
	amount: number;
}

interface ItemModalProps {
	open: boolean;
	close: () => void;
	closeParent: () => void;
	setSupply: (arg0: SupplyProps) => void;
	supply: SupplyProps;
	item: SelectedProductProps | null;
}

const ItemModal = ({ open, close, closeParent, item, setSupply, supply }: ItemModalProps) => {
	const [product, setProduct] = React.useState<{ qty: number, cost: number | undefined}>({ qty: 1, cost: item?.pricing.cost });
	const handleChange = (prop: string) => (e: React.ChangeEvent<HTMLInputElement>) => setProduct({ ...product, [prop]: Number(e.target.value) });
	
	const addItem = (e: React.FormEvent) => {
		e.preventDefault();
		const newProduct = {
			...item, quantity: product.qty, pricing: {...item?.pricing, cost: product.cost}
		}
		setSupply({ ...supply, products: [...supply.products, newProduct] })
		close();
		closeParent();
	};

	return (
		<ModalWrapper open={open} close={close}  modalClass={'addItemModal'}>
			<ModalTitle title={"Add Item - " + item?.name} />
			<Box sx={{ height: '2rem' }} />
			<Box component="form" onSubmit={addItem}>
				<Grid container spacing={3}>
					<Grid item xs={12}>
						<TextField fullWidth type="number" onChange={handleChange("qty")} defaultValue={product.qty} label="Quantity" />
					</Grid>
					<Grid item xs={12}>
						<TextField fullWidth onChange={handleChange("cost")} defaultValue={product.cost} label="Cost Price" />
					</Grid>
					<Grid item xs={12}>
						<TextField fullWidth disabled value={(Number(product.qty) * Number(product.cost)).toLocaleString()} label="Total Cost" />
					</Grid>
					<Grid item xs={6}>
						<Button type="submit" sx={{ height: '2.5rem' }} variant='contained' fullWidth onClick={addItem}>Add product</Button>
					</Grid>
					<Grid item xs={6}>
						<Button sx={{ height: '2.5rem' }} variant='outlined' fullWidth onClick={close}>Cancel</Button>
					</Grid>
				</Grid>
			</Box>
			<Box sx={{ height: '1rem' }} />
		</ModalWrapper>
	)
}

export default ItemModal;