import PropTypes from 'prop-types';
// Material UI functions
import { makeStyles } from '@material-ui/core';
// Material UI components
import { Typography } from '@material-ui/core';

const TileLabel = (props) => {
	// Deconstruct props
	const { tile } = props;
	// Styling
	const useStyles = makeStyles({
		TileLabel: {
			overflow: 'hidden',
			textOverflow: 'ellipsis',
		},
	});
	const classes = useStyles();
	return <Typography className={classes.TileLabel}>{tile.label}</Typography>;
};

TileLabel.propTypes = {
	tile: PropTypes.object.isRequired,
};

export default TileLabel;
