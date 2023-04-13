import { Container } from '@mui/material';
import React, { ReactNode } from 'react';
import Header from './Header';

interface Props {
	children: ReactNode
}

const Layout = ({ children }: Props) => {
	return (
		<React.Fragment>
			<Header />
			<Container sx={{ pl: { xs: 2 }, pr: { xs: 2 }, pt: { xs: 1 }, pb: { xs: 0 }, height: 'calc(100vh - 64px)', overflowY: 'auto' }} maxWidth="sl">
				{ children } 
			</Container>
		</React.Fragment>
	)
}

export default Layout;
