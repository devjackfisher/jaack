import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// Material UI functions
import { makeStyles } from '@material-ui/core';
// Material UI components
import {
	Dialog,
	DialogTitle,
	FormControl,
	Select,
	MenuItem,
	Slider,
	Typography,
	Grid,
	Box,
	Button,
	Switch,
} from '@material-ui/core';
// Material UI icons
import { VolumeUp, Speed } from '@material-ui/icons';

const Settings = (props) => {
	// Deconstruct props
	const {
		settingsOpen,
		onCloseSettings,
		voices,
		settingsVoice,
		setVoice,
		volume,
		setVolume,
		rate,
		setRate,
		labelPosition,
		setLabelPosition,
		vocalizeFolders,
		setVocalizeFolders,
	} = props;
	// Styling
	const useStyles = makeStyles((theme) => ({
		DialogContent: {
			paddingBottom: theme.spacing(2),
			paddingLeft: theme.spacing(3),
			paddingRight: theme.spacing(3),
		},
		DialogItem: {
			width: '100%',
			marginBottom: '16px',
		},
		Button: {
			marginLeft: theme.spacing(1),
		},
	}));
	const classes = useStyles();

	let defaultVoice = voices.find((voice) => voice.lang === navigator.language);
	if (!defaultVoice) {
		defaultVoice = voices.find((voice) => voice.default === true);
	}
	if (!defaultVoice) {
		defaultVoice = voices[0];
	}
	const currentVoice = voices.find((voice) => voice.voiceURI === settingsVoice);
	const [voiceValue, setVoiceValue] = useState();
	const [volumeValue, setVolumeValue] = useState(volume);
	const [rateValue, setRateValue] = useState(rate);
	const [labelPositionValue, setLabelPositionValue] = useState(labelPosition);
	const [vocalizeFoldersValue, setVocalizeFoldersValue] = useState(vocalizeFolders);

	let changesMade = false;
	if (
		currentVoice
			? voiceValue !== currentVoice
			: voiceValue !== defaultVoice ||
			  volumeValue !== volume ||
			  rateValue !== rate ||
			  labelPositionValue !== labelPosition ||
			  vocalizeFoldersValue !== vocalizeFolders
	) {
		changesMade = true;
	}

	const handleVoiceChange = (event) => {
		setVoiceValue(event.target.value);
	};
	const handleVolumeChange = (_event, value) => {
		setVolumeValue(value);
	};
	const handleRateChange = (_event, value) => {
		setRateValue(value);
	};
	const handleLabelPositionChange = (event) => {
		setLabelPositionValue(event.target.value);
	};
	const handleVocalizeFolderChange = (event) => {
		setVocalizeFoldersValue(event.target.checked);
	};

	const resetSettings = () => {
		setVoiceValue(currentVoice ? currentVoice : defaultVoice);
		setVolumeValue(volume);
		setRateValue(rate);
		setLabelPositionValue(labelPosition);
		setVocalizeFoldersValue(vocalizeFolders);
	};

	const saveSettings = () => {
		setVoice(voiceValue.voiceURI);
		setVolume(volumeValue);
		setRate(rateValue);
		setLabelPosition(labelPositionValue);
		setVocalizeFolders(vocalizeFoldersValue);
		onCloseSettings();
	};

	useEffect(() => {
		setVoiceValue(currentVoice ? currentVoice : defaultVoice);
		setVolumeValue(volume);
		setRateValue(rate);
		setLabelPositionValue(labelPosition);
		setVocalizeFoldersValue(vocalizeFolders);
	}, [currentVoice, defaultVoice, volume, rate, labelPosition, vocalizeFolders]);

	return (
		<Dialog fullWidth={true} onClose={onCloseSettings} open={settingsOpen}>
			<DialogTitle>Settings</DialogTitle>
			<Box className={classes.DialogContent}>
				<FormControl className={classes.DialogItem}>
					<Typography gutterBottom>Voice:</Typography>
					<Select value={voiceValue} onChange={handleVoiceChange}>
						{voices &&
							voices.map((voice, voiceIndex) => (
								<MenuItem key={voiceIndex} value={voice}>
									{voice.name}
								</MenuItem>
							))}
					</Select>
				</FormControl>
				<Box className={classes.DialogItem}>
					<Typography gutterBottom>Volume:</Typography>
					<Grid container spacing={3}>
						<Grid item>
							<VolumeUp />
						</Grid>
						<Grid item xs>
							<Slider min={0} max={1} step={0.05} value={volumeValue} onChange={handleVolumeChange} />
						</Grid>
					</Grid>
				</Box>
				<Box className={classes.DialogItem}>
					<Typography gutterBottom>Rate:</Typography>
					<Grid container spacing={3}>
						<Grid item>
							<Speed />
						</Grid>
						<Grid item xs>
							<Slider min={0} max={2} step={0.1} value={rateValue} onChange={handleRateChange} />
						</Grid>
					</Grid>
				</Box>
				<FormControl className={classes.DialogItem}>
					<Typography gutterBottom>Label Position:</Typography>
					<Select value={labelPositionValue} onChange={handleLabelPositionChange}>
						<MenuItem value='above'>Above</MenuItem>
						<MenuItem value='below'>Below</MenuItem>
						<MenuItem value='none'>None</MenuItem>
					</Select>
				</FormControl>
				<Box className={classes.DialogItem}>
					<Typography gutterBottom>Vocalize Folders:</Typography>
					<Switch checked={vocalizeFoldersValue} onChange={handleVocalizeFolderChange} color='primary' />
				</Box>
				<Grid className={classes.DialogItem} container justifyContent='flex-end'>
					<Button
						className={classes.Button}
						disabled={!changesMade}
						variant='contained'
						color='primary'
						size='small'
						onClick={resetSettings}
					>
						Reset
					</Button>
					<Button className={classes.Button} variant='contained' color='primary' size='small' onClick={saveSettings}>
						Save
					</Button>
				</Grid>
			</Box>
		</Dialog>
	);
};

Settings.propTypes = {
	settingsOpen: PropTypes.bool.isRequired,
	voices: PropTypes.array.isRequired,
	settingsVoice: PropTypes.string,
	setVoice: PropTypes.func.isRequired,
	volume: PropTypes.number.isRequired,
	setVolume: PropTypes.func.isRequired,
	rate: PropTypes.number.isRequired,
	setRate: PropTypes.func.isRequired,
	labelPosition: PropTypes.string.isRequired,
	setLabelPosition: PropTypes.func.isRequired,
	vocalizeFolders: PropTypes.bool.isRequired,
	setVocalizeFolders: PropTypes.func.isRequired,
};

export default Settings;
