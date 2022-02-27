import PropTypes from 'prop-types';
// Material UI functions
import { makeStyles } from '@material-ui/core';
// Material UI components
import { Box } from '@material-ui/core';
// Components
import TileLabel from './TileLabel';
import TileImage from './TileImage';

const EditableTile = (props) => {
	const { editBoard, editTile, setEditTile, labelPosition, tileId, tilePosition, swapTiles } = props;
	const TileData = editBoard.buttons.find((button) => button.id.toString() === tileId);
	// Styling
	const useStyles = makeStyles((theme) => ({
		TileContainer: {
			display: 'flex',
			position: 'relative',
			flex: '1 1',
			margin: '4px',
			flexDirection: 'column',
		},
		Tile: {
			position: 'relative',
			display: 'flex',
			flex: '1 1',
			flexDirection: 'column',
			backgroundColor: TileData && TileData.background_color,
			borderColor: TileData && TileData.border_color,
			borderStyle: 'solid',
			borderWidth: '2px',
			opacity: '25%',
			cursor: 'pointer',
			margin: '4px',
			'&:hover': {
				opacity: '75%',
			},
		},
		EmptyTileContainer: {
			display: 'flex',
			position: 'relative',
			margin: '4px',
		},
		EmptyTile: {
			margin: '4px',
			opacity: '25%',
			cursor: 'pointer',
			borderColor: 'black',
			borderStyle: 'dotted',
			borderWidth: '2px',
			'&:hover': {
				opacity: '75%',
			},
		},
		selectedTile: {
			opacity: '100%',
			'&:hover': {
				opacity: '100%',
			},
		},
		ButtonGroup: {
			position: 'absolute',
			right: '4px',
			bottom: '4px',
		},
		Button: {
			margin: theme.spacing(1),
		},
	}));
	const classes = useStyles();

	let tile = <Box />;
	if (TileData) {
		tile = (
			<Box
				className={`${classes.Tile} ${
					JSON.stringify(editTile.position) === JSON.stringify(tilePosition) && classes.selectedTile
				}`}
				onClick={() =>
					Object.keys(editTile).length ? swapTiles(tilePosition) : setEditTile({ ...TileData, position: tilePosition })
				}
			>
				{labelPosition === 'above' && <TileLabel tile={TileData} />}
				<TileImage board={editBoard} tile={TileData} />
				{labelPosition === 'below' && <TileLabel tile={TileData} />}
			</Box>
		);
	} else {
		tile = (
			<Box
				className={`${classes.EmptyTile} ${
					JSON.stringify(editTile.position) === JSON.stringify(tilePosition) && classes.selectedTile
				}`}
				onClick={() =>
					Object.keys(editTile).length ? swapTiles(tilePosition) : setEditTile({ ...TileData, position: tilePosition })
				}
			></Box>
		);
	}
	return tile;
};

EditableTile.propTypes = {
	editBoard: PropTypes.object.isRequired,
	editTile: PropTypes.object.isRequired,
	setEditTile: PropTypes.func.isRequired,
	labelPosition: PropTypes.string.isRequired,
	tileId: PropTypes.string,
	tilePosition: PropTypes.array.isRequired,
	swapTiles: PropTypes.func.isRequired,
};

export default EditableTile;
