import React from 'react';
import styled from 'styled-components';
import { Button, CircularProgress, TextField, Box, Grid, IconButton, Typography } from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import NewProduct from './NewProduct';
import EditProduct from './EditProduct';
import DeleteProduct from './DeleteProduct';
import NewBrand from '../Brands/NewBrand';
import NewCategory from '../Category/NewCategory';
import { DataGrid } from '@mui/x-data-grid';
import { useGetProductsQuery } from '../../../redux/api/Products';
import { useGetBrandsQuery } from '../../../redux/api/Brands';
import { useGetCateoriesQuery, useGetSubcateoriesQuery } from '../../../redux/api/Categories';;

const MenuItems = styled.div`
	position: absolute;
	display: flex;
	flex-direction: column;
	outline: ${props => props.borderWidth + " rgba(0, 128, 128, 0.5) solid"};
	margin-top: 5px;
	border-radius: 0.25rem;
	background-color: #FFFFFF;
	z-index: 10;
	right: 0;
	left: 0;
	height: ${props => props.height};
	overflow: hidden;
	transition: all ease-in-out 0.2s;
	span {
		text-align: center;
		text-transform: uppercase;
		padding: 0.25rem 0;
		cursor: pointer;
		background-color: rgba(0, 128, 128, 0.3);
		&:hover {
			background-color: rgba(0, 128, 128, 0.5);
		}
		&:nth-child(2) {
			border-top: 0.2px solid rgba(0, 128, 128, 0.5);
			border-bottom: 0.2px solid rgba(0, 128, 128, 0.5);
		}
	}
`;
const Container = styled.div`
	padding: 1rem;
	.action-menu {
		height: 33px;
		position: relative;
		width: 6rem;
	}
`;
const TopBar = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;
`;
const DataTable = styled.div`
	height: calc(100vh - 180px);
	margin-top: 2rem;
`;

const Products = () => {
	const [deleteModal, setDeleteModal] = React.useState(false);
	const [newProductModal, setNewProductModal] = React.useState(false);
	const [newBrandModal, setNewBrandModal] = React.useState(false);
	const [newCategoryModal, setNewCategoryModal] = React.useState(false);
	const [height, setHeight] = React.useState("0px");
	const [borderWidth, setBorderWidth] = React.useState("0px");
	const toggle = () => {
		setHeight(height === "0px" ? "88px" : "0px");
		setBorderWidth(borderWidth === "0px" ? "1px" : "0px");
	}
	
	const response = useGetProductsQuery();
	const { isLoading, data, refetch, isError, error } = response;
	const products = data?.data;
	
	const [product, setProduct] = React.useState(null);
	const[editModal, setEditModal] = React.useState(false);
	const openEditModal = (val) => {
		setProduct(val);
		setEditModal(true);	
	}
	const openDeleteModal = (val) => {
		setProduct(val);
		setDeleteModal(true);	
	}

	const cols = [
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
							<IconButton aria-label='edit' size="small" onClick={() => openEditModal(params.row)}>
								<Edit />
							</IconButton>
						</Grid>
						<Grid item xs={6}>
							<IconButton aria-label='edit' size="small" onClick={() => openDeleteModal(params.row)}>
								<Delete />
							</IconButton>
						</Grid>
					</Grid>
				)
			}
		}
	];
	
	React.useEffect(() => {
		document.title = "Products";
		return () => null;
	}, []);

	const [search, setSearch] = React.useState('');
	const handleChange = e => setSearch(e.target.value);

	const { data: brands, refetch: brandRefetch } = useGetBrandsQuery();
	const { data: categories, refetch: categoriesRefetch } = useGetCateoriesQuery();
	const { data: subcategories } = useGetSubcateoriesQuery();

	const brandsData = brands?.data?.map(item => {
		return {
			name: item.name,
			value: item.name,
			id: item._id
		}
	}).sort((a, b) => a.name.localeCompare(b.name));

	const categoriesData = categories?.data?.map(item => {
		return {
			name: item.name,
			value: item.name,
			id: item._id
		}
	}).sort((a, b) => a.name.localeCompare(b.name));

	const subcategoriesData = subcategories?.data?.map(item => {
		return {
			name: item.name,
			value: item.name,
			id: item._id
		}
	}).sort((a, b) => a.name.localeCompare(b.name));

	return (
		<React.Fragment>
			<Container>
				<TopBar>
					<TextField autoFocus variant='outlined' size="small" label="Search" name="search" onChange={handleChange} />
					<Box className='action-menu'>
						<Button className='action-btn' variant='outlined' sx={{ width: '100%' }} onClick={toggle}>
							<Add />
							<span>New</span>
						</Button>
						<MenuItems height={height} borderWidth={borderWidth}>
							<span onClick={() => { setNewProductModal(true); setHeight("0px"); setBorderWidth("0px") }}>Product</span>
							<span onClick={() => { setNewBrandModal(true); setHeight("0px"); setBorderWidth("0px"); }}>Brand</span>
							<span onClick={() =>  { setNewCategoryModal(true); setHeight("0px"); setBorderWidth("0px"); }}>Category</span>
						</MenuItems>
					</Box>
				</TopBar>
				<DataTable>
					{
						isLoading ?
						<Box sx={{ height: '50vh', display: 'grid', placeItems: 'center' }}>
							<CircularProgress />
						</Box> :
						(
							isError ? 
							<Box sx={{ height: '50vh', display: 'grid', placeItems: 'center' }}>
								<Typography variant='h5' color="error">{error?.status} Error</Typography>
							</Box> :
							products &&
							<DataGrid
							columns={cols}
							getRowId={row => row._id}
							rows={
								[...products].sort((a, b) => a.name?.localeCompare(b.name)).filter(item => {
									if(search.trim() === "") {
										return item;
									} else if(item.name?.toLowerCase().includes(search.trim().toLowerCase())) {
										return item;
									} else if(item.brand?.toLowerCase().includes(search.trim().toLowerCase())) {
										return item;
									}
								})
							}
						/>
						)
					}
				</DataTable>
			</Container>
			<React.Fragment>
				{
					newProductModal &&
					<NewProduct open={newProductModal} close={() => setNewProductModal(false)} refetch={refetch} brandsData={brandsData} categoriesData={categoriesData} subcategoriesData={subcategoriesData} />
				}
				{
					editModal && <EditProduct open={editModal} close={() => setEditModal(false)} refetch={refetch} product={product} brandsData={brandsData} categoriesData={categoriesData} subcategoriesData={subcategoriesData} />
				}
				{
					deleteModal && <DeleteProduct open={deleteModal} close={() => setDeleteModal(false)} refetch={refetch} product={product} />
				}
				{
					newBrandModal &&
					<NewBrand open={newBrandModal} close={() => setNewBrandModal(false)} refetch={brandRefetch} />
				}
				{
					newCategoryModal &&
					<NewCategory open={newCategoryModal} close={() => setNewCategoryModal(false)} refetch={categoriesRefetch} />
				}
			</React.Fragment>
		</React.Fragment>
	)
}

export default Products;