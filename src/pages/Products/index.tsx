import React from 'react';
import styled from '@emotion/styled';
import { TitleBar } from '../../lib';
import { Box, Button, CircularProgress, Grid, IconButton, Menu, MenuItem, TextField, Typography } from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { setNewBrandModal, setCategoryModal, setDeleteProductModal, setEditProductModal, setProductModal } from '../../store/modals';
import { connect } from 'react-redux';
import NewProduct from './Main/NewProduct';
import EditProduct from './Main/EditProduct';
import { useNavigate } from 'react-router-dom';
import DeleteProduct from './Main/DeleteProduct';
import NewBrand from './Brands/NewBrand';


interface Props {
	newProductModal: boolean;
	editProductModal: boolean;
	deleteProductModal: boolean;
	openEditProductModal: () => void;
	closeEditProductModal: () => void;
	openDeleteProductModal: () => void;
	closeDeleteProductModal: () => void;
	openNewProductModal: () => void;
	closeNewProductModal: () => void;
	newBrandModal: boolean;
	openNewBrandModal: () => void;
	closeNewBrandModal: () => void;
	newCategoryModal: boolean;
	openNewCategoryModal: () => void;
	closeNewCategoryModal: () => void;
}

interface ProductProps {
	_id?: string;
	productCode: string;
	name: string;
	description: string;
	brand: string;
	category: string;
	subcategory?: string;
	expiryDate: string;
	isActive: boolean;
	pricing: { cost: string | number; retail: number | string; };
	inStock: boolean;
	imgUrl: string;
	createdAt: string;
	modifiedAt: string;
	quantity: number
}

const itemStyle = { fontFamily: "'Mulish', sans-serif" };

const Products = (props: Props) => {
	const { openNewProductModal, closeNewProductModal, newProductModal, editProductModal, openEditProductModal, closeEditProductModal, deleteProductModal, openDeleteProductModal, closeDeleteProductModal, openNewBrandModal, closeNewBrandModal, newBrandModal, newCategoryModal, openNewCategoryModal, closeNewCategoryModal } = props;
	const navigate = useNavigate();
	const [menu, setMenu] = React.useState<null | HTMLElement>(null);
  const openMenu = (event: React.MouseEvent<HTMLElement>) => setMenu(event.currentTarget);
  const closeMenu = () => setMenu(null);

	const token: string | null = localStorage.getItem('token');
	const [error, setError] = React.useState<any>(null);
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
			setError(error);
		}
	}

	const { data: products, refetch, isLoading } = useQuery({
		queryKey: ['products'],
		queryFn: () => fetchFn('products'),
		keepPreviousData: true, cacheTime: 600000, staleTime: 600000,
		networkMode: 'offlineFirst'
	});

	// fetch brands
	const { data: brands, refetch: brandsRefetch, isLoading: brandsLoading } = useQuery({
		queryKey: ['brands'],
		queryFn: () => fetchFn('products/brands'),
		keepPreviousData: true, cacheTime: 600000, staleTime: 600000,
		networkMode: 'offlineFirst'
	});

	// fetch categories
	const { data: categories, refetch: categoriesRefetch, isLoading: categoriesLoading } = useQuery({
		queryKey: ['categories'],
		queryFn: () => fetchFn('products/categories'),
		keepPreviousData: true, cacheTime: 600000, staleTime: 600000,
		networkMode: 'offlineFirst'
	});

	// search
	const [search, setSearch] = React.useState<string>('');
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);

	// edit product modal handler
	
	const [product, setProduct] = React.useState<ProductProps | null>(null);
	const editProduct = (item: ProductProps) => {
		setProduct(item);
		openEditProductModal();
	}

	const cols: GridColDef[] = [
		{ field: 'productCode', headerName: 'Product Code' },
		{ field: 'name', headerName: 'Product Name', width: 250 },
		{ field: 'brand', headerName: 'Product Brand', width: 120 },
		{ field: 'category', headerName: 'Product Category', width: 120 },
		{ field: 'cost', headerName: 'Cost', width: 120,
			renderCell: (params) => Number(params.row.pricing.cost).toLocaleString()
		},
		{ field: 'price', headerName: 'Price', width: 120,
			renderCell: (params) => Number(params.row.pricing.retail).toLocaleString()
		},
		{ field: 'status', headerName: 'Status', width: 120,
			renderCell: (params) => <>{params.row.isActive ? "Active" : "Inactive"}</>
		},
		{
			field: 'action',
			headerName: 'Action',
			// width: 100,
			sortable: false,
			renderCell: (params) => {
				return (
					<Grid container>
						<Grid item xs={6}>
							<IconButton aria-label='edit' size="small" onClick={() => editProduct(params.row)}>
								<Edit />
							</IconButton>
						</Grid>
						<Grid item xs={6}>
							<IconButton aria-label='edit' size="small" onClick={() => { setProduct(params.row); openDeleteProductModal(); }}>
								<Delete />
							</IconButton>
						</Grid>
					</Grid>
				)
			}
		}
	]

	React.useEffect(() => {
		if(error && error?.response.data.message.includes("expired")) navigate("/auth/login");
	}, [error]);

	React.useEffect((): () => void => {
		document.title = "Products: Overwatch"
		return () => null;
	}, []);
	
	return (
		<React.Fragment>
			<TitleBar text="Products" />
			<Container>
				<TopBar>
					<TextField autoFocus variant='outlined' size="small" label="Search" name="search" onChange={handleChange} />
					<Box className='action-menu'>
						<Button variant='outlined' onClick={openMenu}>
							<Add />
							<span>New</span>
						</Button>
						<Menu
							sx={{ mt: '36px' }}
							keepMounted
							anchorEl={menu}
							anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
							transformOrigin={{ vertical: 'top', horizontal: 'right' }}
							open={Boolean(menu)}
							onClose={closeMenu}
						>
							<MenuItem sx={itemStyle} onClick={() => { openNewProductModal(); closeMenu(); }}>Product</MenuItem>
							<MenuItem sx={itemStyle} onClick={() => { openNewBrandModal(); closeMenu(); }}>Brand</MenuItem>
							<MenuItem sx={itemStyle} onClick={() => { openNewCategoryModal(); closeMenu(); }}>Category</MenuItem>
						</Menu>
					</Box>
				</TopBar>
				<DataTable>
					{
						isLoading ?
						<Box sx={{ height: '50vh', display: 'grid', placeItems: 'center' }}>
							<CircularProgress />
						</Box> :
						(
							error ? 
							<Box sx={{ height: '50vh', display: 'grid', placeItems: 'center' }}>
								<Typography variant='h5' color="error">Error {error?.response?.status}: {error?.response?.data?.message}</Typography>
							</Box> :
							products &&
							<DataGrid
							columns={cols}
							getRowId={row => row._id}
							rows={
								[...products.data].filter(item => !item.markedForDeletion)
								.sort((a, b) => a.name?.localeCompare(b.name))
								.filter(item => {
									if(search.trim() === "") return item;
									if(item.name?.toLowerCase().includes(search.trim().toLowerCase())) return item;
									if(item.brand?.toLowerCase().includes(search.trim().toLowerCase())) return item;
								})
							}
						/>
						)
					}
				</DataTable>
			</Container>
			<React.Fragment>
				{ newProductModal && <NewProduct open={newProductModal} close={closeNewProductModal} refetch={refetch} brandsData={brands?.data} categoriesData={categories?.data} /> }
				{ editProductModal && <EditProduct open={editProductModal} close={closeEditProductModal} refetch={refetch} product={product} brandsData={brands?.data} categoriesData={categories?.data} /> }
				{ deleteProductModal && <DeleteProduct open={deleteProductModal} close={closeDeleteProductModal} refetch={refetch} product={product} /> }
				{ newBrandModal && <NewBrand open={newBrandModal} close={closeNewBrandModal} refetch={brandsRefetch} /> }
				{/*
				{
					newCategoryModal &&
					<NewCategory open={newCategoryModal} close={() => setNewCategoryModal(false)} refetch={categoriesRefetch} />
				}
			*/}
			</React.Fragment>
		</React.Fragment>
	)
}

const mapStateToProps = (state: { modals: { newProductModal: boolean; newBrandModal: boolean; newCategoryModal: boolean; editProductModal: boolean; deleteProductModal: boolean; }; }) => {
	return {
		newProductModal: state.modals.newProductModal,
		editProductModal: state.modals.editProductModal,
		deleteProductModal: state.modals.deleteProductModal,
		newBrandModal: state.modals.newBrandModal,
		newCategoryModal: state.modals.newCategoryModal,
	}
}

const mapDispatchToProps = (dispatch: (arg0: { payload: any; type: "modals/setProductModal" | "modals/setEditProductModal" | "modals/setDeleteProductModal" | "modals/setCategoryModal" | "modals/setNewBrandModal"; }) => any) => {
	return {
		openNewProductModal: () => dispatch(setProductModal(true)),
		closeNewProductModal: () => dispatch(setProductModal(false)),
		openEditProductModal: () => dispatch(setEditProductModal(true)),
		closeEditProductModal: () => dispatch(setEditProductModal(false)),
		openDeleteProductModal: () => dispatch(setDeleteProductModal(true)),
		closeDeleteProductModal: () => dispatch(setDeleteProductModal(false)),
		openNewBrandModal: () => dispatch(setNewBrandModal(true)),
		closeNewBrandModal: () => dispatch(setNewBrandModal(false)),
		openNewCategoryModal: () => dispatch(setCategoryModal(true)),
		closeNewCategoryModal: () => dispatch(setCategoryModal(false)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Products);

const Container = styled.div``;

const TopBar = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;	
`;

const DataTable = styled.div`
	height: calc(100vh - 220px);
	margin-top: 1rem;
`;