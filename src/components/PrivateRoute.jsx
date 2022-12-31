import { Navigate, Outlet } from 'react-router-dom';
import Layout from './Layout';

const PrivateRoute = () => {
	const token = localStorage.getItem('token');
	return (
		token ? <Layout><Outlet /></Layout> : <Navigate to="/auth/login" />
	)
}

export default PrivateRoute;