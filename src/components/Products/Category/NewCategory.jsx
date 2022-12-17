import React from 'react';
import { toast } from 'react-toastify'
import { TextInput, ModalWrapper, ModalTitle, ModalBody } from '../../../lib';
import { Formik, Form } from 'formik';
import FormikErrorFocus from 'formik-error-focus';
import { Button, CircularProgress, Grid } from '@mui/material';
import * as Yup from 'yup';
import { customAlphabet } from 'nanoid';
import { useNewCategoryMutation } from '../../../redux/api/Categories';


const NewCategory = ({ open, close, refetch }) => {

	const initialValue = { name: '', description: '' };
	
	const validate = Yup.object().shape({
		name: Yup.string().trim().required('Required'),
		description: Yup.string().trim().required('Required'),
	});
	
	const categoryId = customAlphabet('qwertyuiopasdfghjklzxcvbnm1234567890', 8);
	
	const [newCategory, { isLoading, isError }] = useNewCategoryMutation();

	const submitForm = async (data) => {
		const payload = {
			id: categoryId(),
			name: data.name,
			description: data.description,
			createdAt: new Date().toISOString(),
			modifiedAt: new Date().toISOString()
		}

		try {
			const response = await newCategory(payload);
			if(response.data) {
				toast.success("Product category added successfully");
				refetch();
				close();
			} else if(isError) {
				toast.error("Error creating product category");
			}
		} catch (error) {
			console.log(error);
			toast.error("Error creating product category");
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