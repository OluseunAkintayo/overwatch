import React from 'react';
import * as Yup from 'yup';
import { Box, Button, CircularProgress, Container, FormControl, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useFormik } from 'formik';
import FormikErrorFocus from 'formik-error-focus';

interface User {
	username: string;
	passcode: string;
}

const style = {
	container: {
		width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'
	},
	form: {
		width: '100%', maxWidth: '420px', boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px', p: 4, borderRadius: 1
	}
}

const initialValues: User = { username: '', passcode: '' };

const validationSchema = Yup.object().shape({
	username: Yup.string().required('Username is required'),
	passcode: Yup.string().required('Password is required'),
});

const Login: React.FC = () => {
	const [loading, setLoading] = React.useState<boolean>(false);
	const [showPassword, setShowPassword] = React.useState<boolean>(false);
	const [error, setError] = React.useState<string | null>(null);
	const navigate = useNavigate();

	React.useEffect((): () => void => {
		document.title = "Overwatch: Login";
		return () => null;
	}, []);

	const login = async (data: User) => {
		setLoading(true);
		try {
			const config = {
				url: 'auth/login',
				method: 'POST',
				data: data
			}
			const response = await axios(config);
			if(response.status === 200 && response.data.status === 1) {
				setLoading(false);
				setError(null);
				localStorage.setItem('user', JSON.stringify(response.data.data.user));
				localStorage.setItem('token', response.data.data.token);
				localStorage.setItem('tokenExpiryDate', response.data.data.tokenExpiryDate);
				navigate("/");
			} else if(response.status === 200 && response.data.status === 0) {
				if(response.data.message.includes('username')) {
					setError("Incorrect username.");
					setLoading(false);
				} else if(response.data.message.includes('password')) {
					setError("Incorrect password.");
					setLoading(false);
				}
			}
		} catch (error: any) {
			setLoading(false);
			toast.error(error.status + ": an eror has ocurred!");
		}
	}

	const formik = useFormik({
		initialValues, validationSchema, validateOnChange: false,
		onSubmit: (values) => login(values)
	});

	const { handleSubmit, handleChange, touched, errors, values: { username, passcode } } = formik;

	return (
		<Container sx={style.container} maxWidth="sl">
			<Box sx={style.form} component="form" autoComplete="off" onSubmit={handleSubmit}>
				<Grid container spacing={3}>
					<Grid item xs={12}>
						<Typography variant="h5">Login</Typography>
					</Grid>
					<Grid item xs={12}>
						<TextField
							name="username" id="username" label="Username" fullWidth
							value={username} onChange={handleChange}
							error={touched.username && Boolean(errors.username)}
							helperText={touched.username && errors.username}
						/>
					</Grid>
					<Grid item xs={12}>
						<FormControl fullWidth variant="outlined">
							<InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
							<OutlinedInput
								name="passcode" id="passcode" label="Passcode" fullWidth
								value={passcode} onChange={handleChange}
								error={touched.passcode && Boolean(errors.passcode)}
								type={showPassword ? 'text' : 'password'}
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											aria-label="toggle password visibility"
											onClick={() => setShowPassword(!showPassword)}
											edge="end"
										>
											{showPassword ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								}
							/>
						</FormControl>
						{ errors.passcode && <span className="errorText">{errors.passcode}</span> }
						{ error && <span className="errorText">{error}</span> }
					</Grid>
					<Grid item xs={12}>
						<Button disabled={loading} type="submit" variant="contained" fullWidth sx={{ height: '3rem', fontWeight: 600 }}>
							{ loading ? <Typography sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Please wait <CircularProgress size="1rem" /></Typography> : "Login" }
						</Button>
					</Grid>
				</Grid>
			</Box>
		</Container>
	)
}

export default Login;
