import React from 'react';
import Header from './Header';

const Layout = ({ children }) => {
	return (
		<React.Fragment>
			<Header />
			<main>{ children }</main>
		</React.Fragment>
	)
}

export default Layout;