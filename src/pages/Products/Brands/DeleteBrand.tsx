import React from 'react';
import { toast } from 'react-toastify';
import { ModalWrapper, ModalTitle, ModalBody } from '../../../lib';
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import { WarningAmber } from '@mui/icons-material';
import axios from 'axios';

interface DeleteBrandComponentProps {
	open: boolean;
	close: () => void;
	refetch: () => void;
	id: string | undefined;
	brandName: string | undefined;
}

const DeleteBrand = ({ open, close, refetch, id, brandName }: DeleteBrandComponentProps) => {
	const [loading, setLoading] = React.useState<boolean>(false);
	const deleteItem = async (): Promise<void> => {
		setLoading(true);
		const token: string | null = localStorage.getItem('token');
		const config = {
			url: 'products/brands/deactivate/' + id,
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Headers': '*',
				'Authorization': `Bearer ${token}`
			}
		};
	
		try {
			const response = await axios.request(config);
			if(response.status === 200 && response.data.status === 1) {
				setLoading(false);
				toast.success("Brand deleted successfully");
				refetch();
				close();
			} else {
				setLoading(false);
				toast.error("Error deleting brand");
			}
		} catch (error) {
			console.log(error);
			setLoading(false);
			toast.error("Server error");
		}
	}

	return (
		<ModalWrapper open={open} close={close}  modalClass={'deleteModal'}>
			<ModalBody>
				<ModalTitle title="Delete Brand" />
				<Grid container rowSpacing={2} marginTop="0" alignItems="flex-start">
					<Grid item xs={12}>
						<Box sx={{ textAlign: 'center' }}>
							<WarningAmber sx={{ fontSize: 96, color: 'red' }} />
							<Typography sx={{ textAlign: 'center' }} color="error">This action is irreversible</Typography>
						</Box>
					</Grid>
					<Grid item xs={12}>
						<Typography sx={{ textAlign: 'center' }} variant="h5">Sure to delete the brand<br /><span style={{ fontWeight: 700 }}>{brandName}</span>?</Typography>
					</Grid>
					<Grid item xs={12} marginTop={2}>
						<Grid container spacing={3}>
							<Grid item xs={6}>
								<Button type="submit" disabled={loading} sx={{ height: '2.5rem', backgroundColor: 'red' }} variant="contained" fullWidth onClick={deleteItem}>{ loading ? <CircularProgress /> : 'delete brand'	}</Button>
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

export default DeleteBrand;