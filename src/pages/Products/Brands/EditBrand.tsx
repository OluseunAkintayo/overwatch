import React from 'react';
import { toast } from 'react-toastify'
import { ModalWrapper, ModalTitle, ModalBody } from '../../../lib';
import { useFormik } from 'formik';
import { Box, Button, Checkbox, CircularProgress, FormControlLabel, Grid, TextField } from '@mui/material';
import * as Yup from 'yup';
import axios from 'axios';

interface EditBrandComponentProps {
	open: boolean;
	close: () => void;
	refetch: () => void;
	brand: BrandProps | null;
}

interface BrandProps {
	_id?: string;
	name: string
	manufacturer: string;
	isActive: boolean | undefined;
	modifiedAt?: string;
	createdAt?: string;
}

const EditBrand = ({ open, close, refetch, brand }: EditBrandComponentProps) => {
	const [loading, setLoading] = React.useState<boolean>(false);
	const initialValues: BrandProps = {
		name: brand?.name ? brand.name : '',
		manufacturer: brand?.manufacturer ? brand.manufacturer : '',
		isActive: brand?.isActive
	};
	
	const validationSchema = Yup.object().shape({
		name: Yup.string().trim().required('Required'),
		manufacturer: Yup.string().trim().required('Required'),
		isActive: Yup.boolean().required('Required')
	});

	const submit = async (data: { name: string; manufacturer: string; isActive: boolean | undefined; }) => {
		setLoading(true);
		const token: string | null = localStorage.getItem('token');
		const payload = {
			name: data?.name,
			manufacturer: data?.manufacturer,
			isActive: data?.isActive,
			createdAt: brand?.createdAt,
			modifiedAt: new Date().toISOString()
		};

		const config = {
			url: 'products/brands/update/' + brand?._id,
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Headers': '*',
				'Authorization': `Bearer ${token}`
			},
			data: payload
		};
	
		try {
			const response = await axios.request(config);
			if(response.status === 200 && response.data.status === 1) {
				setLoading(false);
				toast.success("Brand updated successfully");
				refetch();
				close();
			} else {
				setLoading(false);
				toast.error("Error updating brand");
			}
		} catch (error) {
			console.log(error);
			setLoading(false);
			toast.error("Server error");
		}
	}

	const formik = useFormik({
		initialValues, validationSchema, validateOnChange: false,
		onSubmit: (values) => submit(values)
	});
	
	const { handleSubmit, handleChange, touched, errors, values } = formik;
	// console.log(values);

	return (
		<ModalWrapper open={open} close={close}  modalClass={'newProductModal'}>
			<ModalBody>
				<ModalTitle title="Edit Product" />
				<Box component="form" autoComplete="off" onSubmit={handleSubmit}>
					<Grid container spacing={3} marginTop="0" alignItems="flex-start">
						<Grid item xs={12}>
							<TextField
								name="name" label="Name" fullWidth
								value={values.name} onChange={handleChange}
								error={touched.name && Boolean(errors.name)}
								helperText={touched.name && errors.name}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								name="manufacturer" label="Brand Manufacturer" fullWidth
								value={values.manufacturer} onChange={handleChange}
								error={touched.manufacturer && Boolean(errors.manufacturer)}
								helperText={touched.manufacturer && errors.manufacturer}
							/>
						</Grid>
						<Grid item xs={12}>
							<FormControlLabel
								name="isActive"
								control={<Checkbox checked={values?.isActive} />}
								label={values.isActive ? "Active" : "Inactive"}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={6}>
							<Button type="submit" disabled={loading} sx={{ height: '57px' }} variant="contained" fullWidth>{ loading ? <CircularProgress /> : 'Update Brand' }</Button>
						</Grid>
						<Grid item xs={6}>
							<Button disabled={loading} type="button" onClick={close} sx={{ height: '57px' }} variant="outlined" fullWidth>Close</Button>
						</Grid>
					</Grid>
				</Box>
			</ModalBody>
		</ModalWrapper>
	)
}

export default EditBrand;
