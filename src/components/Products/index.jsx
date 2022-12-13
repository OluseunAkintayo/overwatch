import React from 'react';
import styled from '@emotion/styled';
import { Button, CircularProgress, TextField, Box, Grid, IconButton } from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import NewProduct from './NewProduct';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

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

const Products = () => {
	const [newProductModal, setNewProductModal] = React.useState(false);

	const getProducts = async () => {
		try {
			const res = await axios.get("products");
			console.log(res);
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
	console.log({ isLoading, data, refetch });

	const cols = [
		{ field: 'productCode', headerName: 'Product Code' },
		{ field: 'name', headerName: 'Product Name', width: 250 },
		{ field: 'brand', headerName: 'Product Brand', width: 120 },
		{ field: 'category', headerName: 'Product Category', width: 120 },
		{
			field: 'action',
			headerName: 'Action',
			// width: 100,
			sortable: false,
			renderCell: (params) => {
				return (
					<Grid container>
						<Grid item xs={6}>
							<IconButton aria-label='edit' size="small" color="danger">
								<Edit />
							</IconButton>
						</Grid>
						<Grid item xs={6}>
							<IconButton aria-label='edit' size="small">
								<Delete />
							</IconButton>
						</Grid>
					</Grid>
				)
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
					<Button variant='outlined' onClick={() => setNewProductModal(true)}>
						<Add />
						<span>New Product</span>
					</Button>
				</TopBar>
				<DataTable>
					{
						isLoading ? <Box sx={{ height: '50vh', display: 'grid', placeItems: 'center' }}><CircularProgress /></Box> :
						<DataGrid
							columns={cols}
							rows={
								data.sort((a, b) => a.name?.localeCompare(b.name)).filter(item => {
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
					newProductModal && <NewProduct open={newProductModal} close={() => setNewProductModal(false)} refetch={refetch} />
				}
			</React.Fragment>
		</React.Fragment>
	)
}

export default Products;