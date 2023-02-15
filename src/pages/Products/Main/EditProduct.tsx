import React from 'react';
import { toast } from 'react-toastify'
import { ModalWrapper, ModalTitle, ModalBody } from '../../../lib';
import { Box, Button, CircularProgress, Grid, FormControlLabel, Autocomplete, TextField, Checkbox, FormControl, OutlinedInput, InputAdornment, IconButton, InputLabel } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import * as Yup from 'yup';
import { customAlphabet } from 'nanoid';
import axios from 'axios';
import { Replay } from '@mui/icons-material';
import { useFormik } from 'formik';
import dayjs from 'dayjs';

interface ProductProps {
	_id?: string;
	productCode: string;
	name: string;
	description: string;
	brand: string;
	category: string;
	subcategory?: string;
	expiryDate: string;
	isActive: boolean;
	pricing: { cost: string | number; retail: number | string; };
	inStock: boolean;
	imgUrl: string;
	createdAt: string;
	modifiedAt: string;
	quantity: number
}

interface BrandProps {
	_id: string;
	name: string
	manufacturer: string;
	modifiedAt: string;
	createdAt: string;
	isActive: Boolean;
}

interface CategoryProps {
	_id: string;
	name: string;
	description: string;
	isActive: Boolean;
	createdAt: string;
	modifiedAt: string;
}

interface editProductModalProps {
	open: boolean;
	close: () => void;
	refetch: () => void;
	brandsData: [];
	categoriesData: [];
	product: ProductProps | null;
}

const validationSchema = Yup.object().shape({
	productCode: Yup.string().trim().required('Required'),
	name: Yup.string().trim().required('Required'),
	description: Yup.string().trim().required('Required'),
	brand: Yup.string().trim().required('Required'),
	category: Yup.string().trim().required('Required'),
	subcategory: Yup.string(),
	pricing: Yup.object().shape({
		cost: Yup.number().typeError('Price must be a number').required('Required'),
		retail: Yup.number().typeError('Price must be a number').required('Required')
	}),
	expiryDate: Yup.string().required('Required')
});

const EditProduct = ({ open, close, refetch, brandsData, categoriesData, product }: editProductModalProps) => {
	const [id, setId] = React.useState(product?.productCode ? product.productCode : '');
	const [isLoading, setIsLoading] = React.useState(false);
	const generateCode = () => {
		const nanoid = customAlphabet('1234567899', 8);
		setId(() => nanoid());
	}
	
	const initialValues: ProductProps = {
		productCode: id,
		name: product?.name ? product.name : '',
		description: product?.description ? product.description : '',
		brand: product?.brand ? product.brand : '',
		category: product?.category ? product.category : '',
		subcategory: product?.subcategory,
		expiryDate: product?.expiryDate ? product.expiryDate : '',
		isActive: product?.isActive === true ? product.isActive :  false,
		pricing: {
			cost: product?.pricing.cost ? product.pricing.cost : 0,
			retail: product?.pricing.retail ? product.pricing.retail : 0
		},
		inStock: product?.inStock ? product.inStock : false,
		imgUrl: product?.imgUrl ? product.imgUrl : '',
		createdAt: product?.createdAt ? product.createdAt : '',
		modifiedAt: product?.modifiedAt ? product.modifiedAt : '',
		quantity: product?.quantity ? product.quantity : 0
	}

	const submit = async (data: ProductProps): Promise<void> => {
		setIsLoading(true);
		const token = localStorage.getItem('token');
		const payload = {
			name: data.name,
			productCode: data.productCode,
			description: data.description,
			brand: data.brand,
			category: data.category,
			subcategory: data.subcategory,
			pricing: {
				cost: data.pricing.cost,
				retail: data.pricing.retail
			},
			inStock: data.inStock,
			isActive: data.isActive,
			imgUrl: data.imgUrl,
			expiryDate: dayjs(data.expiryDate).toISOString(),
			createdAt: data.createdAt,
			modifiedAt: new Date().toISOString(),
		}
		const config = {
			url: 'products/update/' + product?._id,
			method: 'PUT',
			headers: {
				"Accept": "*",
				"Authorization": `Bearer ${token}`,
				"Content-Type": "application/json"
			},
			data: payload
		}
		try {
			const res = await axios.request(config);
			if(res.status === 200 && res.data.status === 1) {
				toast.success(res.data?.message);
				refetch();
				close();
			}
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			console.log(error);
			toast.error("Error creating product.");
		}
	}

	const formik = useFormik({
		initialValues, validationSchema,
		validateOnChange: false, enableReinitialize: true,
		onSubmit: (values) => submit(values)
	});

	const { handleSubmit, handleChange, touched, errors, values, setFieldValue } = formik;

	return (
		<ModalWrapper open={open} close={close}  modalClass={'newProductModal'}>
			<ModalBody>
				<ModalTitle title="New Product" />
				<Box component="form" autoComplete="off" onSubmit={handleSubmit}>
					<Grid container spacing={3} marginTop={0} alignItems="flex-start">
						<Grid item xs={12}>
							<FormControl fullWidth variant="outlined">
								<InputLabel htmlFor="outlined-adornment-password">Product Code</InputLabel>
								<OutlinedInput
									name="productCode" id="productCode" label="Product Code" fullWidth
									defaultValue={values.productCode} onChange={handleChange}
									error={touched.productCode && Boolean(errors.productCode)}
									endAdornment={
										<InputAdornment position="end">
											<IconButton
												aria-label="generate product code" edge="end"
												onClick={generateCode}
												sx={{ background: '#354F5220', marginRight: -1 }}
											>
												<Replay />
											</IconButton>
										</InputAdornment>
									}
								/>
							</FormControl>
							{ errors.productCode && <span className="errorText">{errors.productCode}</span> }
						</Grid>
						<Grid item xs={12}>
							<TextField
								name="name" id="name" label="Product Name" fullWidth
								defaultValue={values.name} onChange={handleChange}
								error={touched.name && Boolean(errors.name)}
								helperText={touched.name && errors.name}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								multiline rows={2}
								name="description" id="description" label="Product Description" fullWidth
								defaultValue={values.description} onChange={handleChange}
								error={touched.description && Boolean(errors.description)}
								helperText={touched.description && errors.description}
							/>
						</Grid>
						<Grid item xs={6}>
							<Autocomplete
								id="brands"
								options={brandsData && brandsData.sort((a: BrandProps, b: BrandProps) => a.name.localeCompare(b.name))}
								getOptionLabel={(val: BrandProps) => val.name}
								onChange={(e, value) => setFieldValue("brand", value?.name)}
								defaultValue={brandsData.find((item: ProductProps) => item.name === product?.brand)}
								renderInput={(params) =>(
									<TextField
										{...params}
										name="brand" id="brand" label="Brand" fullWidth
										error={touched.brand && Boolean(errors.brand)}
										helperText={touched.brand && errors.brand}
									/>
								)}
							/>
						</Grid>
						<Grid item xs={6}>
							<Autocomplete
								id="category"
								options={categoriesData && categoriesData.sort((a: CategoryProps, b: CategoryProps) => a.name.localeCompare(b.name))}
								getOptionLabel={(val: CategoryProps) => val.name}
								onChange={(e, value) => setFieldValue("category", value?.name)}
								defaultValue={categoriesData.find((item: ProductProps) => item.name === product?.category)}
								renderInput={(params) =>(
									<TextField
										{...params}
										name="category" id="category" label="Category" fullWidth
										error={touched.category && Boolean(errors.category)}
										helperText={touched.category && errors.category}
									/>
								)}
							/>
						</Grid>
						<Grid item xs={6}>
							<TextField
								name="pricing.cost" id="cost" label="Cost Price" fullWidth type="number"
								defaultValue={values.pricing.cost} onChange={handleChange}
								error={touched.pricing?.cost && Boolean(errors.pricing?.cost)}
								helperText={touched.pricing?.cost && errors.pricing?.cost}
							/>
						</Grid>
						<Grid item xs={6}>
							<TextField
								name="pricing.retail" id="pricing" label="Retail Price" fullWidth type="number"
								defaultValue={values.pricing.retail} onChange={handleChange}
								error={touched.pricing?.retail && Boolean(errors.pricing?.retail)}
								helperText={errors.pricing?.retail}
							/>
						</Grid>
						<Grid item xs={6}>
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DesktopDatePicker
									label="Expiry Date"
									inputFormat="DD/MM/YYYY"
									value={values.expiryDate}
									disablePast
									onChange={(val) => setFieldValue("expiryDate", val)}
									renderInput={(params) => (
										<TextField fullWidth {...params}
											error={touched.expiryDate && Boolean(errors.expiryDate)}
											helperText={touched.expiryDate && errors.expiryDate}
										/>
									)}
								/>
							</LocalizationProvider>
						</Grid>
						<Grid item xs={6}>
							<FormControlLabel
								name="isActive"
								control={<Checkbox checked={values.isActive} />}
								label={values.isActive ? "Active" : "Inactive"}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<Grid container spacing={3}>
								<Grid item xs={6}>
									<Button disabled={isLoading} type="submit" fullWidth variant="contained" sx={{ height: '2.5rem' }}>
										{ isLoading ? <CircularProgress size="1.5rem" /> : 'save' }
									</Button>
								</Grid>
								<Grid item xs={6}>
									<Button disabled={isLoading} type="button" fullWidth variant="outlined" sx={{ height: '2.5rem' }} onClick={close}>close</Button>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Box>
			</ModalBody>
		</ModalWrapper>
	)
}

export default EditProduct;