import React from 'react';
import { ModalBody } from '../../lib';
import { Autocomplete, Box, Button, Grid, IconButton, TextField, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useQueries } from '@tanstack/react-query';
import styled from '@emotion/styled';
import { Add, Delete } from '@mui/icons-material';
import ProductsModal from './ProductsModal';


const ProductsTable = styled.div`
	height: 50vh;
`;

const NewSupply = () => {
	const [productModal, setProductModal] = React.useState(false);
	const [supply, setSupply] = React.useState({
		supplier: '', invoiceNumber: '', supplyDate: dayjs().format("YYYY-MM-DD"), products: []
	});

	const getProducts = async () => {
		try {
			const res = await axios.get("products");
			if(res.status === 200) {
				return res.data;
			}
		} catch (error) {
			console.error({error});
			throw error;
		}
	}

	const getSuppliers = async () => {
		try {
			const res = await axios.get("suppliers");
			if(res.status === 200) {
				return res.data;
			}
		} catch (error) {
			console.error({error});
			throw error;
		}
	}

	const [products, suppliers] = useQueries({
		queries: [
			{
				queryKey: ['products'],
				queryFn: () => getProducts(),
				keepPreviousData: true,
				staleTime: 300000,
				// refetchInterval: 600000
			},
			{
				queryKey: ['suppliers'],
				queryFn: () => getSuppliers(),
				keepPreviousData: true,
				staleTime: 300000,
				// refetchInterval: 600000
			},
		]
	});

	const cols = [
		{ field: 'name', headerName: 'Product Name', width: 250 },
		{
			field: 'quantity', headerName: 'Quantity', width: 70,
			renderCell: (params) => {
				return <TextField defaultValue={params.row.quantity} />
			}
		},
		{ field: 'cost', headerName: 'Cost Price', width: 120 },
		{ field: 'totalCost', headerName: 'Total Cost', width: 120 },
		{ field: 'expiryDate', headerName: 'Exp Date', width: 120 },
		{
			field: 'action',
			headerName: 'Action',
			width: 70,
			sortable: false,
			renderCell: (params) => {
				return <IconButton onClick={() => console.log(params.row)}><Delete /></IconButton>
			}
		}
	];

	return (
			<ModalBody>
				<Typography variant="h3">New Supply</Typography>
				<Box sx={{ height: '0.1px', backgroundColor: 'rgba(0, 0, 0, 0.87)', margin: '0.5rem 0' }} />
				<Box component="form" sx={{ margin: '2rem 0' }}>
					<Grid container spacing={4}>
						<Grid item xs={12} sm={6} md={4}>
							<Autocomplete
								disablePortal
								id="suppliers-select-box"
								options={suppliers.data}
								getOptionLabel={(option) => option.companyName}
								sx={{ width: '100%' }}
								renderInput={(params) => <TextField {...params} label="Select Supplier" name="supplier" />}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<TextField
								label="Invoice Number" fullWidth
								value={supply.invoiceNumber}
								onChange={e => setSupply({ ...supply, invoiceNumber: e.target.value })}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<TextField
								label="Supply Date" fullWidth
								value={supply.supplyDate}
								onChange={e => setSupply({ ...supply, supplyDate: e.target.value })}
								type="date"
								InputLabelProps={{ shrink: true }}
							/>
						</Grid>
						<Grid item xs={12}>
							<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
								<Typography variant="h5">Products</Typography>
								<Button variant="outlined" onClick={() => setProductModal(true)}><Add /> Add Product</Button>
							</Box>
							<ProductsTable>
								<DataGrid
									columns={cols}
									rows={supply.products}
								/>
							</ProductsTable>
						</Grid>
						<Grid item xs={6}>
							<Button type="button" variant="contained" fullWidth >Submit</Button>
						</Grid>
						<Grid item xs={6}>
							<Button type="button" variant="outlined" fullWidth>Close</Button>
						</Grid>
					</Grid>
				</Box>
				<React.Fragment>
					{
						productModal && <ProductsModal open={productModal} close={() => setProductModal(false)} products={products} setSupply={setSupply} supply={supply} />
					}
				</React.Fragment>
			</ModalBody>
	)
}

export default NewSupply;