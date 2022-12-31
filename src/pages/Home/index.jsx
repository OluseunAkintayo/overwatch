import React from 'react';
import { Grid } from '@mui/material';
import BarChart from './BarChart';
import styled from 'styled-components';

const Container = styled.div`
	padding: 1rem;
`;

const index = () => {
	return (
		<Container>
			<Grid container spacing={3}>
				<Grid item xs={4}>
					<BarChart />
				</Grid>
			</Grid>
		</Container>
	)
}

export default index;