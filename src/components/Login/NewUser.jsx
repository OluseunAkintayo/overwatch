import React from 'react';
import styled from '@emotion/styled';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Button, CircularProgress, FormControl, FormGroup, FormLabel, Grid, Typography } from '@mui/material';
import { TextInput, Checkbox } from '../../lib';
import { toast } from 'react-toastify';
import { useNewUserMutation } from '../../redux/api/Users';

const NewUser = () => {
	React.useEffect(() => {
		document.title = "Overwatch: New User";
		return () => null;
	}, []);

	const init = {
		firstName: '',
		lastName: '',
		email: '',
		designation: [],
		username: '',
		passcode: ''
	}

	const validate = Yup.object().shape({
		firstName: Yup.string().required('First name is required'),
		lastName: Yup.string().required('Last name is required'),
		email: Yup.string().email().required('Email is required'),
		designation: Yup.array().min(1, 'At least one role must be selected'),
		username: Yup.string().required('Username is required'),
		passcode: Yup.string().required('Password is required'),
	});


	const [createUser, { isLoading: loading, isError, error}] = useNewUserMutation();
	
	const newUser = async (data, resetForm) => {
		const payload = {
			...data,
			isActive: true,
			createdAt: new Date().toISOString(),
			modifiedAt: new Date().toISOString(),
		}

		try {
			const res = await createUser(payload);
			console.log(res);
			if(res.data.status === 1) {
				toast.success(res.status.message);
				resetForm();
			} else {
				toast.error(res.data.message);
			}
		} catch (error) {
			console.log(error);
			toast.error('An error has occurred!')
		}

	}

	return (
		<Wrapper>
			<Container>
				<Formik
					initialValues={init}
					validationSchema={validate}
					validateOnChange={false}
					onSubmit={(values, { resetForm }) => { newUser(values, resetForm) }}
				>
					{({ errors, values }) => (
						<Form>
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<Typography variant="h4" sx={{ marginBottom: '1rem' }}>New User</Typography>
								</Grid>
								<Grid item xs={16}>
									<TextInput name="firstName" label="First Name" size="small" />
								</Grid>
								<Grid item xs={16}>
									<TextInput name="lastName" label="Last Name" size="small" />
								</Grid>
								<Grid item xs={16}>
									<TextInput name="email" label="Email Address" size="small" />
								</Grid>
								<Grid item xs={16}>
									<FormControl component="fieldset">
										<FormLabel>User role</FormLabel>
										<FormGroup row>
											<Checkbox name="designation" label="Admin" value="admin" />
											<Checkbox name="designation" label="Cashier" value="Cashier" />
										</FormGroup>
									</FormControl>
									{ errors.designation && <p className='errorText'>{errors.designation}</p> }
								</Grid>
								<Grid item xs={16}>
									<TextInput name="username" label="User ID" size="small" />
								</Grid>
								<Grid item xs={12}>
									<TextInput type="password" name="passcode" label="Password" size="small" />
								</Grid>
								<Grid item xs={12}>
									<Button disabled={loading} type="submit" variant="contained" fullWidth sx={{ height: '3rem', fontWeight: 600 }}>
										{ loading ? <Typography sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Please wait <CircularProgress size="1rem" /></Typography> : "Create User" }
									</Button>
								</Grid>
							</Grid>
						</Form>
					)}
				</Formik>
			</Container>
		</Wrapper>
	)
}

export default NewUser;

const Wrapper = styled.section`
	height: 100vh;
	padding: 1rem;
	background-color: #E5E5E5;
	display: grid;
	place-items: center;
`;
const Container = styled.div`
	box-shadow: 0px 0px 5px 1px rgba(0,0,0,0.1);
	padding: 3rem 1.5rem;
	width: 100%;
	max-width: 400px;
`;