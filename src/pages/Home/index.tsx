import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import BarChart from './BarChart';

const Home = () => {
	return (
		<Box>
			<Grid container spacing={3}>
				<Grid item xs={4}>
					<BarChart value={400} description={<>Active<br />Products</>} />
				</Grid>
				<Grid item xs={4}>
					<BarChart value={12005} description={<>Completed<br />Transactions</>} />
				</Grid>
				<Grid item xs={4}>
					<BarChart value={2301} description={<>Active<br />Customers</>} />
				</Grid>
				<Grid item xs={4}>
					<BarChart value={7125} description={<>Products<br />Sold</>} />
				</Grid>
				<Grid item xs={4}>
					<BarChart value={89} description={<>New users<br />Everyday</>} />
				</Grid>
				<Grid item xs={4}>
					<BarChart value={4000} description={<>Feedbacks<br />Provided</>} />
				</Grid>
			</Grid>
			<Box sx={{ height: '2rem' }} />
			<Typography variant="h5">Recent Transactions</Typography>
			<Box>
				<Typography>Coming soon...</Typography>
			</Box>
		</Box>
	)
}

export default Home;
