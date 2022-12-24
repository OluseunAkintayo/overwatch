import React from 'react';
import styled from 'styled-components';
import { Button, CircularProgress, TextField, Box, Grid, IconButton, Typography } from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import NewCategory from './NewCategory';
import EditCategory from './EditCategory';
import DeleteCategory from './DeleteCategory';
import { DataGrid } from '@mui/x-data-grid';
import { useGetCateoriesQuery } from '../../../redux/api/Categories';

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

const Category = () => {
	const response = useGetCateoriesQuery();
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
		{ field: 'name', headerName: 'Product Category', width: 250 },
		{ field: 'description', headerName: 'Description', width: 200 },
		{ field: 'status', headerName: 'Status', width: 100,
			renderCell: (params) => <>{ params.row.isActive ? "Active" : "Inactive" }</>
		},
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
		document.title = "Categories: Overwatch";
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
							getRowId={(row) => row._id}
							rows={
								[...data.data].sort((a, b) => a.name?.localeCompare(b.name)).filter(item => {
									if(search.trim() === "") {
										return item;
									} else if(item.name.toLowerCase().includes(search.trim().toLowerCase())) {
										return item;
									} else if(item.manufacturer.toLowerCase().includes(search.trim().toLowerCase())) {
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
					newCategoryModal && <NewCategory open={newCategoryModal} close={() => setNewCategoryModal(false)} refetch={refetch} />
				}
				{
					editModal && <EditCategory open={editModal} close={() => setEditModal(false)} refetch={refetch} category={category} />
				}
				{
					deleteModal && <DeleteCategory open={deleteModal} close={() => setDeleteModal(false)} refetch={refetch} category={category} />
				}
			</React.Fragment>
		</React.Fragment>
	)
}

export default Category;