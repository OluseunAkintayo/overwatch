import React from 'react';
import { toast } from 'react-toastify'
import { ModalWrapper, ModalTitle, ModalBody } from '../../../lib';
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import { useDeleteBrandMutation } from '../../../redux/api/Brands';
import { WarningAmber } from '@mui/icons-material';


const DeleteBrand = ({ open, close, refetch, brand }) => {
	const [deleteBrand, { isLoading, error }] = useDeleteBrandMutation();

	const deleteItem = async (data) => {
		try {
			const response = await deleteBrand(brand._id);
			console.log(response)
			if(response.data.status === 1) {
				toast.success("Brand deleted successfully");
				refetch();
				close();
			} else if(error) {
				toast.error("Error " + response.error.status + ": unable to delete brand");
			}
		} catch (error) {
			console.log(error);
			toast.error("Error deleting brand");
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
						</Box>
					</Grid>
					<Grid item xs={12}>
						<Typography sx={{ textAlign: 'center' }} variant="h5">Sure to delete the brand <span style={{ fontWeight: 700 }}>{brand.name}</span>?</Typography>
						<Typography sx={{ textAlign: 'center' }} color="error">This action is irreversible</Typography>
					</Grid>
					<Grid item xs={12}>
						<Grid container spacing={3}>
							<Grid item xs={6}>
								<Button disabled={isLoading} type="button" onClick={close} sx={{ height: '2.5rem' }} variant="outlined" fullWidth>Close</Button>
							</Grid>
							<Grid item xs={6}>
								<Button type="submit" disabled={isLoading} sx={{ height: '2.5rem', backgroundColor: 'red' }} variant="contained" fullWidth onClick={deleteItem}>
									{ isLoading ? <CircularProgress /> : 'delete brand'	}
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</ModalBody>
		</ModalWrapper>
	)
}

export default DeleteBrand;