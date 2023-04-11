import { Box, Typography } from '@mui/material'
import React from 'react'
import { BarChart as BarChartIcon } from '@mui/icons-material';

interface ChartProps {
	description: string | React.ReactNode;
	value: number;
}

const BarChart = ({ description, value }: ChartProps) => {
	return (
		<Box sx={{ padding: '1rem', background: '#f5f5f5', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0px 3px 14px 2px rgb(0 0 0 / 20%)', cursor: 'pointer', transition: 'all ease-in-out 0.2s', '&:hover': { transform: 'scale(1.025)' } }}>
			<Box>
				<BarChartIcon sx={{ fontSize: '6rem', color: 'teal' }} />
				<Box sx={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
					<Typography variant="h4" sx={{ textAlign: 'center' }}>{value}</Typography>
					<Typography variant="h6" sx={{ lineHeight: '90%', fontSize: 12, fontWeight: 400 }}>{description}</Typography>
				</Box>
			</Box>
		</Box>
	)
}

export default BarChart;