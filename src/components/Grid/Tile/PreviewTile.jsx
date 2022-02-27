import PropTypes from 'prop-types';
// Material UI functions
import { makeStyles } from '@material-ui/core';
// Material UI components
import { Box } from '@material-ui/core';
// Components
import TileLabel from './TileLabel';

const PreviewTile = ({ editBoard, tileData, labelPosition, onPreviewTileClick }) => {
	const ImageData =
		tileData.image_id && editBoard.images.find((image) => image.id.toString() === tileData.image_id.toString());
	// Styling
	const useStyles = makeStyles((theme) => ({
		PreviewTile: {
			display: 'flex',
			flexDirection: 'column',
			backgroundColor: tileData && tileData.background_color,
			borderColor: tileData && tileData.border_color,
			borderStyle: 'solid',
			borderWidth: '2px',
			textAlign: 'center',
			flex: '1 1',
			cursor: 'pointer',
			'&:hover': {
				borderColor: tileData && 'black',
				boxShadow: '0 0 15px rgba(0, 0, 0, 0.25) inset',
			},
			'&:active': {
				boxShadow: '0 0 15px rgba(0, 0, 0, 0.50) inset',
			},
		},
		TileImage: {
			width: '100%',
			padding: theme.spacing(1),
		},
	}));
	const classes = useStyles();

	let tile = <Box />;
	// If the tile is non-empty, populate the element
	if (tileData) {
		tile = (
			<Box className={classes.PreviewTile} onClick={onPreviewTileClick}>
				{labelPosition === 'above' && <TileLabel tile={tileData} />}
				<img
					className={classes.TileImage}
					draggable='false'
					src={
						ImageData
							? ImageData.url
								? ImageData.url
								: ImageData.data
							: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
					}
					alt='Tile Symbol'
				/>
				{labelPosition === 'below' && <TileLabel tile={tileData} />}
			</Box>
		);
	}
	return tile;
};

PreviewTile.propTypes = {
	tileData: PropTypes.object.isRequired,
	labelPosition: PropTypes.string.isRequired,
	editBoard: PropTypes.object.isRequired,
	onPreviewTileClick: PropTypes.func.isRequired,
};

export default PreviewTile;
