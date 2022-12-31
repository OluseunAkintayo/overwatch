import React from 'react';
import { toast } from 'react-toastify'
import { TextInput, ModalWrapper, ModalTitle, ModalBody } from '../../../lib';
import { Formik, Form } from 'formik';
import FormikErrorFocus from 'formik-error-focus';
import { Box, Button, CircularProgress, FormControlLabel, Grid, Switch } from '@mui/material';
import * as Yup from 'yup';
import { customAlphabet } from 'nanoid';
import { useEditProductMutation } from '../../../redux/api/Products';


const EditProduct = ({ open, close, refetch, product }) => {
	const [id, setId] = React.useState('');
	const generateCode = () => {
		const nanoid = customAlphabet('1234567890', 8);
		const pid = nanoid();
		setId(pid);
	}

	const [isActive, setIsActive] = React.useState(!product.isActive ? false : true);
	const onActiveChange = (e) => setIsActive(e.target.checked);
	
	const initialValue = {
		productCode: product.productCode || id,
		productName: product.name,
		description: product.description,
		brand: product.brand,
		category: product.category,
		subcategory: product.subcategory,
		costPrice: product.pricing.cost,
		retailPrice: product.pricing.retail,
		isActive: product.isActive ? product.isActive : false
	};
	
	const validate = Yup.object().shape({
		productCode: Yup.string().trim().required('Required'),
		productName: Yup.string().trim().required('Required'),
		description: Yup.string().trim().required('Required'),
		brand: Yup.string().trim().required('Required'),
		category: Yup.string().trim().required('Required'),
		subcategory: Yup.string().trim(),
		costPrice: Yup.number().typeError('Price must be a number').required('Required'),
		retailPrice: Yup.number().typeError('Price must be a number').required('Required'),
	});
	
	const [editProduct, { isLoading, isError }] = useEditProductMutation();

	const submitForm = async (data) => {
		const payload = {
			name: data.productName,
			productCode: data.productCode,
			description: data.description,
			brand: data.brand,
			category: data.category,
			subcategory: data.subcategory,
			pricing: {
				cost: data.costPrice,
				retail: data.retailPrice
			},
			inStock: false,
			isActive,
			imgUrl: "",
			expiryDate: data.expiryDate ? data.expiryDate : "2099-12-12",
			createdAt: data.createdAt ? data.createdAt : new Date().toISOString(),
			modifiedAt: new Date().toISOString()
		}

		try {
			const response = await editProduct({id: product._id, payload: payload});
			if(response.data) {
				toast.success("Product updated successfully");
				refetch();
				close();
			} else if(isError || !data) {
				toast.error("Error updating product");
			}
		} catch (error) {
			console.log(error);
			toast.error("Error updating product");
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
									<Box sx={{ display: 'flex', gap: '1rem' }}>
										<TextInput name="productCode" label="Product Code" />
										<Button type="button" variant="outlined" onClick={generateCode} sx={{ height: '52.7px'}}>Generate</Button>
									</Box>
								</Grid>
								<Grid item xs={12}>
									<TextInput name="productName" label="Name" />
								</Grid>
								<Grid item xs={12}>
									<TextInput name="description" label="Product Description" />
								</Grid>
								<Grid item xs={12}>
									<TextInput name="brand" label="Product Brand" />
								</Grid>
								<Grid item xs={12} md={6}>
									<TextInput name="category" label="Category" />
								</Grid>
								<Grid item xs={12} md={6}>
									<TextInput name="subcategory" label="Sub-category" />
								</Grid>
								<Grid item xs={12} md={6}>
									<TextInput name="costPrice" label="Cost Price" />
								</Grid>
								<Grid item xs={12} md={6}>
									<TextInput name="retailPrice" label="Retail Price" />
								</Grid>
								<Grid item xs={12}>
									<FormControlLabel name='isActive' control={<Switch checked={isActive} onChange={onActiveChange} />} label="Active" />
								</Grid>
								<Grid item xs={6}>
									<Button disabled={isLoading} type="button" onClick={close} sx={{ height: '57px' }} variant="outlined" fullWidth>Close</Button>
								</Grid>
								<Grid item xs={6}>
									<Button type="submit" disabled={isLoading} sx={{ height: '57px' }} variant="contained" fullWidth>
										{
											isLoading ? <CircularProgress /> : 'Update product'
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

export default EditProduct;