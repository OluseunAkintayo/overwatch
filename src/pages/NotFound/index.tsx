import React from 'react';
import styled from '@emotion/styled';

const ErrorPage = () => {
	return (
		<Container>
			<div className="centeredContent">
				<div>
					<h2>404 Error</h2>
					<p>Oops! The resource you requested is not available</p>
				</div>
			</div>
		</Container>
	)
}

export default ErrorPage;

const Container = styled.div`
	min-height: calc(100vh - 96px);
	.centeredContent {
		height: 100%;
		width: 100%;
		display: grid;
		place-items: center;
		h2 {
			text-align: center;
			color: red;
			font-size: 1.5rem;

		}
	}
`;
