import React from 'react';
import styled from '@emotion/styled';
import { Button, CircularProgress, TextField, Box, Grid, IconButton, Typography } from '@mui/material';
import { ShoppingCartCheckoutOutlined } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import Cart from './Cart';
import { useGetProductsQuery } from '../../redux/api/Products';
import { toast } from 'react-toastify';

const Container = styled.div`
	padding: 1rem;
`;
const TopBar = styled.div`
	display: flex;
	justify-content: space-between;
	gap: 1rem;
`;
const DataTable = styled.div`
	height: calc(100vh - 180px);
	margin-top: 2rem;
`;

const Shop = () => {
	const [cartModal, setCartModal] = React.useState(false);

	const { isLoading, isError, error, data, refetch } = useGetProductsQuery();

	const [cart, setCart] = React.useState(() => localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []);

	let tempCart = [];
	cart.forEach(item => tempCart.push(item));

	const addToCart = (product) => {
		const cartItem = tempCart.find(item => item.id === product.id);
		const cartItemIndex = tempCart.indexOf(cartItem);

		if(!cartItem) {
			if(product.quantity === 0) {
				toast.error("Item unavailable");
			} else {
				let addedItem = { ...product, added: 1 };
				tempCart = [...cart, addedItem];
				setCart(tempCart);
			}
		} else if(cartItem) {
			if(cartItem.added === cartItem.quantity) {
				toast.error("Item quantity cannot be exceeded");
			} else if(cartItem.added < cartItem.quantity) {
				const newItem = { ...cartItem, added: cartItem.added + 1 };
				tempCart[cartItemIndex] = newItem;
				setCart(tempCart);
			}
		}
	}

	const cols = [
		{ field: 'productCode', headerName: 'Product Code' },
		{ field: 'name', headerName: 'Product Name', width: 250 },
		{ 
			field: 'quantity', headerName: 'Quantity', width: 120,
		},
		{ field: 'category', headerName: 'Product Category', width: 120 },
		{
			field: 'action',
			headerName: 'Action',
			width: 70,
			sortable: false,
			renderCell: (params) => {
				return <Button onClick={() => addToCart(params.row)}>add</Button>
			}
		}
	]
	
	React.useEffect(() => {
		document.title = "Shop: Overwatch";
		return () => null;
	}, []);

	const [search, setSearch] = React.useState('');
	const handleChange = e => setSearch(e.target.value);

	return (
		<React.Fragment>
			<Container>
				<TopBar>
					<TextField variant='outlined' label="Search" name="search" onChange={handleChange} />
					<Button variant='outlined' onClick={() => setCartModal(true)}>
						<ShoppingCartCheckoutOutlined />
						<span style={{ marginLeft: '0.25rem' }}>checkout</span>
					</Button>
				</TopBar>
				<DataTable>
					{
						isLoading ? <Box sx={{ height: '50vh', display: 'grid', placeItems: 'center' }}><CircularProgress /></Box>
						: (
							isError ? <Box sx={{ height: '50vh', display: 'grid', placeItems: 'center' }}><Typography variant="h5" color="error">Error {error?.status}: Loading products failed</Typography></Box> :
							<DataGrid
								columns={cols}
								rows={
									[...data].filter(item => item.quantity)
										.sort((a, b) => a.name.localeCompare(b.name)).filter(item => {
										if(search.trim() === "") {
											return item;
										} else if(item.name.toLowerCase().includes(search.trim().toLowerCase())) {
											return item;
										} else if(item.productCode.toLowerCase().includes(search.trim().toLowerCase())) {
											return item;
										} else if(item.brand.toLowerCase().includes(search.trim().toLowerCase())) {
											return item;
										}
									})
								}
							/>
						)
					}
				</DataTable>
			</Container>
			<React.Fragment>
				{
					cartModal && <Cart open={cartModal} close={() => setCartModal(false)} refetch={refetch} cart={cart} />
				}
			</React.Fragment>
		</React.Fragment>
	)
}

export default Shop;