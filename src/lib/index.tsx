import styled from '@emotion/styled';
import { CancelPresentation } from '@mui/icons-material';
import { Box, Divider, Tooltip, Typography } from '@mui/material';
import React from 'react';
import Modal from 'react-responsive-modal';

interface ModalProps {
	open: boolean;
	close: () => void;
	modalClass: string;
	children: React.ReactNode;
}

interface ModalTitleProps {
	title: string;
}

export const ModalWrapper = ({ open, close, modalClass, children }: ModalProps) => {
	const closeBtn = (
		<Tooltip placement='top' title='Close' onClick={close}>
			<CancelPresentation sx={{ color: 'rgba(0, 0, 0, 0.4)', fontSize: '2rem' }} />
		</Tooltip>
	)

	return (
		<Modal center open={open} onClose={() => null} classNames={{ modal: modalClass }} closeIcon={closeBtn}>
			{ children }
		</Modal>
	)
}

export const ModalTitle = ({ title }: ModalTitleProps) => {
	return (
		<Box>
			<Typography variant="h4" fontWeight={900} fontSize="1.25rem">{title}</Typography>
			<Divider />
		</Box>
	)
}

export const ModalBody = styled.div`
	padding: 1rem;
	position: relative;
	height: 100%;
`;

const TitleWrapper = styled.div`
	border-bottom: 0.5px solid rgba(0, 0, 0, 0.3);
	padding: 0.5rem 1rem;
	margin-bottom: 1rem;
`;

interface TitleBarProps {
	text: string;
}

export const TitleBar = ({ text }: TitleBarProps) => {
	return (
		<TitleWrapper>
			<Typography variant="h6">{text}</Typography>
		</TitleWrapper>
	)
}


// formik
