import React from 'react';
import { toast } from 'react-toastify'
import { ModalWrapper, ModalTitle, ModalBody } from '../../../lib';
import { useFormik } from 'formik';
import { Box, Button, CircularProgress, Grid, TextField } from '@mui/material';
import * as Yup from 'yup';
import axios from 'axios';


interface NewBrandComponentProps {
	open: boolean;
	close: () => void;
	refetch: () => void;
}

const initialValues = { name: '', manufacturer: '' };
const validationSchema = Yup.object().shape({
	name: Yup.string().trim().required('Required'),
	manufacturer: Yup.string().trim().required('Required'),
});

const NewBrand = ({ open, close, refetch }: NewBrandComponentProps) => {
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const token: string | null = localStorage.getItem('token');
	
	const submit = async (data: { name: string; manufacturer: string; }) => {
		setIsLoading(true);
		const payload = {
			name: data.name,
			manufacturer: data.manufacturer,
			isActive: true,
			createdAt: new Date().toISOString(),
			modifiedAt: new Date().toISOString()
		}

		const config = {
			url: 'products/brands',
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
			toast.error("Error creating brand.");
		}
	}

	const formik = useFormik({
		initialValues, validationSchema,
		validateOnChange: false, enableReinitialize: true,
		onSubmit: (values) => submit(values)
	});
	
	const { handleSubmit, handleChange, touched, errors, values } = formik;

	return (
		<ModalWrapper open={open} close={close}  modalClass={'newProductModal'}>
			<ModalBody>
				<ModalTitle title="New Brand" />
				<Box component="form" autoComplete="off" onSubmit={handleSubmit}>
					<Grid container spacing={3} marginTop="0" alignItems="flex-start">
						<Grid item xs={12}>
							<TextField
								name="name" id="productName" label="Product Name" fullWidth
								value={values.name} onChange={handleChange}
								error={touched.name && Boolean(errors.name)}
								helperText={touched.name && errors.name}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								name="manufacturer" id="manufacturer" label="Manufacturer" fullWidth
								value={values.manufacturer} onChange={handleChange}
								error={touched.manufacturer && Boolean(errors.manufacturer)}
								helperText={touched.manufacturer && errors.manufacturer}
							/>
						</Grid>
						<Grid item xs={6}>
							<Button type="submit" disabled={isLoading} sx={{ height: '57px' }} variant="contained" fullWidth>{ isLoading ? <CircularProgress /> : 'add brand' }</Button>
						</Grid>
						<Grid item xs={6}>
							<Button disabled={isLoading} type="button" onClick={close} sx={{ height: '57px' }} variant="outlined" fullWidth>Close</Button>
						</Grid>
					</Grid>
				</Box>
				
			</ModalBody>
		</ModalWrapper>
	)
}

export default NewBrand;