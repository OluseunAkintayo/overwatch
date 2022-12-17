import React from 'react';
import { toast } from 'react-toastify'
import { TextInput, SelectMenu, ModalWrapper, ModalTitle, ModalBody } from '../../../lib';
import { Formik, Form } from 'formik';
import FormikErrorFocus from 'formik-error-focus';
import { Button, CircularProgress, Grid } from '@mui/material';
import * as Yup from 'yup';
import { useEditSubcategoryMutation } from '../../../redux/api/Categories';


const EditSubcategory = ({ open, close, refetch, category, categories }) => {
	const categoriesData = categories.map(item => {
		return {
			name: item.name,
			value: item.name,
			id: item.id
		}
	}).sort((a, b) => a.name.localeCompare(b.name));

	const initialValue = {
		name: category.name,
		description: category.description,
		parentCategory: category.parentCategory,
	};
	
	const validate = Yup.object().shape({
		name: Yup.string().trim().required('Required'),
		description: Yup.string().trim().required('Required'),
		parentCategory: Yup.string().trim().required('Required'),
	});
	
	const [editCategory, { isLoading, isError }] = useEditSubcategoryMutation();

	const submitForm = async (data) => {
		const payload = {
			name: data.name,
			description: data.description,
			parentCategory: data.parentCategory,
			createdAt: category.createdAt,
			modifiedAt: new Date().toISOString()
		};

		try {
			const response = await editCategory({id: category.id, payload: payload});
			if(response.data) {
				toast.success("Product subcategory updated successfully");
				refetch();
				close();
			} else if(isError || !data) {
				toast.error("Error updating product subcategory");
			}
		} catch (error) {
			console.log(error);
			toast.error("Error updating product subcategory");
		}	
	}

	return (
		<ModalWrapper open={open} close={close}  modalClass={'newProductModal'}>
			<ModalBody>
				<ModalTitle title="Edit Product Subategory" />
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
										{
											isLoading ? <CircularProgress /> : 'Update Category'
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

export default EditSubcategory;