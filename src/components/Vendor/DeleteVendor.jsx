import React from 'react';
import { toast } from 'react-toastify'
import { ModalWrapper, ModalTitle, ModalBody } from '../../lib';
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import { WarningAmber } from '@mui/icons-material';
import { useDeleteVendorMutation } from '../../redux/api/Store';


const DeleteVendor = ({ open, close, refetch, vendor }) => {
	const [deleteVendor, { isLoading, isError }] = useDeleteVendorMutation();

	const deleteItem = async (data) => {
		try {
			const response = await deleteVendor(vendor._id);
			if(response.data) {
				toast.success("Vendor deleted successfully");
				refetch();
				close();
			} else if(isError || !data) {
				toast.error("Error deleting vendor");
			}
		} catch (error) {
			console.log(error);
			toast.error("Error deleting vendor");
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
						</Box>
					</Grid>
					<Grid item xs={12}>
						<Typography sx={{ textAlign: 'center' }} variant="h5">Sure to delete the product category <span style={{ fontWeight: 700 }}>{vendor.name}</span>?</Typography>
						<Typography sx={{ textAlign: 'center' }} color="error">This action is irreversible</Typography>
					</Grid>
					<Grid item xs={12}>
						<Grid container spacing={3}>
							<Grid item xs={6}>
								<Button disabled={isLoading} type="button" onClick={close} sx={{ height: '2.5rem' }} variant="outlined" fullWidth>Close</Button>
							</Grid>
							<Grid item xs={6}>
								<Button type="submit" disabled={isLoading} sx={{ height: '2.5rem', backgroundColor: 'red' }} variant="contained" fullWidth onClick={deleteItem}>
									{ isLoading ? <CircularProgress /> : 'delete'	}
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</ModalBody>
		</ModalWrapper>
	)
}

export default DeleteVendor;