import React from 'react';
import { toast } from 'react-toastify'
import { TextInput, ModalWrapper, ModalTitle, ModalBody } from '../../../lib';
import { Formik, Form } from 'formik';
import FormikErrorFocus from 'formik-error-focus';
import { Button, CircularProgress, Grid } from '@mui/material';
import * as Yup from 'yup';
import axios from 'axios';


const NewCategory = ({ open, close, refetch }) => {
	const [isLoading, setIsLoading] = React.useState(false);
	const [error, setError] = React.useState(null);

	const initialValue = { name: '', description: '' };
	
	const validate = Yup.object().shape({
		name: Yup.string().trim().required('Required'),
		description: Yup.string().trim().required('Required'),
	});

	const submitForm = async (data) => {
		setIsLoading(true);
		const token = localStorage.getItem('token');
		const payload = {
			name: data.name,
			description: data.description,
			isActive: true,
			createdAt: new Date().toISOString(),
			modifiedAt: new Date().toISOString()
		}
		const config = {
			url: 'products/categories/new',
			method: "POST",
			headers: {
				"Accept": "*",
				"Authorization": `Bearer ${token}`,
				"Content-Type": "application/json"
			},
			data: payload
		}

		try {
			const response = await axios.request(config);
			if(response.status === 201) {
				toast.success("Product category added successfully");
				refetch();
				close();
			} else if(error) {
				toast.error("Error creating product category");
			}
		} catch (error) {
			console.log(error);
			setError(error);
			toast.error(error.status + ": Server error");
		}
	}

	return (
		<ModalWrapper open={open} close={close}  modalClass={'newProductModal'}>
			<ModalBody>
				<ModalTitle title="New Product Category" />
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
									<TextInput name="description" label="Description" />
								</Grid>
								<Grid item xs={6}>
									<Button disabled={isLoading} type="button" onClick={close} sx={{ height: '57px' }} variant="outlined" fullWidth>Close</Button>
								</Grid>
								<Grid item xs={6}>
									<Button type="submit" disabled={isLoading} sx={{ height: '57px' }} variant="contained" fullWidth>
										{
											isLoading ? <CircularProgress /> : 'add category'
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

export default NewCategory;