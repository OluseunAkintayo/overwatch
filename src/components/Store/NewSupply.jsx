import React from 'react';
import { ModalBody } from '../../lib';
import { Autocomplete, Box, Button, CircularProgress, Grid, IconButton, TextField, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import { useQueries } from '@tanstack/react-query';
import styled from '@emotion/styled';
import { Add, Delete, RoomSharp } from '@mui/icons-material';
import ProductsModal from './ProductsModal';
import { toast } from 'react-toastify';
import { customAlphabet } from 'nanoid';


const ProductsTable = styled.div`
	height: 50vh;
	.MuiDataGrid-footerContainer {
		display: none;
	}
`;
const Totals = styled.div`
	padding: 0.5rem;
	border: 1px solid rgba(224, 224, 224, 1);
	margin-bottom: 2rem;
	border-radius: 0.25rem;
	margin-top: 0.5rem;
`;

const NewSupply = () => {
	const [productModal, setProductModal] = React.useState(false);
	const supplyId = customAlphabet('qwertyuiopasdfghjklzxcvbnm1234567890', 8);

	const [supply, setSupply] = React.useState({
		supplier: '', invoiceNumber: '', supplyDate: dayjs().format("YYYY-MM-DD"), products: []
	});
	const [invoiceTotal, setInvoiceTotal] = React.useState(0);
	const [preparedItems, setPreparedItems] = React.useState(null);
	const [loading, setLoading] = React.useState(false);
	const submit = () => {
		setLoading(true);
		if(supply.supplier.trim().length === 0) {
			toast.error("Supplier is required");
			setLoading(false);
		} else if(supply.invoiceNumber.trim().length === 0) {
			toast.error("Invoice Number is required");
			setLoading(false);
		} else {
			setTimeout(async () => {
				preparedItems.forEach(async (item) => {
					const config = {
						url: 'products/' + item.id,
						method: 'PUT',
						payload: item
					};
					console.log(config);
					await axios(config);
				});
			// 	const supplyPayload = {
			// 		...supply,
			// 		invoiceTotal: invoiceTotal,
			// 		id: supplyId(),
			// 		createdAt: new Date().toISOString()
			// 	}
			// 	const supplyConfig = {
			// 		url: 'supplies',
			// 		method: 'POST',
			// 		data: supplyPayload,
			// 		createdBy: ''
			// 	}
			// 	setLoading(false);
			// 	const res = await axios(supplyConfig);
			// 	if(res.status === 201) {
			// 		setSupply({ supplier: '', invoiceNumber: '', supplyDate: dayjs().format("YYYY-MM-DD"), products: [] });
			// 		setLoading(false);
			// 		toast.success("Items posted successfully");
			// 	}
			}, 2000);

		}
	}

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
		{ field: 'quantity', headerName: 'Quantity', width: 70, editable: true, type: 'number' },
		{ field: 'cost', headerName: 'Cost Price', width: 120,
			renderCell: (params) => <span>{Number(params.row.pricing.cost).toLocaleString()}</span>
		},
		{ field: 'totalCost', headerName: 'Total Cost', width: 120,
			renderCell: (params) => <span>{(Number(params.row.pricing.cost) * params.row.quantity).toLocaleString()}</span>
		},
		{ field: 'expiryDate', headerName: 'Exp Date', width: 150, editable: true, type: 'date',
			renderCell: (params) => <>{dayjs(params.row.expiryDate).format("D MMM YYYY")}</>
		},
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
				<Box sx={{ margin: '2rem 0' }}>
					<Grid container spacing={4}>
						<Grid item xs={12} sm={6} md={4}>
							<Autocomplete
								disablePortal
								id="suppliers-select-box"
								options={suppliers.data}
								getOptionLabel={(option) => option.companyName}
								onInputChange={(e, val) => {
									setSupply({ ...supply, supplier: val });
								}}
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
									experimentalFeatures={{ newEditingApi: true }}
									components={{
										Toolbar: GridToolbar
									}}
									onStateChange={(state) => {
										const rows = state.filter.visibleRowsLookup;
										let newItems = [];
										for(let [id, value] of Object.entries(rows)) {
											if(value) newItems.push(id);
										}
										const items = supply.products.filter(item => newItems.includes(item.id));
										setPreparedItems(items);
										const total = items.map(item => item.quantity * Number(item.pricing.cost)).reduce((a, b) => a + b, 0);
										setInvoiceTotal(total);
									}}
								/>
								<Totals>
									<Typography variant='h6'>Total - {invoiceTotal.toLocaleString()}</Typography>

								</Totals>
							</ProductsTable>
						</Grid>
						<Grid item xs={12} sx={{ marginTop: '2rem' }}>
							<Grid container spacing={2}>
								<Grid item xs={6} sm={3}>
									<Button sx={{ height: '2.5rem' }} disabled={loading} onClick={submit} type="submit" variant="contained" fullWidth>
										{ loading ?<CircularProgress size="1rem" /> : 'Submit' }
									</Button>
								</Grid>
								<Grid item xs={6} sm={3}>
									<Button sx={{ height: '2.5rem' }} disabled={loading} type="button" variant="outlined" fullWidth>Close</Button>
								</Grid>
							</Grid>
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