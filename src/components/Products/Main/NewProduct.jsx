import React from 'react';
import { toast } from 'react-toastify'
import { TextInput, SelectMenu, ModalWrapper, ModalTitle, ModalBody } from '../../../lib';
import { Formik, Form } from 'formik';
import FormikErrorFocus from 'formik-error-focus';
import { Box, Button, CircularProgress, Grid } from '@mui/material';
import * as Yup from 'yup';
import { customAlphabet } from 'nanoid';
import { useNewProductMutation } from '../../../redux/api/Products';

const NewProduct = ({ open, close, refetch, brandsData, categoriesData, subcategoriesData }) => {
	const [id, setId] = React.useState('');
	const generateCode = () => {
		const nanoid = customAlphabet('1234567890', 8);
		const pid = nanoid();
		setId(pid);
	}
	
	const initialValue = {
		productCode: id,
		productName: '',
		description: '',
		brand: '',
		category: '',
		subcategory: '',
		costPrice: '',
		retailPrice: ''
	};
	
	const validate = Yup.object().shape({
		productCode: Yup.string().trim().required('Required'),
		productName: Yup.string().trim().required('Required'),
		description: Yup.string().trim().required('Required'),
		brand: Yup.string().trim().required('Required'),
		category: Yup.string().trim().required('Required'),
		subcategory: Yup.string(),
		costPrice: Yup.number().typeError('Price must be a number').required('Required'),
		retailPrice: Yup.number().typeError('Price must be a number').required('Required'),
	});
	
	const productId = customAlphabet('qwertyuiopasdfghjklzxcvbnm1234567890', 8);
	
	const [newProduct, { isLoading, isError }] = useNewProductMutation();

	const submitForm = async (data) => {
		const payload = {
			id: productId(),
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
			imgUrl: ""
		}

		try {
			const response = await newProduct(payload);
			if(response.data) {
				toast.success("Product added successfully");
				refetch();
				close();
			} else if(isError) {
				toast.error("Error creating product");
			}
		} catch (error) {
			console.log(error);
			toast.error("Error creating product");
		}
		
	}

	return (
		<ModalWrapper open={open} close={close}  modalClass={'newProductModal'}>
			<ModalBody>
				<ModalTitle title="New Product" />
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
									<SelectMenu name="brand" label="Product Brand" options={brandsData} />
								</Grid>
								<Grid item xs={12} md={6}>
									<SelectMenu name="category" label="Category" options={categoriesData} />
								</Grid>
								<Grid item xs={12} md={6}>
									<SelectMenu name="subcategory" label="Sub-category" options={subcategoriesData} />
								</Grid>
								<Grid item xs={12} md={6}>
									<TextInput name="costPrice" label="Cost Price" />
								</Grid>
								<Grid item xs={12} md={6}>
									<TextInput name="retailPrice" label="Retail Price" />
								</Grid>
								<Grid item xs={6}>
									<Button disabled={isLoading} type="button" onClick={close} sx={{ height: '57px' }} variant="outlined" fullWidth>Close</Button>
								</Grid>
								<Grid item xs={6}>
									<Button type="submit" disabled={isLoading} sx={{ height: '57px' }} variant="contained" fullWidth>
										{
											isLoading ? <CircularProgress /> : 'add product'
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

export default NewProduct;