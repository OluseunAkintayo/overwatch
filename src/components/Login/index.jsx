import React from 'react';
import styled from '@emotion/styled';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Button, CircularProgress, Grid, Typography } from '@mui/material';
import { TextInput } from '../../lib';
import { customAlphabet } from 'nanoid';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import CryptoJS from 'crypto-js';

const Login = () => {
	const navigate = useNavigate();
	React.useEffect(() => {
		document.title = "Overwatch: Login";
		return () => null;
	}, []);

	const init = {
		username: '',
		passcode: ''
	}

	const validate = Yup.object().shape({
		username: Yup.string().required('Username is required'),
		passcode: Yup.string().required('Password is required'),
	})

	const [id, setId] = React.useState(null);
	const [loading, setLoading] = React.useState(false);
	const generateCode = () => {
		const nanoid = customAlphabet('1234567890zxcvbnmasdfghjklqwertyuiop@#$%&', 256);
		const pid = nanoid();
		setId(pid);
	}

	React.useEffect(() => {
		generateCode();
	}, []);
	
	const login = async (data) => {
		setLoading(true);
		const response = await axios.get(`/users?username=${data.username}`);
		if(response?.data?.length === 1) {
			if(response.data[0].passcode === data.passcode){
				localStorage.setItem('token', id);
				setTimeout(() => {
					navigate("/");
				}, 1500);
			} else {
				if(response.data[0].passcode !== data.passcode) {
					setTimeout(() => {
						setLoading(false);
						toast.error("Incorrect password, please check again.");
					}, 1500);
				}
			}
		} else if(response?.data?.length === 0) {
			setTimeout(() => {
				toast.error("Provided username does not exist");
				setLoading(false);
			}, 1000);
		}
	}

	return (
		<Wrapper>
			<Container>
				<Formik
					initialValues={init}
					validationSchema={validate}
					validateOnChange={false}
					onSubmit={(values) => { login(values) }}
				>
					{() => (
						<Form>
							<Grid container spacing={3}>
								<Grid item xs={12}>
									<Typography variant="h5">Login</Typography>
								</Grid>
								<Grid item xs={12}>
									<TextInput name="username" label="User ID" />
								</Grid>
								<Grid item xs={12}>
									<TextInput type="password" name="passcode" label="Password" />
								</Grid>
								<Grid item xs={12}>
									<Button disabled={loading} type="submit" variant="contained" fullWidth sx={{ height: '3rem', fontWeight: 600 }}>
										{ loading ? <Typography sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Please wait <CircularProgress size="1rem" /></Typography> : "Login" }
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

export default Login;

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
	min-width: 300px;
`;