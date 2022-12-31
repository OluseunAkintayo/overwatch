import React from 'react';
import styled from 'styled-components';
import { Button, CircularProgress, TextField, Box, Grid, IconButton, Typography } from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import NewSubcategory from './NewSubcategory';
import EditSubcategory from './EditSubcategory';
import DeleteSubcategory from './DeleteSubcategory';
import { DataGrid } from '@mui/x-data-grid';
import { useGetSubcateoriesQuery, useGetCateoriesQuery } from '../../../redux/api/Categories';

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

const Subcategory = () => {
	const { data: categories } = useGetCateoriesQuery();
	const response = useGetSubcateoriesQuery();
	const { isLoading, data, refetch, isError, error } = response;
	const [newCategoryModal, setNewCategoryModal] = React.useState(false);
	const [category, setCategory] = React.useState(null);
	const[deleteModal, setDeleteModal] = React.useState(false);
	const[editModal, setEditModal] = React.useState(false);

	const openEditModal = (val) => {
		setCategory(val);
		setEditModal(true);	
	}

	const openDeleteModal = val => {
		setDeleteModal(true);
		setCategory(val);
	}

	const cols = [
		{ field: 'name', headerName: 'Product Subcategory', width: 250 },
		{ field: 'description', headerName: 'Description', width: 200 },
		{ field: 'parentCategory', headerName: 'Parent Category', width: 200 },
		{
			field: 'action',
			headerName: 'Action',
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
		document.title = "Brands: Overwatch";
		return () => null;
	}, []);

	const [search, setSearch] = React.useState('');
	const handleChange = e => setSearch(e.target.value);

	return (
		<React.Fragment>
			<Container>
				<TopBar>
					<TextField variant='outlined' label="Search" name="search" onChange={handleChange} />
					<Button variant='outlined' onClick={() => setNewCategoryModal(true)}>
						<Add />
						<span>New</span>
					</Button>
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
							data &&
							<DataGrid
							columns={cols}
							rows={
								[...data].sort((a, b) => a.name?.localeCompare(b.name)).filter(item => {
									if(search.trim() === "") {
										return item;
									} else if(item.name.toLowerCase().includes(search.trim().toLowerCase())) {
										return item;
									} else if(item.description.toLowerCase().includes(search.trim().toLowerCase())) {
										return item;
									} else if(item.parentCategory.toLowerCase().includes(search.trim().toLowerCase())) {
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
					newCategoryModal && <NewSubcategory open={newCategoryModal} close={() => setNewCategoryModal(false)} refetch={refetch} categories={categories} />
				}
				{
					editModal && <EditSubcategory open={editModal} close={() => setEditModal(false)} refetch={refetch} category={category} categories={categories} />
				}
				{
					deleteModal && <DeleteSubcategory open={deleteModal} close={() => setDeleteModal(false)} refetch={refetch} category={category} />
				}
			</React.Fragment>
		</React.Fragment>
	)
}

export default Subcategory;