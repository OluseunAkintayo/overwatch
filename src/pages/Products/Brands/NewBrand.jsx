import React from 'react';
import { toast } from 'react-toastify'
import { TextInput, ModalWrapper, ModalTitle, ModalBody } from '../../../lib';
import { Formik, Form } from 'formik';
import FormikErrorFocus from 'formik-error-focus';
import { Button, CircularProgress, Grid } from '@mui/material';
import * as Yup from 'yup';
import { customAlphabet } from 'nanoid';
import { useNewBrandMutation } from '../../../redux/api/Brands';


const NewBrand = ({ open, close, refetch }) => {

	const initialValue = {
		name: '',
		manufacturer: '',
	};
	
	const validate = Yup.object().shape({
		name: Yup.string().trim().required('Required'),
		manufacturer: Yup.string().trim().required('Required'),
	});
	
	const [newProduct, { isLoading, isError }] = useNewBrandMutation();

	const submitForm = async (data) => {
		const payload = {
			name: data.name,
			manufacturer: data.manufacturer,
			isActive: true,
			createdAt: new Date().toISOString(),
			modifiedAt: new Date().toISOString()
		}

		try {
			const response = await newProduct(payload);
			if(response.data) {
				toast.success("Brand added successfully");
				refetch();
				close();
			} else if(isError) {
				toast.error("Error creating brand");
			}
		} catch (error) {
			console.log(error);
			toast.error("Error creating brand");
		}
		
	}

	return (
		<ModalWrapper open={open} close={close}  modalClass={'newProductModal'}>
			<ModalBody>
				<ModalTitle title="New Brand" />
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
											isLoading ? <CircularProgress /> : 'add brand'
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

export default NewBrand;