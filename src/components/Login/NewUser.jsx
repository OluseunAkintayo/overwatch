import React from 'react';
import styled from '@emotion/styled';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Button, CircularProgress, Grid, Typography } from '@mui/material';
import { SelectMenu, TextInput } from '../../lib';
import { customAlphabet } from 'nanoid';
import { toast } from 'react-toastify';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const NewUser = () => {
	React.useEffect(() => {
		document.title = "Overwatch: New User";
		return () => null;
	}, []);

	const init = {
		firstName: '',
		lastName: '',
		email: '',
		designation: '',
		username: '',
		passcode: ''
	}

	const validate = Yup.object().shape({
		firstName: Yup.string().required('First name is required'),
		lastName: Yup.string().required('Last name is required'),
		email: Yup.string().email().required('Email is required'),
		designation: Yup.string().required('Email is required'),
		username: Yup.string().required('Username is required'),
		passcode: Yup.string().required('Password is required'),
	});

	const [id, setId] = React.useState(null);
	const [loading, setLoading] = React.useState(false);
	const generateCode = () => {
		const nanoid = customAlphabet('1234567890zxcvbnmasdfghjklqwertyuiop', 16);
		const uid = nanoid();
		setId(uid);
	}

	React.useEffect(() => {
		generateCode();
	}, []);

	const userOptions = [
		{ name: "Super Admin", value: "Super Admin" },
		{ name: "Admin", value: "Admin" },
		{ name: "Cashier", value: "Cashier" },
	];
	
	const login = async (data, resetForm) => {
		setLoading(true);
		const payload = {
			...data,
			id: id,
			created: new Date().toISOString(),
			lastUpdated: new Date().toISOString(),
		}
		const config = {
			url: 'users',
			method: 'POST',
			data: payload
		}
		try {
			const res = await axios(config);
			if(res.status === 201) {
				setTimeout(async () => {
					setLoading(false);
					resetForm({ data: '' });
					toast.success("User added successfully!");
				}, 1500);
			}
		} catch (error) {
			console.error({error});
			setLoading(false);
			toast.error("Error adding user! Try again");
		}
	}

	return (
		<Wrapper>
			<Container>
				<Formik
					initialValues={init}
					validationSchema={validate}
					validateOnChange={false}
					onSubmit={(values, { resetForm }) => { login(values, resetForm) }}
				>
					{() => (
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
									<SelectMenu options={userOptions} name="designation" label="User Designation" size="small" />
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