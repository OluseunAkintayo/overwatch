import React from 'react';
import { ModalTitle, ModalWrapper } from '../../lib';
import { DataGrid } from '@mui/x-data-grid';
import { Box, CircularProgress, IconButton, TextField, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { Add } from '@mui/icons-material';

const DataTable = styled.div`
	height: 30vh;
	margin: 2rem 0;
`;

const ProductsModal = ({ open, close, products, setSupply, supply }) => {
	const [search, setSearch] = React.useState("");
	const cols = [
		{ field: 'productCode', headerName: 'Product Code', width: 100 },
		{ field: 'name', headerName: 'Product Name', width: 250 },
		{
			field: 'costPrice', headerName: 'Cost', width: 120,
			renderCell: (params) => {
				return <>{Number(params.row.pricing.cost).toLocaleString()}</>
			}
		},
		{
			field: 'action',
			headerName: 'Action',
			width: 70,
			sortable: false,
			renderCell: (params) => {
				return <IconButton onClick={() => addProduct(params.row)}><Add /></IconButton>
			}
		}
	];

	const addProduct = product => {
		const newItem = {...product, quantity: 1, cost: Number(product.pricing.cost), totalCost: product.quantity ? Number(product.pricing.cost) * product.quantity : Number(product.pricing.cost), expiryDate: 'IND' };
		setSupply({
			...supply,
			products: [...supply.products, newItem]
		});
		close();
	}

	return (
		<ModalWrapper open={open} close={close}  modalClass={'newProductModal'}>
			<ModalTitle title="Select Product" />
			<>
				<TextField label="Search" value={search} onChange={e => setSearch(e.target.value)} />
				<DataTable>
					{
						products.isLoading ?
						<Box sx={{ height: '20vh', display: 'grid', placeItems: 'center' }}><CircularProgress size="5rem" /></Box> :
						(
							products.error ? <Box sx={{ height: '50vh', display: 'grid', placeItems: 'center' }}><Typography color="error">Error loading products<br />{products?.error?.stack}</Typography></Box> :
							<DataGrid
								columns={cols}
								rows={
									products?.data?.sort((a, b) => a.name.localeCompare(b.name)).filter(item => {
										if(search.trim() === "") {
											return item;
										} else if(item.name.toLowerCase().includes(search.trim().toLowerCase())) {
											return item;
										} else if(item.productCode.toLowerCase().includes(search.trim().toLowerCase())) {
											return item;
										}
									})
								}
							/>
						)
					}
				</DataTable>
			</>
		</ModalWrapper>
	)
}

export default ProductsModal;