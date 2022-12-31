import { Box, Button, Grid, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import React from 'react';
import styled from 'styled-components';
import { TitleBar, TextInput } from '../../lib';
import * as Yup from 'yup';
import { useGetOrgSettingsQuery, useEditOrgSettingsMutation } from '../../redux/api/Settings';
import { toast } from 'react-toastify';

const Container = styled.div`
	padding: 1rem;
`;


const Settings = () => {
	const { data, refetch } = useGetOrgSettingsQuery();
	const settings = data?.data;

	const init = {
		orgName: settings?.orgName,
		phone: settings?.phone,
		email: settings?.email,
		address: settings?.address,
		salutation: settings?.salutation,
		disclaimer: settings?.disclaimer
	}
	
	const validate = Yup.object().shape({
		orgName: Yup.string().required('Company name is required'),
		phone: Yup.string().required('Company phone number is required'),
		email: Yup.string().required('Company email address is required'),
		address: Yup.string().required('Company address is required'),
		salutation: Yup.string().required('Salutation is required'),
		disclaimer: Yup.string(),
	});
	
	const [editSettings, { isLoading: editLoading }] = useEditOrgSettingsMutation();
	const submitForm = async (data) => {
		const payload = { ...data, createdAt: settings.createdAt, modifiedAt: new Date().toISOString() };
		try {
			const response = await editSettings({ id: settings._id, payload });
			console.log(response);
			if(response.data) {
				toast.success(response?.data?.message);
				refetch();
			} else {
				toast.error("403 Error: Unable to update organization settings");
			}
		} catch (error) {
			toast.error("500 Server Error: Unable to update organization settings");
		}
	}
	
	return (
		<React.Fragment>
			<TitleBar text="Organization Settings" />
			<Container>
				<Box sx={{ maxWidth: '500px', margin: '2rem auto 0 auto' }}>
					<Formik
						enableReinitialize
						initialValues={init}
						validationSchema={validate}
						onSubmit={(values) => submitForm(values)}
					>
						{() => (
							<Form>
								<Grid container spacing={3}>
									<Grid item xs={12}>
										<Typography variant="h6" sx={{ marginBottom: 1, fontWeight: 400 }}>Company Name</Typography>
										<TextInput name="orgName" fullWidth placeholder='Company name' />
									</Grid>
									<Grid item xs={12}>
										<Typography variant="h6" sx={{ marginBottom: 1, fontWeight: 400 }}>Company Phone Number</Typography>
										<TextInput name="phone" fullWidth placeholder='Phone Number' />
									</Grid>
									<Grid item xs={12}>
										<Typography variant="h6" sx={{ marginBottom: 1, fontWeight: 400 }}>Company Email Address</Typography>
										<TextInput name="email" fullWidth placeholder='Email Address' />
									</Grid>
									<Grid item xs={12}>
										<Typography variant="h6" sx={{ marginBottom: 1, fontWeight: 400 }}>Company Address</Typography>
										<TextInput name="address" fullWidth placeholder='Company Address' multiline rows={2} />
									</Grid>
									<Grid item xs={12}>
										<Typography variant="h6" sx={{ marginBottom: 1, fontWeight: 400 }}>Salutation</Typography>
										<TextInput name="salutation" fullWidth placeholder='Salutation' multiline rows={2} />
									</Grid>
									<Grid item xs={12}>
										<Typography variant="h6" sx={{ marginBottom: 1, fontWeight: 400 }}>Disclaimer</Typography>
										<TextInput name="disclaimer" fullWidth placeholder='Disclaimer' multiline rows={2} />
									</Grid>
									<Grid item xs={12}>
										<Button disabled={editLoading} type="submit" variant="contained" fullWidth sx={{ height: '3rem' }}>Save</Button>
									</Grid>
								</Grid>
							</Form>
						)}
					</Formik>
				</Box>
			</Container>
		</React.Fragment>
	)
}

export default Settings;