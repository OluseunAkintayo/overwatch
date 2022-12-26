import React from 'react';
import { ModalTitle, ModalWrapper } from '../../lib';
import { DataGrid } from '@mui/x-data-grid';
import { Box, CircularProgress, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { Add } from '@mui/icons-material';
import dayjs from 'dayjs';
import ItemModal from './ItemModal';

const DataTable = styled.div`
	height: 30vh;
	margin: 2rem 0;
`;

const HeaderText = ({ text }) => (
	<Typography variant="h5" sx={{ fontSize: 12, fontWeight: 600 }}>{text}</Typography>
)

const ProductsModal = ({ open, close, products, setSupply, supply }) => {
	const [search, setSearch] = React.useState("");
	const [item, setItem] = React.useState({});
	const [itemModal, setItemModal] = React.useState(false);
	const cols = [
		{ field: 'productCode', headerName: 'Product Code', width: 100 },
		{ field: 'name', headerName: 'Product Name', width: 250,
			renderCell: (params) => <span>{params.row.name}</span>
		},
		{
			field: 'costPrice', headerName: 'Cost', width: 120,
			renderCell: (params) => {
				return <span onDoubleClick={() => console.log(params.row)}>{Number(params.row?.pricing?.cost).toLocaleString()}</span>
			}
		},
		{
			field: 'action',
			headerName: 'Action',
			width: 120,
			sortable: false,
			renderCell: (params) => {
				return <Tooltip title="Add Item" placement='left'><IconButton onClick={() => addProduct(params.row)}><Add /></IconButton></Tooltip>
			}
		}
	];

	const addProduct = (product) => {
		setItem(product);
		setItemModal(true);
	}

	return (
		<ModalWrapper open={open} close={close}  modalClass={'newProductModal'}>
			<ModalTitle title="Select Product" />
			<TextField label="Search" size="small" value={search} onChange={e => setSearch(e.target.value)} />
			<DataTable>
				<TableContainer component={Box} sx={{ width: '100%', maxHeight: '30vh' }}>
					<Table stickyHeader size="small">
						<TableHead>
							<TableRow>
								<TableCell sx={{ width: '10rem' }}><HeaderText text="Product Code" /></TableCell>
								<TableCell align="left"><HeaderText text="Product Name" /></TableCell>
								<TableCell align="center"><HeaderText text="Quantity" /></TableCell>
								<TableCell align="right"><HeaderText text="Cost" /></TableCell>
								{/* <TableCell align="center"><HeaderText text="Action" /></TableCell> */}
							</TableRow>
						</TableHead>
						<TableBody>
							{
								[...products]
								.sort((a, b) => a.name?.localeCompare(b.name))
								.filter(item => {
									if(search.trim() === "") {
										return item;
									} else if(item.name.toLowerCase().includes(search.trim().toLowerCase())) {
										return item;
									} else if(item.productCode.toString().toLowerCase().includes(search.trim().toLowerCase())) {
										return item;
									}
								})
								.map(item => (
									<TableRow key={item._id} onDoubleClick={() => addProduct(item)} sx={{ '&:hover': { background: 'rgba(0, 0, 0, 0.1)', cursor: 'pointer' } }}>
										<TableCell>{item.productCode}</TableCell>
										<TableCell>{item.name}</TableCell>
										<TableCell align="center">{item.quantity}</TableCell>
										<TableCell align="right">{Number(item.pricing.cost).toLocaleString()}</TableCell>
									</TableRow>
								))
							}
						</TableBody>
					</Table>
				</TableContainer>
				{/* <DataGrid
					columns={cols}
					getRowId={row => row._id}
					rows={
						[...products].sort((a, b) => a.name?.localeCompare(b.name)).filter(item => {
							if(search.trim() === "") {
								return item;
							} else if(item.name.toLowerCase().includes(search.trim().toLowerCase())) {
								return item;
							} else if(item.productCode.toString().toLowerCase().includes(search.trim().toLowerCase())) {
								return item;
							}
						})
					}
				/> */}
			</DataTable>
			<React.Fragment>
				{ itemModal && <ItemModal open={itemModal} close={() => setItemModal()} closeParent={close} item={item} supply={supply} setSupply={setSupply} /> }
			</React.Fragment>
		</ModalWrapper>
	)
}

export default ProductsModal;