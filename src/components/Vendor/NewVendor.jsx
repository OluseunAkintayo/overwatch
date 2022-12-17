import React from 'react';
import { toast } from 'react-toastify'
import { TextInput, ModalWrapper } from '../../lib';
import { Formik, Form } from 'formik';
import FormikErrorFocus from 'formik-error-focus';
import { Box, Button, CircularProgress, Grid } from '@mui/material';
import styled from '@emotion/styled';
import * as Yup from 'yup';
import { customAlphabet } from 'nanoid';
import axios from 'axios';
import { useNewVendorMutation } from '../../redux/api/Store';

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
	/* color: #333333; */
	color: rgba(0, 0, 0, 0.87);
`;

const NewVendor = ({ open, close, refetch }) => {
	const [newVendor] = useNewVendorMutation();

	const initialValue = {
		companyName: '',
		companyAddress: '',
		contactPerson: '',
		contactEmail: '',
		contactPhone: '',
	};

	const validate = Yup.object().shape({
		companyName: Yup.string().trim().required('Required'),
		companyAddress: Yup.string().trim().required('Required'),
		contactPerson: Yup.string().trim().required('Required'),
		contactEmail: Yup.string().email().trim().required('Required'),
		contactPhone: Yup.number().typeError('Price must be a number').required('Required'),
	});

	const vendorId = customAlphabet('qwertyuiopasdfghjklzxcvbnm1234567890', 8);
	const [isLoading, setIsLoading] = React.useState(false);

	const submitForm = async (data) => {
		setIsLoading(true);
		const payload = {
			id: vendorId(),
			companyName: data.companyName,
			companyAddress: data.companyAddress,
			contactPerson: data.contactPerson,
			contactEmail: data.contactEmail,
			contactPhone: data.contactPhone,
		}

		try {
			const res = await newVendor(payload);
			console.log(res);
			if(res.data) {
				setTimeout(() => {
					setIsLoading(false);
					toast.success("Vendor added successfully!");
					refetch();
					close();
				}, 2000);
			} else {
				setIsLoading(false);
				toast.warn("Error adding vendor!");
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
					<FormTitle>New Vendor</FormTitle>
				</FormHeader>
				<Formik
					enableReinitialize
					initialValues={initialValue}
					validationSchema={validate}
					validateOnChange={false}
					onSubmit={(values) => { submitForm(values) }}
				>
					{({ errors }) => (
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
										{ isLoading ? <CircularProgress /> : 'add vendor' }
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

export default NewVendor;