import React from 'react';
import { ModalTitle, ModalWrapper } from '../../../lib';
import { Box, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { Add } from '@mui/icons-material';
import ItemModal from './ItemModal';

const DataTable = styled.div`
	height: 30vh;
	margin: 2rem 0;
`;

const HeaderText = ({ text }: { text: string }) => (
	<Typography variant="h5" sx={{ fontSize: 12, fontWeight: 600 }}>{text}</Typography>
)

interface SelectedProductProps {
	_id: string;
  name: string;
  productCode: string;
  pricing: {
    cost: number;
    retail: number;
  };
  inStock?: boolean;
  quantity: number;
}

interface ProductSupplyProps {
	transactionDate?: string;
	invoiceNumber: string | number;
	products: SelectedProductProps[];
	supplyDate: string;
	vendor: string;
	amount: number;
}

interface ProductsModalProps {
	open: boolean;
	close: () => void;
	refetch: () => void;
	products: SelectedProductProps[];
	setSupply: (arg0: ProductSupplyProps) => void;
	supply: ProductSupplyProps;
}

const ProductsModal = ({ open, close, products, setSupply, supply, refetch }: ProductsModalProps) => {
	const [search, setSearch] = React.useState("");
	const [item, setItem] = React.useState<SelectedProductProps | null>(null);
	const [itemModal, setItemModal] = React.useState(false);

	const addProduct = (product: SelectedProductProps) => {
		setItem(product);
		setItemModal(true);
	}

	React.useEffect(() => {
		refetch()
	}, []);

	return (
		<ModalWrapper open={open} close={close}  modalClass={'newProductModal'}>
			<ModalTitle title="Select Product" />
			<Box sx={{ height: '1rem' }} />
			<TextField label="Search" size="small" value={search} onChange={e => setSearch(e.target.value)} />
			<DataTable>
				<TableContainer component={Box} sx={{ width: '100%', maxHeight: '30vh' }}>
					<Table stickyHeader size="small">
						<TableHead>
							<TableRow>
								<TableCell align="left"><HeaderText text="Product Name" /></TableCell>
								<TableCell align="center"><HeaderText text="Current Quantity" /></TableCell>
								<TableCell align="right"><HeaderText text="Cost" /></TableCell>
								<TableCell align="center"><HeaderText text="Action" /></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{
								[...products]
								.sort((a, b) => a.name?.localeCompare(b.name))
								.filter(item => {
									if(search.trim() === "") return item;
									if(item.name.toLowerCase().includes(search.trim().toLowerCase())) return item;
								})
								.map(item => (
									<TableRow key={item._id} onDoubleClick={() => addProduct(item)} sx={{ '&:hover': { background: 'rgba(0, 0, 0, 0.1)', cursor: 'pointer' } }}>
										<TableCell>{item.name}</TableCell>
										<TableCell align="center">{item.quantity ? item.quantity : 0}</TableCell>
										<TableCell align="right">{Number(item.pricing.cost).toLocaleString()}</TableCell>
										<TableCell align="center"><IconButton size="small" sx={{ background: '#354F5220' }} onClick={() => addProduct(item)}><Add /></IconButton></TableCell>
									</TableRow>
								))
							}
						</TableBody>
					</Table>
				</TableContainer>
			</DataTable>
			<React.Fragment>
				{ itemModal && <ItemModal open={itemModal} close={() => setItemModal(false)} closeParent={close} item={item} supply={supply} setSupply={setSupply} /> }
			</React.Fragment>
		</ModalWrapper>
	)
}

export default ProductsModal;