import React from 'react';
import styled from '@emotion/styled';
import { Button, CircularProgress, TextField, Box, Grid, IconButton, Typography } from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { setDeleteCategoryModal, setEditCategoryModal, setNewCategoryModal } from '../../../store/modals';
import { connect } from 'react-redux';
import NewCategory from './NewCategory';
import EditCategory from './EditCategory';
import DeleteSubcategory from './DeleteCategory';

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

interface CategoryComponentProps {
	newCategoryModal: boolean;
	editCategoryModal: boolean;
	deleteCategoryModal: boolean;
	openNewCategory: () => void;
	closeNewCategory: () => void;
	openEditCategory: () => void;
	closeEditCategory: () => void;
	openDeleteCategory: () => void;
	closeDeleteCategory: () => void;
}

interface CategoryProps {
	_id: string;
	name: string;
	description: string;
	isActive: boolean;
	createdAt: string;
	modifiedAt: string;
}

const Category = (props: CategoryComponentProps) => {
	const { newCategoryModal, editCategoryModal, deleteCategoryModal, openNewCategory, closeNewCategory, openEditCategory, closeEditCategory, openDeleteCategory, closeDeleteCategory } = props;
	const [error, setError] = React.useState<any>(null);
	const queryFn = async () => {
		const token = localStorage.getItem('token') as string | null;
		const config = {
			url: 'products/categories',
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
			console.log(error);
		}
	}
	const { isLoading, data, refetch } = useQuery({
		queryKey: ['categories'], queryFn: queryFn,
		cacheTime: 300000, networkMode: 'offlineFirst'
	});

	const [category, setCategory] = React.useState<CategoryProps | null>(null);
	const openEditModal = (val: CategoryProps) => {
		setCategory(val);
		openEditCategory();	
	}

	const openDeleteModal = (val: CategoryProps) => {
		setCategory(val);
		openDeleteCategory();
	}

	const cols: GridColDef[] = [
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
	
	React.useEffect((): () => void => {
		document.title = "Categories: Overwatch";
		return () => null;
	}, []);

	const [search, setSearch] = React.useState<string>('');
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);

	return (
		<React.Fragment>
			<Container>
				<TopBar>
					<TextField variant='outlined' size="small" label="Search" name="search" onChange={handleChange} />
					<Button variant='outlined' onClick={openNewCategory}><Add /><span>New</span></Button>
				</TopBar>
				<DataTable>
					{
						isLoading ?
						<Box sx={{ height: '50vh', display: 'grid', placeItems: 'center' }}><CircularProgress /></Box>
						: (
							error ? 
							<Box sx={{ height: '50vh', display: 'grid', placeItems: 'center' }}>
								<Typography variant='h5' color="error">{error?.response?.data?.message.includes('token') ? error.response.status + ': ' + error.response.data.message : 'Error loading product categories'}</Typography>
							</Box> :
							data &&
							<DataGrid
								columns={cols}
								getRowId={(row) => row._id}
								rows={
									[...data.data].sort((a, b) => a.name?.localeCompare(b.name))
									.filter(item => !item.markedForDeletion)
									.filter(item => {
										if(search.trim() === "") {
											return item;
										} else if(item.name.toLowerCase().includes(search.trim().toLowerCase())) {
											return item;
										} else if(item.description.toLowerCase().includes(search.trim().toLowerCase())) {
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
					newCategoryModal && <NewCategory open={newCategoryModal} close={closeNewCategory} refetch={refetch} />
				}
				{
					editCategoryModal && <EditCategory open={editCategoryModal} close={() => { closeEditCategory(); setCategory(null) }} refetch={refetch} category={category} />
				}
				{
					deleteCategoryModal && <DeleteSubcategory open={deleteCategoryModal} close={() => { closeDeleteCategory(); setCategory(null); }} refetch={refetch} id={category?._id} name={category?.name} />
				}
			</React.Fragment>
		</React.Fragment>
	)
}

const mapStateToProps = (state: { modals: { newCategoryModal: any; editCategoryModal: any; deleteCategoryModal: any; }; }) => {
	return {
		newCategoryModal: state.modals.newCategoryModal,
		editCategoryModal: state.modals.editCategoryModal,
		deleteCategoryModal: state.modals.deleteCategoryModal
	}
}

const mapDispatchToProps = (dispatch: (arg0: { payload: any; type: "modals/setNewCategoryModal" | "modals/setEditCategoryModal" | "modals/setDeleteCategoryModal"; }) => any) => {
	return {
		openNewCategory: () => dispatch(setNewCategoryModal(true)),
		closeNewCategory: () => dispatch(setNewCategoryModal(false)),
		openEditCategory: () => dispatch(setEditCategoryModal(true)),
		closeEditCategory: () => dispatch(setEditCategoryModal(false)),
		openDeleteCategory: () => dispatch(setDeleteCategoryModal(true)),
		closeDeleteCategory: () => dispatch(setDeleteCategoryModal(false))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Category);