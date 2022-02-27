import PropTypes from 'prop-types';
// Material UI functions
import { makeStyles } from '@material-ui/core';
// Material UI components
import { Box } from '@material-ui/core';
// Components
import EditableTile from './Tile/EditableTile';

const EditableGrid = (props) => {
	// Deconstruct props
	const { editBoard, setEditBoard, editTile, setEditTile, swapTiles, labelPosition } = props;
	// Styling
	const useStyles = makeStyles({
		GridContainer: {
			position: 'relative',
			flex: '1 1',
			display: 'flex',
		},
		Grid: {
			flex: '1 1',
			display: 'grid',
			gridTemplateColumns: `repeat(${editBoard.grid.columns}, minmax(0, 1fr))`,
			gridTemplateRows: `repeat(${editBoard.grid.rows}, minmax(0, 1fr))`,
			padding: '8px',
		},
	});
	const classes = useStyles();

	return (
		<Box className={classes.GridContainer}>
			<Box className={classes.Grid}>
				{editBoard.grid.order.map((row, rowIndex) =>
					row.map((tile, tileIndex) => (
						<EditableTile
							key={rowIndex.toString() + tileIndex.toString()}
							editBoard={editBoard}
							setEditBoard={setEditBoard}
							editTile={editTile}
							setEditTile={setEditTile}
							swapTiles={swapTiles}
							labelPosition={labelPosition}
							tilePosition={[rowIndex, tileIndex]}
							tileId={tile ? tile.toString() : undefined}
						/>
					))
				)}
			</Box>
		</Box>
	);
};

EditableGrid.propTypes = {
	editBoard: PropTypes.object.isRequired,
	setEditBoard: PropTypes.func.isRequired,
	editTile: PropTypes.object.isRequired,
	setEditTile: PropTypes.func.isRequired,
	swapTiles: PropTypes.func.isRequired,
	labelPosition: PropTypes.string.isRequired,
};

export default EditableGrid;
