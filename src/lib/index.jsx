import { TextField, MenuItem, FormControl, FormControlLabel, FormGroup, Checkbox as MuiCheckbox, Tooltip, Typography } from '@mui/material';
import { useField, useFormikContext } from 'formik';
import Modal from 'react-responsive-modal';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import styled from '@emotion/styled';

export const TextInput = ({ name, ...props }) => {
	const [field, meta] = useField(name);
	const config = { ...props, ...field, fullWidth: true, variant: 'outlined' };
	if(meta && meta.error && meta.touched) {
		config.error = true;
		config.helperText = meta.error;
	}
	return <TextField {...config} />;
}

export const Check = ({ name, label, legend, ...others }) => {

	const { setFieldValue } = useFormikContext();
	const [field] = useField(name);
	const handleChange = e => {
		const { checked } = e.target;
		setFieldValue(name, checked);
	}
	const config = {
		...field, ...others,
		onChange: handleChange
	}

	return (
		<FormControl>
			<FormGroup>
				<FormControlLabel
					control={<MuiCheckbox {...config}  />}
					label={label}
				>
				</FormControlLabel>
			</FormGroup>
		</FormControl>
	)
}

export const SelectMenu = ({ name, options, ...props }) => {
	const { setFieldValue } = useFormikContext();
	const [field, meta] = useField(name);
	const handleChange = e => setFieldValue(name, e.target.value);

	const config = {
		...field,
		...props,
		select: true,
		variant: 'outlined',
		fullWidth: true,
		onChange: handleChange
	}
	if(meta && meta.error && meta.touched) {
		config.error = true;
		config.helperText = meta.error;
	}

	return <TextField {...config}>
		{
			options.map(item => (
				<MenuItem key={item.id} value={item.value}>{item.name}</MenuItem>
			))
		}
	</TextField>
}

export const ModalWrapper = (props) => {
	const { open, close, modalClass, children } = props;
	const closeBtn = (
		<Tooltip placement='left' title="Close" onClick={close}>
			<CancelPresentationIcon sx={{ color: 'rgba(0, 0, 0, 0.4)', fontSize: '2rem' }} />
		</Tooltip>
	);

	return (
		<Modal center open={open} onClose={() => null} classNames={{ modal: modalClass }} closeIcon={closeBtn}>
			{ children }
		</Modal>
	)
}

export const ModalBody = styled.div`
	padding: 1rem;
`;

const FormHeader = styled.div`
	border-bottom: 1px solid rgba(0, 0, 0, 0.2);
	height: 3rem;
	margin-bottom: 2rem;
	display: flex;
	align-items: center;
`;
const FormTitle = styled.h2`
	font-weight: 900;
	font-size: 1.25rem;
	/* color: #333333; */
	color: rgba(0, 0, 0, 0.87);
`;

export const ModalTitle = ({ title }) => {
	return (
		<FormHeader>
			<FormTitle>{title}</FormTitle>
		</FormHeader>
	)
}

const TitleWrapper = styled.div`
	border-bottom: 0.5px solid rgba(0, 0, 0, 0.3);
	padding: 0.5rem 1rem;
	margin-bottom: 1rem;
`;

export const TitleBar = ({ text }) => {
	return (
		<TitleWrapper>
			<Typography variant="h6">{text}</Typography>
		</TitleWrapper>
	)
}
