import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Button, CircularProgress, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { Add, ShoppingCartCheckoutOutlined } from '@mui/icons-material';
import { setCartModal } from '../../store/modals';
import { connect } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cart from './Cart';
import { DataGrid, GridColDef } from '@mui/x-data-grid';


interface ShopProps {
	cartModal: boolean;
	openCartModal: () => void;
	closeCartModal: () => void;
}

interface TitleProps {
	text: string;
}

interface ProductProps {
	_id: string;
	name: string;
	productCode: string;
	description: string;
	brand: string;
	category: string;
	subcategory: string;
	pricing: {
		cost: string;
		retail: string | number;
	},
	inStock: boolean;
	isActive: boolean
	imgUrl?: string;
	expiryDate?: string;
	createdAt: string;
	modifiedAt?: string;
	quantity: number;
	orderQty: number;
}

const Shop = (props: ShopProps) => {
	const { cartModal, openCartModal, closeCartModal } = props;

	const [loading, setLoading] = React.useState<boolean>(false);
	const [error, setError] = React.useState<any>(null);
	const [item, setItem] = React.useState<ProductProps | null>(null);
	

	const token: string | null = localStorage.getItem('token');
	const fetchFn = async (): Promise<any> => {
		// setLoading(true);
		const config = {
			url: 'products',
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Headers': '*',
				'Authorization': `Bearer ${token}`
			}
		}
	
		try {
			const response = await axios.request(config);
			if(response.status === 200 || response.status === 201) return response.data;
		} catch (error) {
			console.log(error);
			setError(error);
		}
	}

	const { data, refetch } = useQuery({
		queryKey: ['shopProducts'],
		queryFn: fetchFn,
		keepPreviousData: true, cacheTime: 600000, staleTime: 600000,
		networkMode: 'offlineFirst'
	});

	// search
	const [search, setSearch] = React.useState<string>('');
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);

	const ColTitle = (props: TitleProps) => {
		return <Typography variant="h6" fontSize="1rem">{props.text}</Typography>
	}
	const CellContent = (props: TitleProps) => {
		return <Typography>{props.text}</Typography>
	}

	// page title
	React.useEffect((): () => void => {
		document.title = "Shop: Overwatch";
		return () => null;
	}, []);

	// cart management
	let cartStorage = localStorage.getItem('cart');
	const [cart, setCart] = React.useState<Array<ProductProps>>(() => cartStorage ? JSON.parse(cartStorage) : []);
	let tempCart: Array<ProductProps> | null = [];
	cart.forEach(item => tempCart?.push(item));
	
	const addToCart = (product: ProductProps) => {
		const cartItem = tempCart?.find((item: { _id: string; }) => item._id === product._id);
		const cartItemIndex = cartItem && tempCart?.indexOf(cartItem);

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
			} else if(cartItem.orderQty < cartItem.quantity && cartItemIndex && tempCart) {
				const newItem = { ...cartItem, orderQty: cartItem.orderQty + 1 };
				tempCart[cartItemIndex] = newItem;
				setCart(tempCart);
				localStorage.setItem('cart', JSON.stringify(tempCart));
			}
		}
		// selectProduct(product);
	}

	const selectProduct = (e: React.MouseEvent<HTMLElement>, val: ProductProps) => {
		setItem(val);
		console.log(val);
		if(e.detail === 2) {
			addToCart(val);
		}
	};

	// cart item count
	const [count, setCount] = React.useState<number>(0);
	React.useEffect(() => {
		let totalCount = 0;
		cart.forEach(item => {
			totalCount += item?.orderQty;
		});
		setCount(totalCount);
	}, [cart]);

	// refetch on first render
	React.useEffect(() => { refetch() }, []);

	const columns: GridColDef[] = [
		{ field: 'name', headerName: 'Product Name', width: 250 },
		{  field: 'quantity', headerName: 'Quantity', width: 120 },
		{ 
			field: 'price', headerName: 'Price', width: 100,
			renderCell: params => Number(params.row.pricing.retail).toLocaleString()
		},
		{ field: 'category', headerName: 'Product Category', width: 200 },
		{
			field: 'action',
			headerName: 'Action',
			width: 70,
			sortable: false,
			renderCell: (params) => {
				return <IconButton onClick={() => addToCart(params.row)}><Add /></IconButton>
			}
		}
	]


	return (
		<Box>
			<TopBar>
				<TextField size="small" variant='outlined' label="Search" name="search" value={search} onChange={handleChange} autoFocus />
				<Box onClick={openCartModal} sx={{ position: 'relative', left: -15, cursor: 'pointer' }}>
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
			<Box sx={{ height: 'calc(100vh - 149px)' }}>
				{ 
					data ?
					<Box sx={{ height: '100%', mt: 2 }}>
						<DataGrid
							getRowId={(row) => row._id}
							columns={columns}
							rows={
								[...data?.data].filter((products: ProductProps) => products.quantity)
								.filter((product: ProductProps) => product.isActive)
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
					</Box>
					: (
						loading ? <Box sx={{ height: '100%', display: 'grid', placeItems: 'center' }}><CircularProgress size="5rem" /></Box>
						:
						error && <Box sx={{ height: '100%', display: 'grid', placeItems: 'center' }}><Typography variant='h5' color='error'>Error {error?.response?.status}: {JSON.stringify(error?.response?.data?.message)}</Typography></Box>
					)
				}
			</Box>
			<React.Fragment>
				{ cartModal && <Cart open={cartModal} close={closeCartModal} cart={cart} setCart={setCart} refetch={refetch} /> }
			</React.Fragment>
		</Box>
	)
}

const mapStateToProps = (state: any) => {
	return {
		cartModal: state.modals.cartModal
	}
}

const mapDispatchToProps = (dispatch: (arg0: { payload: any; type: "modals/setCartModal"; }) => any) => {
	return {
		openCartModal: () => dispatch(setCartModal(true)),
		closeCartModal: () => dispatch(setCartModal(false)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Shop);

const TopBar = styled.div`
	display: flex;
	justify-content: space-between;
	gap: 1rem;
	width: 100%;
`;