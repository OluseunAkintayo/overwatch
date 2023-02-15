import { Container } from '@mui/material';
import React, { ReactNode } from 'react';
import Header from './Header';

interface Props {
	children: ReactNode
}

const Layout = (props: Props) => {
	return (
		<React.Fragment>
			<Header />
			<Container sx={{ pl: { xs: 2 }, pr: { xs: 2 }, py: { xs: 2 }, height: 'calc(100vh - 64px)', overflowY: 'auto' }} maxWidth="sl">
				{ props.children } 
			</Container>
		</React.Fragment>
	)
}

export default Layout;