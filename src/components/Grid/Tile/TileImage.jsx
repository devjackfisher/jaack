import PropTypes from 'prop-types';
// Material UI functions
import { makeStyles } from '@material-ui/core';
// Material UI components
import { Box } from '@material-ui/core';

const TileImage = (props) => {
	// Deconstruct props
	const { board, tile } = props;
	const ImageData = tile.image_id && board.images.find((image) => image.id.toString() === tile.image_id.toString());
	// Styling
	const useStyles = makeStyles((theme) => ({
		TileImage: {
			flex: '1 1',
			margin: theme.spacing(1),
			// Use a container element with a background image for proper scaling
			backgroundImage: ImageData ? (ImageData.url ? `url("${ImageData.url}")` : `url(${ImageData.data})`) : 'none',
			backgroundSize: 'contain',
			backgroundRepeat: 'no-repeat',
			backgroundPosition: 'center',
		},
	}));
	const classes = useStyles();
	return <Box className={classes.TileImage}></Box>;
};

TileImage.propTypes = {
	board: PropTypes.object.isRequired,
	tile: PropTypes.object.isRequired,
};

export default TileImage;
