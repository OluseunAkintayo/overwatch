import React from 'react';
import { Box, Button, CircularProgress, Grid, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material';
import dayjs from 'dayjs';
import styled from '@emotion/styled';
import { Add, Delete } from '@mui/icons-material';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import ProductsModal from './ProductsModal';
import { customAlphabet } from 'nanoid';
import { useNavigate } from 'react-router-dom';
import { TitleBar } from '../../../lib';

const Container = styled.div`
	padding-top: 1rem;
`;
const ProductsTable = styled.div`
	height: calc(100vh - 430px);
`;

const Totals = styled.div`
	padding: 0.5rem;
	border: 1px solid rgba(224, 224, 224, 1);
	border-radius: 0.25rem;
	margin-top: 0.5rem;
`;

const HeaderText = ({ text }: { text: string }) => (
	<Typography variant="h5" sx={{ fontSize: 12, fontWeight: 600 }}>{text}</Typography>
)

const CellText = ({ text }: { text: string | number }) => (
	<Typography sx={{ fontSize: 12, fontWeight: 300 }}>{text}</Typography>
)

interface ProductProps {
	_id: string;
  name: string;
  productCode: string;
  pricing: {
    cost: number;
    retail: number;
  };
  inStock?: boolean;
  quantity: number;
}

interface NewSupplyProps {
	transactionDate?: string;
	invoiceNumber: string | number;
	products: ProductProps[];
	supplyDate: string;
	vendor: string;
	amount: number;
}

const Supply = () => {
	const navigate = useNavigate();
	const nanoId = customAlphabet('1234567890QWERTYUIOPASDFGHJKLZXCVBNM', 10);
	const userString = localStorage.getItem('user');
	let parsedUser: { _id: string } = userString && JSON.parse(userString);
	const token: string | null = localStorage.getItem('token');
	const [fetchError, setFetchError] = React.useState<any>(null);
	const fetchFn = async (URL: string): Promise<any> => {
		const config = {
			url: URL,
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Headers': '*',
				'Authorization': `Bearer ${token}`
			}
		}
		try {
			const response = await axios.request(config);
			if(response.status === 200) return response.data;
		} catch (error) {
			setFetchError(error);
		}
	}

	React.useEffect(() => {
		fetchError?.response?.status && navigate("/auth/login");
	}, [fetchError])

	const { data: products, refetch } = useQuery({
		queryKey: ['products'],
		queryFn: () => fetchFn('products'),
		keepPreviousData: true, cacheTime: 600000, staleTime: 600000,
		networkMode: 'offlineFirst'
	});

	React.useEffect((): () => void => {
		refetch();
		document.title = "Supply: Overwatch";
		return () => null;
	}, []);

	const [productModal, setProductModal] = React.useState<boolean>(false);

	const [supply, setSupply] = React.useState<NewSupplyProps>({ vendor: '', invoiceNumber: '', supplyDate: dayjs().format("YYYY-MM-DD"), products: [], amount: 0 });
	const removeItem = (id: string) => {
		const filteredProducts = supply.products.filter(item => item._id !== id);
		setSupply({ ...supply, products: filteredProducts });
	}

	const [error, setError] = React.useState<{ supplierError: string | null, invoiceError: string | null, productsError?: string | null }>({ supplierError: null, invoiceError: null });
	const [loading, setLoading] = React.useState<boolean>(false);

	const submit = async () => {
		setLoading(true);
		const { invoiceNumber, supplyDate, amount, vendor } = supply;
		const payload = {
			transactionDate: new Date().toISOString(),
			transactionId: nanoId(),
			userId: parsedUser._id,
			invoiceNumber,
			products: supply.products?.map((item) => { return { productId: item._id, name: item.name, cost: Number(item.pricing.cost), quantity: item.quantity } }),
			supplyDate,
			transactionTotal: amount,
			transactionType: "supply",
			other: {
				vendor
			}
		}

		const config = {
			url: 'store/new-supply',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Headers': '*',
				'Authorization': `Bearer ${token}`
			},
			data: payload
		}

		if(supply.vendor.trim().length === 0) {
			setError({ supplierError: 'Supplier is required', invoiceError: null });
			setLoading(false);
		} else if(supply.invoiceNumber.toString().trim().length === 0) {
			setError({ supplierError: null, invoiceError: "Invoice Number is required" });
			setLoading(false);
		} else if(supply.products.length === 0) {
			setError({ supplierError: null, invoiceError: null, productsError: "At least one product should be added" });
			setLoading(false);
		} else {
			setError({ supplierError: null, invoiceError: null, productsError: null });
			try {
				const response = await axios.request(config);
				if(response.status === 201 && response.data.status === 1) {
					setTimeout(() => {
						setLoading(false);
						toast.success("Supply completed");
						// window.location.reload();
						setSupply({ vendor: '', invoiceNumber: '', supplyDate: dayjs().format("YYYY-MM-DD"), products: [], amount: 0 });
					}, 2000)
				} else {
					setLoading(false);
					toast.error("Unable to complete supply at this time.")
				}
			} catch (error: any) {
				setLoading(false);
				console.log(error);
				toast.error("Server error.")
			}
		}
	};

	React.useEffect(() => {
		let totals = 0;
		supply.products.forEach(item => {
			totals += item.quantity * Number(item.pricing.cost)
		});
		setSupply({ ...supply, amount: totals });
	}, [supply.products]);

	return (
		<React.Fragment>
			<TitleBar text="New Supply" />
			<Container>
				<Box>
					<Grid container spacing={4}>
						<Grid item xs={12} sm={6} md={4}>
							<TextField
								size="small"
								label="Vendor" fullWidth
								value={supply.vendor}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSupply({ ...supply, vendor: e.target.value })}
							/>
							{ error?.supplierError && <p className='errorText'>{error.supplierError}</p> }
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<TextField
								size="small"
								label="Invoice Number" fullWidth
								value={supply.invoiceNumber}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSupply({ ...supply, invoiceNumber: e.target.value })}
							/>
							{ error?.invoiceError && <p className='errorText'>{error.invoiceError}</p> }
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<TextField
								size="small"
								label="Supply Date" fullWidth
								value={supply.supplyDate}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSupply({ ...supply, supplyDate: e.target.value })}
								type="date"
								InputLabelProps={{ shrink: true }}
							/>
						</Grid>
						<Grid item xs={12}>
							<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
								<Typography variant="h6">Products</Typography>
								<Button variant="outlined" onClick={() => setProductModal(true)}><Add /> Add Product</Button>
							</Box>
							<ProductsTable>
								<TableContainer component={Box} sx={{ width: '100%', height: 'calc(100vh - 430px)' }}>
									<Table stickyHeader size="small">
										<TableHead>
											<TableRow>
												<TableCell sx={{ paddingLeft: 0 }} align="left"><HeaderText text="Product Name" /></TableCell>
												<TableCell align="center"><HeaderText text="Quantity" /></TableCell>
												<TableCell align="right"><HeaderText text="Unit Cost" /></TableCell>
												<TableCell align="right"><HeaderText text="Total Cost" /></TableCell>
												<TableCell align="center"><HeaderText text="" /></TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{ error?.productsError && <span className='errorText'>{error.productsError}</span> }
											{
												supply.products?.map(item => (
													<TableRow key={item._id} sx={{ '&:hover': { backgroundColor: 'rgba(0,0,0,0.07)', cursor: 'pointer' } }}>
														<TableCell sx={{ paddingLeft: 0 }}><CellText text={item.name} /></TableCell>
														<TableCell align="center"><CellText text={item.quantity} /></TableCell>
														<TableCell align="right">{Number(item.pricing.cost).toLocaleString()}</TableCell>
														<TableCell align="right">{(Number(item.pricing.cost) * item.quantity).toLocaleString()}</TableCell>
														<TableCell align="center">
															<Tooltip title="Remove item" placement='left'>
																<IconButton size="small" onClick={() => removeItem(item._id)}><Delete /></IconButton>
															</Tooltip>
														</TableCell>
													</TableRow>
												))
											}
										</TableBody>
									</Table>
								</TableContainer>
							</ProductsTable>
							<Totals>
								<Typography variant='h6'>Total - {supply.amount.toLocaleString()}</Typography>
							</Totals>
						</Grid>
						<Grid item xs={12}>
							<Button sx={{ height: '2.5rem', width: '10rem' }} disabled={loading} onClick={submit} type="submit" variant="contained">
								{ loading ?<CircularProgress size="1rem" /> : 'Submit' }
							</Button>
						</Grid>
					</Grid>
				</Box>
				<React.Fragment>
					{ productModal && <ProductsModal open={productModal} close={() => setProductModal(false)} products={products.data} setSupply={setSupply} supply={supply} refetch={refetch} /> }
				</React.Fragment>
			</Container>
		</React.Fragment>
	)
}

export default Supply;
