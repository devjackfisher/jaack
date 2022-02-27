import PropTypes from 'prop-types';
// Material UI functions
import { makeStyles } from '@material-ui/core';
// Material UI components
import { Box } from '@material-ui/core';
// Components
import Tile from './Tile/Tile';

const Grid = (props) => {
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
		labelPosition,
		vocalizeFolders,
	} = props;
	// Styling
	const useStyles = makeStyles({
		Grid: {
			flex: '1 1 80%',
			display: 'grid',
			gridTemplateColumns: `repeat(${board.grid.columns}, minmax(0, 1fr))`,
			gridTemplateRows: `repeat(${board.grid.rows}, minmax(0, 1fr))`,
			padding: '8px',
		},
	});
	const classes = useStyles();
	return (
		<Box className={classes.Grid}>
			{board.grid.order.map((row, rowIndex) =>
				row.map((tile, tileIndex) => (
					<Tile
						key={rowIndex.toString() + tileIndex.toString()}
						board={board}
						archive={archive}
						onClickTile={onClickTile}
						onClickFolder={onClickFolder}
						onClickSentence={onClickSentence}
						openRootBoard={openRootBoard}
						onClearSentence={onClearSentence}
						onPopSentence={onPopSentence}
						tileId={tile ? tile.toString() : undefined}
						labelPosition={labelPosition}
						vocalizeFolders={vocalizeFolders}
					/>
				))
			)}
		</Box>
	);
};

Grid.propTypes = {
	board: PropTypes.object.isRequired,
	archive: PropTypes.object,
	onClickTile: PropTypes.func.isRequired,
	onClickFolder: PropTypes.func.isRequired,
	onClickSentence: PropTypes.func.isRequired,
	openRootBoard: PropTypes.func.isRequired,
	onClearSentence: PropTypes.func.isRequired,
	onPopSentence: PropTypes.func.isRequired,
	labelPosition: PropTypes.string.isRequired,
	vocalizeFolders: PropTypes.bool.isRequired,
};

export default Grid;
