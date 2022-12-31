import React from 'react';
import styled from 'styled-components';
import { Button, CircularProgress, TextField, Box, Grid, IconButton, Typography, Menu, MenuItem } from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import NewProduct from './NewProduct';
import EditProduct from './EditProduct';
import DeleteProduct from './DeleteProduct';
import NewBrand from '../Brands/NewBrand';
import NewCategory from '../Category/NewCategory';
import { DataGrid } from '@mui/x-data-grid';
import { useGetProductsQuery } from '../../../redux/api/Products';
import { useGetBrandsQuery } from '../../../redux/api/Brands';
import { useGetCateoriesQuery, useGetSubcateoriesQuery } from '../../../redux/api/Categories';
import { TitleBar } from '../../../lib';

const Container = styled.div`
	padding: 1rem;
`;
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

const Products = () => {
	const [deleteModal, setDeleteModal] = React.useState(false);
	const [newProductModal, setNewProductModal] = React.useState(false);
	const [newBrandModal, setNewBrandModal] = React.useState(false);
	const [newCategoryModal, setNewCategoryModal] = React.useState(false);
	// new items menu
	const [menu, setMenu] = React.useState(null);
  const openMenu = (event) => setMenu(event.currentTarget);
  const closeMenu = (event) => setMenu(null);
  const itemStyle = { fontFamily: "'Mulish', sans-serif" };
	
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
		document.title = "Products: Overwatch";
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
			<TitleBar text="Products" />
			<Container>
				<TopBar>
					<TextField autoFocus variant='outlined' size="small" label="Search" name="search" onChange={handleChange} />
					<Box className='action-menu'>
						<Button variant='outlined' sx={{ width: '92px' }} onClick={openMenu}>
							<Add />
							<span>New</span>
						</Button>
						<Menu
                sx={{ mt: '36px' }}
                keepMounted
                anchorEl={menu}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(menu)}
                onClose={closeMenu}
              >
                <MenuItem sx={itemStyle} onClick={() => { setNewProductModal(true); closeMenu(); }}>Product</MenuItem>
                <MenuItem sx={itemStyle} onClick={() => { setNewBrandModal(true); closeMenu(); }}>Brand</MenuItem>
                <MenuItem sx={itemStyle} onClick={() => { setNewCategoryModal(true); closeMenu(); }}>Category</MenuItem>
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