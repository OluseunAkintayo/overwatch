import React from 'react';
import styled from '@emotion/styled';
import { Button, CircularProgress, TextField, Box, Grid, IconButton, Tooltip } from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import NewSupplier from './NewSupplier';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import EditSupplier from './EditSupplier';

const Container = styled.div`
	padding: 1rem;
`;
const TopBar = styled.div`
	display: flex;
	justify-content: space-between;
	gap: 1rem;
`;
const DataTable = styled.div`
	height: calc(100vh - 180px);
	margin-top: 2rem;
`;

const Suppliers = () => {
	const [newSupplierModal, setNewSupplierModal] = React.useState(false);
	const [editSupplierModal, setEditSupplierModal] = React.useState(false);
	const [supplierData, setSupplierData] = React.useState(null);
	const viewSupplier = (val) => {
		setSupplierData(val);
		setEditSupplierModal(true);
	}

	const getSuppliers = async () => {
		try {
			const res = await axios.get("suppliers");
			if(res.status === 200) {
				return res.data;
			}
		} catch (error) {
			console.error({error});
		}
	}

	const query = useQuery({
		queryKey: ['suppliers'],
		queryFn: () => getSuppliers(),
		keepPreviousData: true,
		staleTime: 300000,
	});

	const { isLoading, data, refetch } = query;

	const cols = [
		{ field: 'companyName', headerName: 'Company Name', width: 150 },
		{ field: 'contactPerson', headerName: 'Contact Person', width: 150 },
		{ field: 'contactEmail', headerName: 'Contact Email', width: 200 },
		{ field: 'contactPhone', headerName: 'Phone Number', width: 120 },
		{
			field: 'action',
			headerName: 'Action',
			width: 80,
			sortable: false,
			renderCell: (params) => {
				return (
					<Grid container>
						<Grid item xs={6}>
							<Tooltip title="Edit Supplier" placement='top'>
								<IconButton aria-label='edit' size="small" color="danger" onClick={() => viewSupplier(params.row)}>
									<Edit />
								</IconButton>
							</Tooltip>
						</Grid>
						<Grid item xs={6}>
						<Tooltip title="Delete Supplier" placement='top'>
							<IconButton aria-label='edit' size="small">
								<Delete />
							</IconButton>
						</Tooltip>
						</Grid>
					</Grid>
				)
			}
		}
	]
	
	React.useEffect(() => {
		document.title = "Overwatch - Suppliers";
		return () => null;
	}, []);

	const [search, setSearch] = React.useState('');
	const handleChange = e => setSearch(e.target.value);

	return (
		<React.Fragment>
			<Container>
				<TopBar>
					<TextField variant='outlined' label="Search" name="search" onChange={handleChange} />
					<Button variant='outlined' onClick={() => setNewSupplierModal(true)}>
						<Add />
						<span>New Supplier</span>
					</Button>
				</TopBar>
				<DataTable>
					{
						isLoading ? <Box sx={{ height: '50vh', display: 'grid', placeItems: 'center' }}><CircularProgress /></Box> :
						<DataGrid
							columns={cols}
							rows={
								data.sort((a, b) => a.companyName.localeCompare(b.companyName)).filter(item => {
									if(search.trim() === "") {
										return item;
									} else if(item.companyName.toLowerCase().includes(search.trim().toLowerCase())) {
										return item;
									} else if(item.contactPerson.toLowerCase().includes(search.trim().toLowerCase())) {
										return item;
									} else if(item.contactEmail.toLowerCase().includes(search.trim().toLowerCase())) {
										return item;
									}
								})
							}
						/>
					}
				</DataTable>
			</Container>
			<React.Fragment>
				{
					newSupplierModal && <NewSupplier open={newSupplierModal} close={() => setNewSupplierModal(false)} refetch={refetch} />
				}
			</React.Fragment>
			<React.Fragment>
				{
					editSupplierModal && <EditSupplier open={editSupplierModal} close={() => setEditSupplierModal(false)} refetch={refetch} supplierData={supplierData} />
				}
			</React.Fragment>
		</React.Fragment>
	)
}

export default Suppliers;