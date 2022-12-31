import React from 'react';
import styled from '@emotion/styled';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add } from '@mui/icons-material';
import { useGetProductsQuery } from '../../redux/api/Products';

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

const Store = () => {
	const [search, setSearch] = React.useState('');
	const  { data: products, isLoading, error } = useGetProductsQuery();

	const cols = [
		{ field: 'productCode', headerName: 'Product Code' },
		{ field: 'name', headerName: 'Product Name', width: 300 },
		{ field: 'qty', headerName: 'Quantity', width: 100,
			renderCell: (params) => params.row.quantity ? params.row.quantity : 0
		},
		{ field: 'brand', headerName: 'Product Brand', width: 120 },
		{ field: 'category', headerName: 'Product Category', width: 120 },
	];

	React.useEffect(() => {
		document.title = "Store: Overwatch";
		return () => null;
	}, []);

	return (
		<React.Fragment>
			<Container>
				<TopBar>
					<TextField name="search" size="small" onChange={(e) => setSearch(e.target.value)} value={search} label="Search" />
					<Button variant='outlined' href="/store/new-supply">
						<Add />
						<span>New Supply</span>
					</Button>
				</TopBar>
				<DataTable>
					{
						isLoading ? <Box sx={{ height: '50vh', display: 'grid', placeItems: 'center' }}><CircularProgress /></Box> :
						(error ? <Box sx={{ height: '50vh', display: 'grid', placeItems: 'center' }}><Typography color="error"> {error.status} Error: Error loading products</Typography></Box> :
							products &&
							<DataGrid
								columns={cols}
								getRowId={(row) => row._id}
								rows={
									[...products.data].sort((a, b) => a.name?.localeCompare(b.name)).filter(item => {
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
								rowsPerPageOptions={[100]}
							/>
						)
					}
				</DataTable>
			</Container>
		</React.Fragment>
	)
}

export default Store;