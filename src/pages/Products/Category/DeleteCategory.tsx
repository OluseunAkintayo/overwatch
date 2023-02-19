import React from 'react';
import { toast } from 'react-toastify'
import { ModalWrapper, ModalTitle, ModalBody } from '../../../lib';
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import { WarningAmber } from '@mui/icons-material';
import axios from 'axios';

interface DeleteCategoryComponentProps {
	open: boolean;
	close: () => void;
	refetch: () => void;
	id: string | undefined;
	name: string | undefined;
}

const DeleteSubcategory = ({ open, close, refetch, id, name }: DeleteCategoryComponentProps) => {
	const [loading, setLoading] = React.useState<boolean>(false);

	const deleteItem = async (): Promise<void> => {
		setLoading(true);
		const token = localStorage.getItem('token');
		const config = {
			url: 'products/categories/deactivate/' + id,
			method: 'PUT',
			headers: {
				"Accept": "*",
				"Authorization": `Bearer ${token}`,
				"Content-Type": "application/json"
			}
		}
		try {
			const response = await axios.request(config);
			if(response.data) {
				toast.success("Product category deleted successfully");
				refetch();
				close();
			} else {
				toast.error("Error deleting product category");
			}
		} catch (error: any) {
			console.log(error);
			toast.error("Error" + error.response.status + ": Internal Error");
		}
	}

	return (
		<ModalWrapper open={open} close={close}  modalClass={'deleteModal'}>
			<ModalBody>
				<ModalTitle title="Delete Product Category" />
				<Grid container rowSpacing={2} marginTop="0" alignItems="flex-start">
					<Grid item xs={12}>
						<Box sx={{ textAlign: 'center' }}>
							<WarningAmber sx={{ fontSize: 96, color: 'red' }} />
							<Typography sx={{ textAlign: 'center' }} color="error">This action is irreversible</Typography>
						</Box>
					</Grid>
					<Grid item xs={12}>
						<Typography sx={{ textAlign: 'center' }} variant="h5">Sure to delete the product category <br /><span style={{ fontWeight: 700 }}>{name}</span>?</Typography>
					</Grid>
					<Grid item xs={12} marginTop={2}>
						<Grid container spacing={3}>
							<Grid item xs={6}>
								<Button type="submit" disabled={loading} sx={{ height: '2.5rem', backgroundColor: 'red' }} variant="contained" fullWidth onClick={deleteItem}>
									{ loading ? <CircularProgress /> : 'delete'	}
								</Button>
							</Grid>
							<Grid item xs={6}>
								<Button disabled={loading} type="button" onClick={close} sx={{ height: '2.5rem' }} variant="outlined" fullWidth>Close</Button>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</ModalBody>
		</ModalWrapper>
	)
}

export default DeleteSubcategory;