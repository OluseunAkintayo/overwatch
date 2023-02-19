import React from 'react';
import { toast } from 'react-toastify'
import { ModalWrapper, ModalTitle, ModalBody } from '../../../lib';
import { useFormik } from 'formik';
import { Box, Button, CircularProgress, Grid, TextField } from '@mui/material';
import * as Yup from 'yup';
import axios from 'axios';

interface NewCategoryComponentProps {
	open: boolean;
	close: () => void;
	refetch: () => void;
};

const NewCategory = ({ open, close, refetch }: NewCategoryComponentProps) => {
	const [isLoading, setIsLoading] = React.useState(false);
	const [error, setError] = React.useState<any>(null);

	const initialValues: { name: string; description: string; } = { name: '', description: '' };
	
	const validationSchema = Yup.object().shape({
		name: Yup.string().trim().required('Required'),
		description: Yup.string().trim().required('Required'),
	});

	const submit = async (data: { name: string; description: string; }) => {
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
			url: 'products/categories',
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
			if(response.status === 201 && response.data.status === 1) {
				toast.success("Product category added successfully");
				refetch();
				close();
				setIsLoading(false);
			} else {
				toast.error(response.data.message);
				setIsLoading(false);
			}
		} catch (error: any) {
			console.log(error);
			setError(error);
			setIsLoading(false);
			if(error?.response?.status === 404) {
				toast.error("Error " + error?.response?.status + ": " + error?.response?.statusText);
			} else {
				toast.error("Error " + error?.response?.status + ": unable to add product category");
			}
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
				<ModalTitle title="New Product Category" />
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
								name="description" label="Description" fullWidth
								value={values.description} onChange={handleChange}
								error={touched.description && Boolean(errors.description)}
								helperText={touched.description && errors.description}
							/>
						</Grid>
						<Grid item xs={6}>
							<Button type="submit" disabled={isLoading} sx={{ height: '57px' }} variant="contained" fullWidth>{ isLoading ? <CircularProgress /> : 'add category' }</Button>
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

export default NewCategory;