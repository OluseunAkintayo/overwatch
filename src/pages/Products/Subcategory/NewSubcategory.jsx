import React from 'react';
import { toast } from 'react-toastify'
import { TextInput, SelectMenu, ModalWrapper, ModalTitle, ModalBody } from '../../../lib';
import { Formik, Form } from 'formik';
import FormikErrorFocus from 'formik-error-focus';
import { Button, CircularProgress, Grid } from '@mui/material';
import * as Yup from 'yup';
import { useNewSubcategoryMutation } from '../../../redux/api/Categories';


const NewSubcategory = ({ open, close, refetch, categories }) => {
	
	const categoriesData = categories.map(item => {
		return {
			name: item.name,
			value: item.name
		}
	}).sort((a, b) => a.name.localeCompare(b.name));

	const initialValue = { name: '', description: '', parentCategory: '' };
	
	const validate = Yup.object().shape({
		name: Yup.string().trim().required('Required'),
		description: Yup.string().trim().required('Required'),
		parentCategory: Yup.string().trim().required('Required'),
	});
	
	const [newSubcategory, { isLoading, isError }] = useNewSubcategoryMutation();

	const submitForm = async (data) => {
		const payload = {
			name: data.name,
			description: data.description,
			parentCategory: data.parentCategory,
			createdAt: new Date().toISOString(),
			modifiedAt: new Date().toISOString()
		}

		try {
			const response = await newSubcategory(payload);
			if(response.data) {
				toast.success("Product subcategory added successfully");
				refetch();
				close();
			} else if(isError) {
				toast.error("Error creating product subcategory");
			}
		} catch (error) {
			console.log(error);
			toast.error("Error creating product subcategory");
		}
	}

	return (
		<ModalWrapper open={open} close={close}  modalClass={'newProductModal'}>
			<ModalBody>
				<ModalTitle title="New Product Subcategory" />
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
								<Grid item xs={12}>
									<SelectMenu name="parentCategory" label="Parent Category" options={categoriesData} />
								</Grid>
								<Grid item xs={6}>
									<Button disabled={isLoading} type="button" onClick={close} sx={{ height: '57px' }} variant="outlined" fullWidth>Close</Button>
								</Grid>
								<Grid item xs={6}>
									<Button type="submit" disabled={isLoading} sx={{ height: '57px' }} variant="contained" fullWidth>
										{ isLoading ? <CircularProgress /> : 'add subcategory' }
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

export default NewSubcategory;