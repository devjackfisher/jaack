import PropTypes from 'prop-types';
// Material UI functions
import { makeStyles } from '@material-ui/core';
// Material UI components
import { Box } from '@material-ui/core';
// Components
import TileLabel from './TileLabel';
import TileImage from './TileImage';

const Tile = (props) => {
	// Deconstruct props
	const {
		board,
		archive,
		onClickTile,
		onClickFolder,
		onClickSentence,
		openRootBoard,
		onClearSentence,
		onPopSentence,
		tileId,
		labelPosition,
		vocalizeFolders,
	} = props;
	const TileData = board.buttons.find((button) => button.id.toString() === tileId);
	// Styling
	const useStyles = makeStyles({
		Tile: {
			visibility: TileData && TileData.hidden ? 'hidden' : 'visible',
			position: 'relative',
			display: 'flex',
			flexDirection: 'column',
			backgroundColor: TileData && TileData.background_color,
			borderColor: TileData && TileData.border_color,
			borderStyle: 'solid',
			borderWidth: '2px',
			margin: '4px',
			cursor: 'pointer',
			'&:hover': {
				borderColor: TileData && 'black',
				boxShadow: '0 0 15px rgba(0, 0, 0, 0.25) inset',
			},
			'&:active': {
				boxShadow: '0 0 15px rgba(0, 0, 0, 0.50) inset',
			},
		},
		Folder: {
			'&:after': {
				position: 'absolute',
				content: '""',
				width: '100%',
				height: '100%',
				top: '-2px',
				right: '-2px',
				background: `linear-gradient(to top right, transparent 50%, black 0) top right/3vw 3vw no-repeat, transparent`,
			},
		},
	});
	const classes = useStyles();

	// A valid folder must contain the path to a board within the board set
	const isFolder = (tile) => {
		return Object.keys(archive).length > 0 &&
			tile.load_board &&
			tile.load_board.path &&
			archive.boards[tile.load_board.path]
			? true
			: false;
	};

	// Call onClickTile to vocalize folder
	const onClickVocalizeFolders = (tile) => {
		onClickFolder(tile);
		onClickTile(tile, true);
	};

	// Execute a tile action
	const onClickActionTile = (action) => {
		switch (action.toLowerCase()) {
			case ':home':
				openRootBoard();
				break;
			case ':clear':
				onClearSentence();
				break;
			case ':speak':
				onClickSentence();
				break;
			case ':backspace':
				onPopSentence();
				break;
			case ':space':
				onClickTile(undefined, undefined, action.toLowerCase().slice(1, action.length));
				break;
			default:
				if (action.charAt(0) === '+') {
					onClickTile(undefined, undefined, action.toLowerCase().slice(1, action.length));
				}
				break;
		}
	};

	let tile = <Box />;
	// If the tile is non-empty, populate the element
	if (TileData) {
		tile = (
			<Box
				className={`${classes.Tile} ${isFolder(TileData) && classes.Folder}`}
				onClick={
					isFolder(TileData)
						? vocalizeFolders
							? () => onClickVocalizeFolders(TileData)
							: () => onClickFolder(TileData)
						: TileData.action
						? () => onClickActionTile(TileData.action)
						: () => onClickTile(TileData, false)
				}
			>
				{labelPosition === 'above' && <TileLabel tile={TileData} />}
				<TileImage board={board} tile={TileData} />
				{labelPosition === 'below' && <TileLabel tile={TileData} />}
			</Box>
		);
	}
	return tile;
};

Tile.propTypes = {
	board: PropTypes.object.isRequired,
	archive: PropTypes.object,
	onClickTile: PropTypes.func.isRequired,
	onClickFolder: PropTypes.func.isRequired,
	onClickSentence: PropTypes.func.isRequired,
	openRootBoard: PropTypes.func.isRequired,
	onClearSentence: PropTypes.func.isRequired,
	onPopSentence: PropTypes.func.isRequired,
	tileId: PropTypes.string,
	labelPosition: PropTypes.string.isRequired,
	vocalizeFolders: PropTypes.bool.isRequired,
};

export default Tile;
