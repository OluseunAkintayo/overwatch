import React from 'react';
import { toast } from 'react-toastify'
import { ModalWrapper, ModalTitle, ModalBody } from '../../../lib';
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import { WarningAmber } from '@mui/icons-material';
import axios from 'axios';

interface ProductProps {
	_id?: string;
	productCode: string;
	name: string;
	description: string;
	brand: string;
	category: string;
	subcategory?: string;
	expiryDate: string;
	isActive: boolean;
	pricing: { cost: string | number; retail: number | string; };
	inStock: boolean;
	imgUrl: string;
	createdAt: string;
	modifiedAt: string;
	quantity: number
}

interface DeleteModalProps {
	open: boolean;
	close: () => void;
	refetch: () => void;
	product: ProductProps | null;
}


const DeleteProduct = ({ open, close, refetch, product }: DeleteModalProps) => {
	const [isLoading, setIsLoading] = React.useState(false);
	const [error, setError] = React.useState<any>(null);

	const deleteItem = async (): Promise<void> => {
		const token = localStorage.getItem('token');
		setIsLoading(true);
		const config = {
			url: 'products/delete',
			method: 'PUT',
			headers: {
				"Accept": "*",
				"Authorization": `Bearer ${token}`,
				"Content-Type": "application/json"
			},
			data: { id: product._id }
		}
		try {
			const res = await axios.request(config);
			if(res.status === 200 && res.data.status === 1) {
				toast.success(res.data.message);
				refetch();
				close();
			}
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			setError(error);
		}
	}

	return (
		<ModalWrapper open={open} close={close}  modalClass={'deleteModal'}>
			<ModalBody>
				<ModalTitle title="Delete Product" />
				<Grid container rowSpacing={2} marginTop="0" alignItems="flex-start">
					<Grid item xs={12}>
						<Box sx={{ textAlign: 'center' }}>
							<WarningAmber sx={{ fontSize: 96, color: 'red' }} />
						</Box>
					</Grid>
					<Grid item xs={12}>
						<Typography sx={{ textAlign: 'center' }} variant="h5">Sure to delete the product <span>{product.name}</span>?</Typography>
						<Typography sx={{ textAlign: 'center' }} color="error">This action is irreversible</Typography>
					</Grid>
					<Grid item xs={12}>
						<Grid container spacing={3}>
							<Grid item xs={6}>
								<Button disabled={isLoading} type="button" onClick={close} sx={{ height: '2.5rem' }} variant="outlined" fullWidth>Close</Button>
							</Grid>
							<Grid item xs={6}>
								<Button type="submit" disabled={isLoading} sx={{ height: '2.5rem', backgroundColor: 'red' }} variant="contained" fullWidth onClick={deleteItem}>
									{ isLoading ? <CircularProgress /> : 'delete product'	}
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</ModalBody>
		</ModalWrapper>
	)
}

export default DeleteProduct;