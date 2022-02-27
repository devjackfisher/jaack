import PropTypes from 'prop-types';
// Material UI functions
import { makeStyles } from '@material-ui/core';
// Material UI components
import { Box, Typography } from '@material-ui/core';

const SentenceSymbol = (props) => {
	// Deconstruct props
	const { text, image } = props;
	// Styling
	const useStyles = makeStyles({
		Symbol: {
			minWidth: `${100 / 6}%`,
			display: 'flex',
			flexDirection: 'column',
		},
		Label: {
			overflow: 'hidden',
			textOverflow: 'ellipsis',
		},
		Image: {
			flex: '1 1 auto',
			// Use a container with a background image for proper scaling
			backgroundImage: image ? (image.url ? `url("${image.url}")` : `url(${image.data})`) : 'none',
			backgroundSize: 'contain',
			backgroundRepeat: 'no-repeat',
			backgroundPosition: 'center',
		},
	});
	const classes = useStyles();
	return (
		<Box p={1} className={classes.Symbol}>
			{text && <Typography className={classes.Label}>{text}</Typography>}
			{image && <Box className={classes.Image} />}
		</Box>
	);
};

SentenceSymbol.propTypes = {
	text: PropTypes.string.isRequired,
	image: PropTypes.object,
};

export default SentenceSymbol;
