import React from 'react';
import { ModalBody, ModalTitle, ModalWrapper } from '../../lib';
import { toast } from 'react-toastify';
import { Box, Button, Grid, TextField } from '@mui/material';

type Props = {
	open: boolean;
	close: () => void;
	tempCart: CartItemProps[];
	cart: CartItemProps[];
	setCart: (arg0: CartItemProps[]) => void;
	currentItem: CartItemProps | null;
}

interface CartItemProps {
  _id: string;
  name: string;
  productCode: string;
  description: string;
  brand: string;
  category: string;
  subcategory?: string;
  pricing: {
    cost: string;
    retail: string | number;
  };
  quantity: number;
  orderQty: number;
}

const AddItemModal = ({ open, close, tempCart, currentItem: product, setCart, cart }: Props) => {

	const [cartQuantity, setCartQuantity] = React.useState<number>(1);
	const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => setCartQuantity(Number(e.target.value));

	const addToCart = (e: React.FormEvent) => {
		e.preventDefault();
    const cartItem = tempCart?.find((item: { _id: string }) => item._id === product?._id);
    const cartItemIndex = cartItem && tempCart?.indexOf(cartItem);
    if (!cartItem) {
      if (product?.quantity === 0) {
        toast.error("Item unavailable");
      } else if(product?.quantity && product.quantity > 0) {
				if (cartQuantity > product.quantity) {
					toast.error("Item quantity cannot be exceeded");
				} else {
					let addedItem = { ...product, orderQty: cartQuantity };
					tempCart = [...cart, addedItem];
					setCart(tempCart);
					localStorage.setItem("cart", JSON.stringify(tempCart));
					close()
				}
      }
    } else if (cartItem) {
			if(cartQuantity > cartItem.quantity) toast.error("Cannot exceed available quantity for " + cartItem.name);
			if(cartQuantity <= cartItem.quantity && cartItemIndex) {
				const newItem = { ...cartItem, orderQty: cartQuantity };
				tempCart[cartItemIndex] = newItem;
				setCart(tempCart);
				localStorage.setItem('cart', JSON.stringify(tempCart));
				close();
			}
    }
  };

	return (
		<ModalWrapper open={open} close={close} modalClass={'addItemModal'}>
			<ModalBody>
				<ModalTitle title='Add Item' />
				<Box component="form" autoComplete="off" onSubmit={addToCart} style={{ marginTop: 28 }}>
					<Grid container columnSpacing={2} rowSpacing={3}>
						<Grid item xs={12}>
							<TextField fullWidth label="Quantity" type="number" onChange={handleQtyChange} value={cartQuantity} />
						</Grid>
						<Grid item xs={6}>
							<Button type="submit" variant="contained" fullWidth sx={{ height: '2.5rem' }}>Add item</Button>
						</Grid>
						<Grid item xs={6}>
							<Button variant="outlined" fullWidth sx={{ height: '2.5rem' }} onClick={close}>close</Button>
						</Grid>
					</Grid>
				</Box>
			</ModalBody>
		</ModalWrapper>
	)
}

export default AddItemModal