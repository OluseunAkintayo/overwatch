import React from 'react';
import { Autocomplete, Box, Button, CircularProgress, Grid, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { DataGrid } from '@mui/x-data-grid';
import styled from '@emotion/styled';
import { Add, Delete } from '@mui/icons-material';
import { TitleBar } from '../../lib';
import ProductsModal from './ProductsModal';
import { useGetProductsQuery, useEditProductMutation } from '../../redux/api/Products';
import { useGetVendorsQuery, useNewSupplyMutation } from '../../redux/api/Store';
import { toast } from 'react-toastify';

const Container = styled.div`
	padding: 1rem;
`;
const ProductsTable = styled.div`
	height: 50vh;
	.MuiDataGrid-footerContainer {
		display: none;
	}
`;

const Totals = styled.div`
	padding: 0.5rem;
	border: 1px solid rgba(224, 224, 224, 1);
	/* margin-bottom: 2rem; */
	border-radius: 0.25rem;
	margin-top: 0.5rem;
`;

const HeaderText = ({ text }) => (
	<Typography variant="h5" sx={{ fontSize: 12, fontWeight: 600 }}>{text}</Typography>
)

const CellText = ({ text }) => (
	<Typography variant="span" sx={{ fontSize: 12, fontWeight: 300 }}>{text}</Typography>
)

const NewSupply = () => {
	const { data: products } = useGetProductsQuery();
	const { data: vendors } = useGetVendorsQuery();
	const [productModal, setProductModal] = React.useState(false);

	const [invoiceTotal, setInvoiceTotal] = React.useState(0);
	const [supply, setSupply] = React.useState({
		supplier: '', invoiceNumber: '', supplyDate: dayjs().format("YYYY-MM-DD"), products: []
	});

	const [error, setError] = React.useState({
		supplierError: null, invoiceError: null
	})
	const [loading, setLoading] = React.useState(false);
	const [newSupply] = useNewSupplyMutation();

	const submit = async () => {
		setLoading(true);
		if(supply.supplier.trim().length === 0) {
			setError({ supplierError: 'Supplier is required', invoiceError: null });
			setLoading(false);
		} else if(supply.invoiceNumber.trim().length === 0) {
			setError({ supplierError: null, invoiceError: "Invoice Number is required" });
			setLoading(false);
		} else if(supply.products.length === 0) {
			setError({ supplierError: null, invoiceError: null, productsError: "At least one product should be added" });
			setLoading(false);
		} else {
			const payload = {
				vendor: supply.supplier,
				invoiceNumber: supply.invoiceNumber,
				supplyDate: supply.supplyDate,
				products: supply.products,
				total: invoiceTotal,
				createdAt: new Date().toISOString()
			}
			const response = await newSupply(payload);
			setLoading(false);
			console.log(response);
			if(response.data) {
				toast.success("Supply completed");
				setSupply({ supplier: '', invoiceNumber: '', supplyDate: dayjs().format("YYYY-MM-DD"), products: [] });
			}
		}
	};

	const removeItem = (id) => {
		const filteredProducts = supply.products.filter(item => item._id !== id);
		setSupply({ ...supply, products: filteredProducts });
	}

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
				return <IconButton onClick={() => removeItem(params.row.id)}><Delete /></IconButton>
			}
		}
	];

	React.useEffect(() => {
		let totals = 0;
		supply.products.forEach(item => {
			totals += item.quantity * Number(item.pricing.cost)
		})
		setInvoiceTotal(totals);
		setSupply({ ...supply, total: totals });
	}, [supply.products]);

	return (
		<React.Fragment>
			<TitleBar text="New Supply" />
			<Container>
				<Box>
					<Grid container spacing={4}>
						<Grid item xs={12} sm={6} md={4}>
							<Autocomplete
								disablePortal
								id="vendors-select-box"
								options={vendors?.data.filter(item => !item.markedForDeletion)}
								getOptionLabel={(option) => option.companyName}
								onInputChange={(e, val) => {
									setSupply({ ...supply, supplier: val });
								}}
								sx={{ width: '100%' }}
								renderInput={(params) => <TextField {...params} label="Select Vendor" name="vendor" />}
							/>
							{ error?.supplierError && <p className='errorText'>{error.supplierError}</p> }
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<TextField
								label="Invoice Number" fullWidth
								value={supply.invoiceNumber}
								onChange={e => setSupply({ ...supply, invoiceNumber: e.target.value })}
							/>
							{ error?.invoiceError && <p className='errorText'>{error.invoiceError}</p> }
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
								<TableContainer component={Box} sx={{ width: '100%', height: '50vh' }}>
									<Table stickyHeader size="small">
										<TableHead>
											<TableRow>
												<TableCell align="left"><HeaderText text="Product Name" /></TableCell>
												<TableCell align="center"><HeaderText text="Quantity" /></TableCell>
												<TableCell align="right"><HeaderText text="Cost" /></TableCell>
												<TableCell align="right"><HeaderText text="Total Cost" /></TableCell>
												<TableCell align="center"><HeaderText text="Expiry Date" /></TableCell>
												<TableCell align="center"><HeaderText text="Action" /></TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{ error?.productsError && <span className='errorText'>{error.productsError}</span> }
											{
												supply.products?.map(item => (
													<TableRow key={item._id}>
														<TableCell><CellText text={item.name} /></TableCell>
														<TableCell align="center"><CellText text={item.quantity} /></TableCell>
														<TableCell align="right">{Number(item.pricing.cost).toLocaleString()}</TableCell>
														<TableCell align="right">{(Number(item.pricing.cost) * item.quantity).toLocaleString()}</TableCell>
														<TableCell align="center">{item.expiryDate}</TableCell>
														<TableCell align="center">
															<Tooltip title="Remove item" placement='left'>
																<IconButton size="small" onClick={() => removeItem(item._id)}>
																	<Delete />
																</IconButton>
															</Tooltip>
														</TableCell>
													</TableRow>
												))
											}
										</TableBody>
									</Table>
								</TableContainer>
								{/* <DataGrid
									columns={cols}
									rows={supply.products}
									getRowId={row => row._id}
									experimentalFeatures={{ newEditingApi: true }}
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
								/> */}
							</ProductsTable>
							<Totals>
								<Typography variant='h6'>Total - {invoiceTotal.toLocaleString()}</Typography>
							</Totals>
						</Grid>
						<Grid item xs={12}>
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
						productModal && <ProductsModal open={productModal} close={() => setProductModal(false)} products={products.data} setSupply={setSupply} supply={supply} />
					}
				</React.Fragment>
			</Container>
		</React.Fragment>
	)
}

export default NewSupply;