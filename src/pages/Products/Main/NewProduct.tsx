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

interface newProductModalProps {
	open: boolean;
	close: () => void;
	refetch: () => void;
	brandsData: [];
	categoriesData: [];
}

interface newProductProps {
	productCode: string;
	productName: string;
	description: string;
	brand: string;
	category: string;
	subcategory: string;
	costPrice: number | string;
	retailPrice: number | string;
	expiryDate: string;
	isActive: boolean;
}

const validationSchema = Yup.object().shape({
	productCode: Yup.string().trim().required('Required'),
	productName: Yup.string().trim().required('Required'),
	description: Yup.string().trim().required('Required'),
	brand: Yup.string().trim().required('Required'),
	category: Yup.string().trim().required('Required'),
	subcategory: Yup.string(),
	costPrice: Yup.number().typeError('Price must be a number').required('Required'),
	retailPrice: Yup.number().typeError('Price must be a number').required('Required'),
	expiryDate: Yup.string().required('Required')
});

interface BrandProps {
	_id: string;
	name: string
	manufacturer: string;
	modifiedAt: string;
	createdAt: string;
	isActive: boolean;
	markedForDeletion: boolean;
}

interface CategoryProps {
	_id: string;
	name: string;
	description: string;
	isActive: Boolean;
	createdAt: string;
	modifiedAt: string;
}

const NewProduct = ({ open, close, refetch, brandsData, categoriesData }: newProductModalProps) => {
	const [id, setId] = React.useState('');
	const [isLoading, setIsLoading] = React.useState(false);
	const generateCode = () => {
		const nanoid = customAlphabet('1234567899', 8);
		const pid = nanoid();
		setId(pid);
	}
	
	const initialValues: newProductProps = {
		productCode: id,
		productName: '',
		description: '',
		brand: '',
		category: '',
		subcategory: '',
		costPrice: '',
		retailPrice: '',
		expiryDate: dayjs().format("YYYY-MM-DD"),
		isActive: true
	}

	const submit = async (data: newProductProps): Promise<void> => {
		setIsLoading(true);
		const token = localStorage.getItem('token');
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
			isActive: true,
			imgUrl: "",
			expiryDate: dayjs(data.expiryDate).toISOString(),
			createdAt: new Date().toISOString(),
			modifiedAt: new Date().toISOString(),
		}
		const config = {
			url: 'products',
			method: 'POST',
			headers: {
				"Accept": "*",
				"Authorization": `Bearer ${token}`,
				"Content-Type": "application/json"
			},
			data: payload
		}
		try {
			const res = await axios.request(config);
			if(res.status === 201 && res.data.status === 1) {
				toast.success(res.data.message);
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
									value={values.productCode} onChange={handleChange}
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
								name="productName" id="productName" label="Product Name" fullWidth
								value={values.productName} onChange={handleChange}
								error={touched.productName && Boolean(errors.productName)}
								helperText={touched.productName && errors.productName}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								multiline rows={2}
								name="description" id="description" label="Product Description" fullWidth
								value={values.description} onChange={handleChange}
								error={touched.description && Boolean(errors.description)}
								helperText={touched.description && errors.description}
							/>
						</Grid>
						<Grid item xs={6}>
							<Autocomplete
								id="brands"
								options={brandsData && brandsData.sort((a: BrandProps, b: BrandProps) => a.name.localeCompare(b.name)).filter((item: BrandProps) => !item.markedForDeletion).filter((item: BrandProps) => item.isActive)}
								getOptionLabel={(val: BrandProps) => val.name}
								onChange={(e, value) => setFieldValue("brand", value?.name)}
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
								id="brands"
								options={categoriesData && categoriesData.sort((a: CategoryProps, b: CategoryProps) => a.name.localeCompare(b.name))}
								getOptionLabel={(val: CategoryProps) => val.name}
								onChange={(e, value) => setFieldValue("category", value?.name)}
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
								name="costPrice" id="costPrice" label="Cost Price" fullWidth type="number"
								value={values.costPrice} onChange={handleChange}
								error={touched.costPrice && Boolean(errors.costPrice)}
								helperText={touched.costPrice && errors.costPrice}
							/>
						</Grid>
						<Grid item xs={6}>
							<TextField
								name="retailPrice" id="retailPrice" label="Retail Price" fullWidth type="number"
								value={values.retailPrice} onChange={handleChange}
								error={touched.retailPrice && Boolean(errors.retailPrice)}
								helperText={touched.retailPrice && errors.retailPrice}
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
										{ isLoading ? <CircularProgress size="1.5rem" /> : 'Add product' }
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

export default NewProduct;