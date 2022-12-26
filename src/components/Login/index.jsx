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

	const [error, setError] = React.useState({ usrname: null, passcode: null });
	
	const login = async (data) => {
		setLoading(true);
		try {
			const config = {
				url: 'http://localhost:5500/api/auth/login',
				method: 'POST',
				data: data
			}
			const response = await axios(config);
			if(response.data.status === 1) {
				localStorage.setItem('user', JSON.stringify(response.data.user));
				localStorage.setItem('token', response.data.token);
				navigate("/");
			} else {
				if(response.data.message.split(' ').includes('User')) {
					setError({ usrname: response.data.message, passcode: null })
					setLoading(false);
				} else {
					setError({ usrname: null, passcode: response.data.message });
					setLoading(false);
				}
			}
		} catch (error) {
			setLoading(false);
			toast.error(error.status + ": an eror has ocurred!");
		}
	}

	return (
		<Wrapper>
			<Container>
				<Formik
					initialValues={init}
					validationSchema={validate}
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
									{ error.usrname && <p className='errorText'>{error.usrname}</p>}
								</Grid>
								<Grid item xs={12}>
									<TextInput type="password" name="passcode" label="Password" />
									{ error.passcode && <p className='errorText'>{error.passcode}</p>}
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