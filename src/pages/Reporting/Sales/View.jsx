import { Box, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React from 'react'
import { ModalTitle, ModalWrapper } from '../../../lib';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const View = ({ open, close, data }) => {
	// console.log(data);
	const btnStyle = {
		height: '3rem'
	}

	const CellText = ({ text, weight }) => (
		<Typography variant="h5" sx={{ fontSize: 12, fontWeight: weight ? weight : 600, textTransform: 'capitalize' }}>{text}</Typography>
	);

	return (
		<ModalWrapper open={open} close={close}  modalClass={'newProductModal'}>
			<ModalTitle title="Transaction Details" />
			<Grid container spacing={2}>
				<Grid item xs={6}>
					<CellText text={`Transaction ID: ${data.transactionId}`} />
				</Grid>
				<Grid item xs={6}>
					<CellText text={`Cashier: ${data.user}`} />
				</Grid>
				<Grid item xs={6}>
				</Grid>
				<Grid item xs={12}>
					<TableContainer component={Box} sx={{ width: '100%', height: '30vh', border: '1px solid rgba(0, 0, 0, 0.3)', borderRadius: '0.25rem' }}>
						<Table stickyHeader size="small">
							<TableHead>
								<TableRow>
									<TableCell align="center"><CellText text="Quantity" /></TableCell>
									<TableCell sx={{ padding: '1rem' }}><CellText text="Product Name" /></TableCell>
									<TableCell align="right"><CellText text="Cost" /></TableCell>
									<TableCell align="right"><CellText text="Item Total" /></TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{data.products?.map(item => (
									<TableRow key={item._id}>
										<TableCell align="center"><CellText text={item.orderQty} weight={400} /></TableCell>
										<TableCell><CellText text={item.name} weight={400} /></TableCell>
										<TableCell align="right"><CellText text={Number(item.pricing.retail).toLocaleString()} weight={400} /></TableCell>
										<TableCell align="right"><CellText text={(Number(item.pricing.retail) * item.orderQty).toLocaleString()} weight={400} /></TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Grid>
				<Grid item xs={12}>
					<CellText text={`Total: ₦${data.transactionTotal.toLocaleString()}`} />
				</Grid>
				<Grid item xs={4}>
					<CellText text={`PaymentMode: ${data.paymentMode}`} weight={400} />
				</Grid>
				<Grid item xs={4}>
					<CellText text={`Bank/Issuer: ${data.bank}`} weight={400} />
				</Grid>
				<Grid item xs={4}>
					<CellText text={`Reference ID: ${data.referenceNumber}`} weight={400} />
				</Grid>
				<Grid item xs={12}>
					<Grid container spacing={2} sx={{ marginTop: 0, marginBottom: 3 }}>
						<Grid item xs={6}>
							<Button sx={btnStyle} variant="outlined" fullWidth>
								<FileDownloadIcon />
								download PDF
							</Button>
						</Grid>
						<Grid item xs={6}>
							<Button sx={btnStyle} onClick={close} variant="outlined" fullWidth>Close</Button>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</ModalWrapper>
	)
}

export default View;