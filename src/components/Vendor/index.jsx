import React from 'react';
import styled from '@emotion/styled';
import { Button, CircularProgress, TextField, Box, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import NewVendor from './NewVendor';
import { DataGrid } from '@mui/x-data-grid';
import EditVendor from './EditVendor';
import { useGetVendorsQuery } from '../../redux/api/Store';

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

const Vendors = () => {
	const { data: vendors, isLoading, isError, error, refetch } = useGetVendorsQuery();
	const [newVendorModal, setNewVendorModal] = React.useState(false);
	const [editVendorModal, setEditVendorModal] = React.useState(false);
	const [vendorData, setVendorData] = React.useState(null);
	const viewSupplier = (val) => {
		setVendorData(val);
		setEditVendorModal(true);
	}

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
							<Tooltip title="Edit Vendor" placement='top'>
								<IconButton aria-label='edit' size="small" color="danger" onClick={() => viewSupplier(params.row)}>
									<Edit />
								</IconButton>
							</Tooltip>
						</Grid>
						<Grid item xs={6}>
						<Tooltip title="Delete Vendor" placement='top'>
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
		document.title = "Overwatch - Vendors";
		return () => null;
	}, []);

	const [search, setSearch] = React.useState('');
	const handleChange = e => setSearch(e.target.value);

	return (
		<React.Fragment>
			<Container>
				<TopBar>
					<TextField variant='outlined' label="Search" name="search" onChange={handleChange} />
					<Button variant='outlined' onClick={() => setNewVendorModal(true)}>
						<Add />
						<span>New vendor</span>
					</Button>
				</TopBar>
				<DataTable>
					{
						isLoading ? <Box sx={{ height: '50vh', display: 'grid', placeItems: 'center' }}><CircularProgress /></Box> : (
							isError ? <Box sx={{ height: '50vh', display: 'grid', placeItems: 'center' }}><Typography color="error">Error {error?.status}: loading vendors failed</Typography></Box> :
							<DataGrid
								columns={cols}
								rows={
									[...vendors].sort((a, b) => a.companyName.localeCompare(b.companyName)).filter(item => {
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
						)
					}
				</DataTable>
			</Container>
			<React.Fragment>
				{ newVendorModal && <NewVendor open={newVendorModal} close={() => setNewVendorModal(false)} refetch={refetch} /> }
			</React.Fragment>
			<React.Fragment>
				{ editVendorModal && <EditVendor open={editVendorModal} close={() => setEditVendorModal(false)} refetch={refetch} vendor={vendorData} /> }
			</React.Fragment>
		</React.Fragment>
	)
}

export default Vendors;