import React from 'react';
import axios from 'axios';
import NewBrand from './NewBrand';
import EditBrand from './EditBrand';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { Add, Delete, Edit } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { setDeleteBrandModal, setEditBrandModal, setNewBrandModal } from '../../../store/modals';
import { Button, CircularProgress, TextField, Box, Grid, IconButton, Typography } from '@mui/material';
import DeleteBrand from './DeleteBrand';

interface BrandComponentProps {
	newBrandModal: boolean;
	editBrandModal: boolean;
	deleteBrandModal: boolean;
	openNewBrandModal: () => void;
	closeNewBrandModal: () => void;
	openEditBrandModal: () => void;
	closeEditBrandModal: () => void;
	openDeleteBrandModal: () => void;
	closeDeleteBrandModal: () => void;
}

interface BrandProps {
	_id?: string;
	name: string
	manufacturer: string;
	isActive: boolean | undefined;
	modifiedAt?: string;
	createdAt?: string;
}

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

const Brands = (props: BrandComponentProps) => {
	const { newBrandModal, editBrandModal, deleteBrandModal, openNewBrandModal, closeNewBrandModal, openEditBrandModal, closeEditBrandModal, openDeleteBrandModal, closeDeleteBrandModal } = props;
	const token: string | null = localStorage.getItem('token');
	const [error, setError] = React.useState<any>(null);
	const fetchFn = async (): Promise<any> => {
		const config = {
			url: 'products/brands',
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
	const { data: brands, refetch, isLoading } = useQuery({
		queryKey: ['brands'], queryFn: fetchFn,
		keepPreviousData: true, cacheTime: 600000, staleTime: 600000,
		networkMode: 'offlineFirst'
	});

	const [brand, setBrand] = React.useState<BrandProps | null>(null);
	const openEditModal = (val: BrandProps) => {
		setBrand(val);
		openEditBrandModal();
	}

	const openDeleteModal = (val: BrandProps) => {
		setBrand(val);
		openDeleteBrandModal();
	}

	const cols: GridColDef[] = [
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
	
	React.useEffect((): () => void => {
		document.title = "Brands: Overwatch";
		return () => null;
	}, []);

	const [search, setSearch] = React.useState('');
	const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => setSearch(e.target.value);

	return (
		<React.Fragment>
			<Container>
				<TopBar>
					<TextField variant='outlined' size="small" label="Search" name="search" onChange={handleChange} />
					<Button variant='outlined' onClick={openNewBrandModal}>
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
							error ? 
							<Box sx={{ height: '50vh', display: 'grid', placeItems: 'center' }}>
								<Typography variant='h5' color="error">{error?.status} Error</Typography>
							</Box> :
							brands &&
							<DataGrid
								columns={cols}
								getRowId={(row) => row._id}
								rows={
									[...brands.data].sort((a, b) => a.name?.localeCompare(b.name))
									.filter(item => !item.markedForDeletion)
									.filter(item => {
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
					newBrandModal && <NewBrand open={newBrandModal} close={closeNewBrandModal} refetch={refetch} />
				}
				{
					editBrandModal && <EditBrand open={editBrandModal} close={() => { closeEditBrandModal(); setBrand(null); }} refetch={refetch} brand={brand} />
				}
				{
					deleteBrandModal && <DeleteBrand open={deleteBrandModal} close={() => { closeDeleteBrandModal(); setBrand(null) }} refetch={refetch} id={brand?._id} brandName={brand?.name} />
				}
			</React.Fragment>
		</React.Fragment>
	)
}

const mapStateToProps = (state: { modals: { newBrandModal: any; editBrandModal: any; deleteBrandModal: any; }; }) => {
	return {
		newBrandModal: state.modals.newBrandModal,
		editBrandModal: state.modals.editBrandModal,
		deleteBrandModal: state.modals.deleteBrandModal,
	}
}

const mapDispatchToProps = (dispatch: (arg0: { payload: any; type: "modals/setNewBrandModal" | "modals/setEditBrandModal" | "modals/setDeleteBrandModal"; }) => any) => {
	return {
		openNewBrandModal: () => dispatch(setNewBrandModal(true)),
		closeNewBrandModal: () => dispatch(setNewBrandModal(false)),
		openEditBrandModal: () => dispatch(setEditBrandModal(true)),
		closeEditBrandModal: () => dispatch(setEditBrandModal(false)),
		openDeleteBrandModal: () => dispatch(setDeleteBrandModal(true)),
		closeDeleteBrandModal: () => dispatch(setDeleteBrandModal(false))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Brands);