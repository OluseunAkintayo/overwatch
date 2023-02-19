import React from 'react';
import { toast } from 'react-toastify';
import { ModalWrapper, ModalTitle, ModalBody } from '../../../lib';
import { useFormik } from 'formik';
import { Box, Button, Checkbox, CircularProgress, FormControlLabel, Grid, TextField } from '@mui/material';
import * as Yup from 'yup';
import axios from 'axios';

interface EditCategoryComponentProps {
	open: boolean;
	close: () => void;
	refetch: () => void;
	category: null | CategoryProps;
}

interface CategoryProps {
	_id?: string;
	name: string;
	description: string;
	isActive: boolean | undefined;
	createdAt?: string;
	modifiedAt?: string;
}

const EditCategory = ({ open, close, refetch, category }: EditCategoryComponentProps) => {
	const [loading, setLoading] = React.useState<boolean>(false);
	const initialValues: CategoryProps = {
		name: category?.name ? category?.name : '',
		description: category?.description ? category?.description : '',
		isActive: category?.isActive
	};
	
	const validationSchema = Yup.object().shape({
		name: Yup.string().trim().required('Required'),
		description: Yup.string().trim().required('Required'),
		isActive: Yup.boolean().required('Required')
	});

	const submit = async (data: { name: string | undefined; description: string | undefined; isActive: boolean | undefined; }) => {
		setLoading(true);
		const token = localStorage.getItem('token') as string | null;
		const payload = {
			name: data.name,
			description: data.description,
			isActive: data?.isActive,
			createdAt: category?.createdAt,
			modifiedAt: new Date().toISOString()
		};

		const config = {
			url: 'products/categories/update/' + category?._id,
			method: "PUT",
			headers: {
				"Accept": "*",
				"Authorization": `Bearer ${token}`,
				"Content-Type": "application/json"
			},
			data: payload
		}

		try {
			const response = await axios.request(config);
			if(response.status === 200 && response.data.status === 1) {
				setLoading(false);
				toast.success("Product category updated successfully");
				refetch();
				close();
			} else {
				toast.error("Error updating product category");
				setLoading(false);
			}
		} catch (error: any) {
			setLoading(false);
			console.log(error);
			toast.error(error.response.status + ": Internal Error.");
		}	
	}

	const formik = useFormik({
		initialValues, validationSchema, validateOnChange: false,
		onSubmit: (values) => submit(values)
	});

	const { handleSubmit, handleChange, touched, errors, values } = formik;

	return (
		<ModalWrapper open={open} close={close}  modalClass={'newProductModal'}>
			<ModalBody>
				<ModalTitle title="Edit Product Category" />
				<Box component="form" autoComplete="off" onSubmit={handleSubmit}>
					<Grid container spacing={3} marginTop="0" alignItems="flex-start">
						<Grid item xs={12}>
							<TextField name="name" label="Name" fullWidth
								value={values.name} onChange={handleChange}
								error={touched.name && Boolean(errors.name)}
								helperText={touched.name && errors.name}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField name="description" label="Description" fullWidth
								value={values.description} onChange={handleChange}
								error={touched.description && Boolean(errors.description)}
								helperText={touched.description && errors.description}
							/>
						</Grid>
						<Grid item xs={12}>
							<FormControlLabel
								name="isActive"
								control={<Checkbox checked={values.isActive} />}
								label={values.isActive ? "Active" : "Inactive"}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={6}>
							<Button type="submit" disabled={loading} sx={{ height: '57px' }} variant="contained" fullWidth>
								{ loading ? <CircularProgress /> : 'Update Category' }</Button>
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

export default EditCategory;