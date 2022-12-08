import React from 'react';
import styled from '@emotion/styled';
import { Button, CircularProgress, TextField, Box, Grid, IconButton } from '@mui/material';
import { Add, Delete, Edit, ShoppingCartCheckoutOutlined } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Cart from './Cart';

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

	const getProducts = async () => {
		try {
			const res = await axios.get("products");
			if(res.status === 200) {
				return res.data;
			}
		} catch (error) {
			console.error({error});
		}
	}

	const query = useQuery({
		queryKey: ['products'],
		queryFn: () => getProducts(),
		keepPreviousData: true,
		staleTime: 300000,
		// refetchInterval: 600000
	});

	const { isLoading, data, refetch } = query;

	const addToCart = (item) => {

	}

	const cols = [
		{ field: 'productCode', headerName: 'Product Code' },
		{ field: 'name', headerName: 'Product Name', width: 250 },
		{ field: 'brand', headerName: 'Product Brand', width: 120 },
		{ field: 'category', headerName: 'Product Category', width: 120 },
		{
			field: 'action',
			headerName: 'Action',
			width: 70,
			sortable: false,
			renderCell: (params) => {
				return <Button>add</Button>
			}
		}
	]
	
	React.useEffect(() => {
		document.title = "Products";
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
						isLoading ? <Box sx={{ height: '50vh', display: 'grid', placeItems: 'center' }}><CircularProgress /></Box> :
						<DataGrid
							columns={cols}
							rows={
								data.sort((a, b) => a.name.localeCompare(b.name)).filter(item => {
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
					}
				</DataTable>
			</Container>
			<React.Fragment>
				{
					cartModal && <Cart open={cartModal} close={() => setCartModal(false)} refetch={refetch} />
				}
			</React.Fragment>
		</React.Fragment>
	)
}

export default Shop;