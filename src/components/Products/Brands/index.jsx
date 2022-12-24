import React from 'react';
import styled from 'styled-components';
import { Button, CircularProgress, TextField, Box, Grid, IconButton, Typography } from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import NewBrand from './NewBrand';
import EditBrand from './EditBrand';
import DeleteBrand from './DeleteBrand';
import { DataGrid } from '@mui/x-data-grid';
import { useGetBrandsQuery } from '../../../redux/api/Brands';

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

const Brands = () => {
	const response = useGetBrandsQuery();
	const { isLoading, data, refetch, isError, error } = response;
	const [newBrandModal, setNewBrandModal] = React.useState(false);
	const [brand, setBrand] = React.useState(null);
	const[deleteModal, setDeleteModal] = React.useState(false);
	const[editModal, setEditModal] = React.useState(false);
	const openEditModal = (val) => {
		setBrand(val);
		setEditModal(true);	
	}

	const openDeleteModal = val => {
		setDeleteModal(true);
		setBrand(val);
	}

	const cols = [
		{ field: 'name', headerName: 'Brand Name', width: 200 },
		{ field: 'manufacturer', headerName: 'Brand Manufacturer', width: 200 },
		{ field: 'status', headerName: 'Status', width: 100,
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
					<Button variant='outlined' onClick={() => setNewBrandModal(true)}>
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
					newBrandModal && <NewBrand open={newBrandModal} close={() => setNewBrandModal(false)} refetch={refetch} />
				}
				{
					editModal && <EditBrand open={editModal} close={() => setEditModal(false)} refetch={refetch} brand={brand} />
				}
				{
					deleteModal && <DeleteBrand open={deleteModal} close={() => setDeleteModal(false)} refetch={refetch} brand={brand} />
				}
			</React.Fragment>
		</React.Fragment>
	)
}

export default Brands;