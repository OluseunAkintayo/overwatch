import React from 'react';
import { toast } from 'react-toastify'
import { TextInput, ModalWrapper } from '../../lib';
import { Formik, Form } from 'formik';
import FormikErrorFocus from 'formik-error-focus';
import { Button, CircularProgress, Grid } from '@mui/material';
import styled from '@emotion/styled';
import * as Yup from 'yup';
import { useEditVendorMutation } from '../../redux/api/Store';

const ModalBody = styled.div`
	padding: 1rem;
`;
const FormHeader = styled.div`
	border-bottom: 1px solid rgba(0, 0, 0, 0.2);
	height: 3rem;
	margin-bottom: 2rem;
	display: flex;
	align-items: center;
`;
const FormTitle = styled.h2`
	font-weight: 900;
	font-size: 1.25rem;
	color: rgba(0, 0, 0, 0.87);
`;

const EditVendor = ({ open, close, refetch, vendor }) => {
	const [editVendor] = useEditVendorMutation();
	
	const initialValue = {
		companyName: vendor.companyName,
		companyAddress: vendor.companyAddress,
		contactPerson: vendor.contactPerson,
		contactEmail: vendor.contactEmail,
		contactPhone: vendor.contactPhone,
	};

	const validate = Yup.object().shape({
		companyName: Yup.string().trim().required('Required'),
		companyAddress: Yup.string().trim().required('Required'),
		contactPerson: Yup.string().trim().required('Required'),
		contactEmail: Yup.string().email().trim().required('Required'),
		contactPhone: Yup.number().typeError('Price must be a number').required('Required'),
	});

	const [isLoading, setIsLoading] = React.useState(false);

	const submitForm = async (data) => {
		setIsLoading(true);
		const payload = {
			companyName: data.companyName,
			companyAddress: data.companyAddress,
			contactPerson: data.contactPerson,
			contactEmail: data.contactEmail,
			contactPhone: data.contactPhone,
			isActive: vendor.isActive,
			createdAt: vendor.createdAt,
			modifiedAt: new Date().toISOString()
		}

		try {
			const res = await editVendor({ id: vendor._id, payload });
			if(res.data) {
				setTimeout(() => {
					setIsLoading(false);
					toast.success("Vendor saved successfully!");
					refetch();
					close();
				}, 1500)
			} else {
				setIsLoading(false);
				toast.error("Error adding vendor! Try again");
			}
		} catch (error) {
			console.error({error});
			setIsLoading(false);
			toast.error("Error adding vendor! Try again");
		}
	}

	return (
		<ModalWrapper open={open} close={close}  modalClass={'newProductModal'}>
			<ModalBody>
				<FormHeader>
					<FormTitle>Edit Vendor - {vendor.companyName}</FormTitle>
				</FormHeader>
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
									<TextInput name="companyName" label="Vendor Name" />
								</Grid>
								<Grid item xs={12}>
									<TextInput name="companyAddress" label="Company Address" multiline rows={3} />
								</Grid>
								<Grid item xs={12} md={6}>
									<TextInput name="contactPerson" label="Contact Person" />
								</Grid>
								<Grid item xs={12} md={6}>
									<TextInput name="contactEmail" label="Contact Email" />
								</Grid>
								<Grid item xs={12} md={6}>
									<TextInput name="contactPhone" label="Contact Phone" />
								</Grid>
								<Grid item xs={6}>
									<Button type="submit" disabled={isLoading} sx={{ height: '57px' }} variant="contained" fullWidth>
										{ isLoading ? <CircularProgress /> : 'save' }
									</Button>
								</Grid>
								<Grid item xs={6}>
									<Button disabled={isLoading} type="button" onClick={close} sx={{ height: '57px' }} variant="outlined" fullWidth>Close</Button>
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

export default EditVendor;