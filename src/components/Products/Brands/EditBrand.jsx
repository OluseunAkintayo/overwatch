import React from 'react';
import { toast } from 'react-toastify'
import { TextInput, ModalWrapper, ModalTitle, ModalBody } from '../../../lib';
import { Formik, Form } from 'formik';
import FormikErrorFocus from 'formik-error-focus';
import { Button, CircularProgress, Grid } from '@mui/material';
import * as Yup from 'yup';
import { useEditBrandMutation } from '../../../redux/api/Brands';


const EditBrand = ({ open, close, refetch, brand }) => {
	const initialValue = {
		name: brand.name,
		manufacturer: brand.manufacturer,
	};
	
	const validate = Yup.object().shape({
		name: Yup.string().trim().required('Required'),
		manufacturer: Yup.string().trim().required('Required'),
	});
	
	const [editProduct, { isLoading, isError }] = useEditBrandMutation();

	const submitForm = async (data) => {
		const payload = {
			name: data.name,
			manufacturer: data.manufacturer,
			isActive: brand.isActive,
			createdAt: brand.createdAt,
			modifiedAt: new Date().toISOString()
		};

		try {
			const response = await editProduct({ id: brand._id, payload: payload });
			if(response.data) {
				toast.success("Brand updated successfully");
				refetch();
				close();
			} else if(isError || !data) {
				toast.error("Brand updating product");
			}
		} catch (error) {
			console.log(error);
			toast.error("Brand updating product");
		}	
	}

	return (
		<ModalWrapper open={open} close={close}  modalClass={'newProductModal'}>
			<ModalBody>
				<ModalTitle title="Edit Product" />
				<Formik
					enableReinitialize
					initialValues={initialValue}
					validationSchema={validate}
					validateOnChange={false}
					onSubmit={(values) => { submitForm(values) }}
				>
					{() => (
						<Form>
							<Grid container spacing={3} marginTop="0" alignItems="flex-start">
								<Grid item xs={12}>
									<TextInput name="name" label="Name" />
								</Grid>
								<Grid item xs={12}>
									<TextInput name="manufacturer" label="Brand Manufacturer" />
								</Grid>
								<Grid item xs={6}>
									<Button disabled={isLoading} type="button" onClick={close} sx={{ height: '57px' }} variant="outlined" fullWidth>Close</Button>
								</Grid>
								<Grid item xs={6}>
									<Button type="submit" disabled={isLoading} sx={{ height: '57px' }} variant="contained" fullWidth>
										{
											isLoading ? <CircularProgress /> : 'Update Brand'
										}
									</Button>
								</Grid>
							</Grid>
							<FormikErrorFocus
								offset={0}
								align={"top"}
								focusDelay={200}
								ease={"linear"}
								duration={1000}
							/>
						</Form>
					)}
				</Formik>
			</ModalBody>
		</ModalWrapper>
	)
}

export default EditBrand;