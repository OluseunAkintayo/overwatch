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

	const { isLoading, isError, error, data: products, refetch } = useGetProductsQuery();

	const [cart, setCart] = React.useState(() => localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []);

	let tempCart = [];
	cart.forEach(item => tempCart.push(item));

	const addToCart = (product) => {
		const cartItem = tempCart.find(item => item._id === product._id);
		const cartItemIndex = tempCart.indexOf(cartItem);

		if(!cartItem) {
			if(product.quantity === 0) {
				toast.error("Item unavailable");
			} else {
				let addedItem = { ...product, orderQty: 1 };
				tempCart = [...cart, addedItem];
				setCart(tempCart);
				localStorage.setItem('cart', JSON.stringify(tempCart));
			}
		} else if(cartItem) {
			if(cartItem.orderQty === cartItem.quantity) {
				toast.error("Item quantity cannot be exceeded");
			} else if(cartItem.orderQty < cartItem.quantity) {
				const newItem = { ...cartItem, orderQty: cartItem.orderQty + 1 };
				tempCart[cartItemIndex] = newItem;
				setCart(tempCart);
				localStorage.setItem('cart', JSON.stringify(tempCart));
			}
		}
	}

	const cols = [
		// { field: 'productCode', headerName: 'Product Code' },
		{ field: 'name', headerName: 'Product Name', width: 250 },
		{  field: 'quantity', headerName: 'Quantity', width: 120 },
		{ 
			field: 'price', headerName: 'Price', width: 100,
			renderCell: params => Number(params.row.pricing.retail).toLocaleString()
		},
		{ field: 'category', headerName: 'Product Category', width: 150 },
		{
			field: 'action',
			headerName: 'Action',
			width: 70,
			sortable: false,
			renderCell: (params) => {
				return <Button onClick={() => addToCart(params.row)}>add</Button>
			}
		}
	];
	
	React.useEffect(() => {
		document.title = "Shop: Overwatch";
		return () => null;
	}, []);

	const [search, setSearch] = React.useState('');
	const handleChange = e => setSearch(e.target.value);

	const [count, setCount] = React.useState(0);

	React.useEffect(() => {
		let totalCount = 0;
		cart.forEach(item => {
			totalCount += item.orderQty;
		});
		setCount(totalCount);
	}, [cart]);


	return (
		<React.Fragment>
			<Container>
				<TopBar>
					<TextField size="small" variant='outlined' label="Search" name="search" onChange={handleChange} autoFocus />
					<Box onClick={() => setCartModal(true)} sx={{ position: 'relative', left: -15, cursor: 'pointer' }}>
						<ShoppingCartCheckoutOutlined sx={{ color: 'teal' }} />
						<span style={{
							position: 'absolute',
							top: '-30%',
							right: '-80%',
							fontSize: 10,
							backgroundColor: 'teal',
							color: '#FFFFFF',
							height: '1.25rem',
							width: '1.25rem',
							borderRadius: '50%',
							display: 'grid',
							placeItems: 'center'
						}}>{count}</span>
					</Box>
				</TopBar>
				<DataTable>
					{
						isLoading ? <Box sx={{ height: '50vh', display: 'grid', placeItems: 'center' }}><CircularProgress /></Box>
						: (
							isError ? <Box sx={{ height: '50vh', display: 'grid', placeItems: 'center' }}><Typography variant="h5" color="error">Error {error?.status}: Loading products failed</Typography></Box> :
							<DataGrid
								columns={cols}
								getRowId={(row) => row._id}
								rows={
									[...products.data].filter(item => item.quantity).filter(item => item.isActive)
										.sort((a, b) => a.name.localeCompare(b.name)).filter(item => {
										if(search.trim() === "") {
											return item;
										} else if(item.name.toLowerCase().includes(search.trim().toLowerCase())) {
											return item;
										} else if(item.productCode.toString().toLowerCase().includes(search.trim().toLowerCase())) {
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
					cartModal && <Cart open={cartModal} close={() => setCartModal(false)} refetch={refetch} cart={cart} setCart={setCart} />
				}
			</React.Fragment>
		</React.Fragment>
	)
}

export default Shop;