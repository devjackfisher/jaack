import PropTypes from 'prop-types';
// import { useRef, useState, useEffect } from 'react';
//Material UI functions
import { makeStyles, useTheme, useMediaQuery } from '@material-ui/core';
// Material UI components
import { AppBar, Toolbar, Box, Button, IconButton } from '@material-ui/core';
// Material UI icons
import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import UndoIcon from '@material-ui/icons/Undo';

const EditBar = (props) => {
	// Deconstruct props
	const { onSaveEdit, onCloseEdit, openTileEditor, editTile, deleteTile, hasChanges, editHistory, undoEdit } = props;
	// Styling
	const useStyles = makeStyles((theme) => ({
		RightMenu: {
			marginLeft: 'auto',
		},
		Button: {
			margin: theme.spacing(1),
		},
	}));
	const classes = useStyles();

	// Mobile
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down(601));

	return (
		<AppBar position='static' color='default'>
			<Toolbar>
				{isMobile
					? [
							<IconButton key='edit' disabled={Object.keys(editTile).length === 0} onClick={openTileEditor}>
								<EditIcon />
							</IconButton>,
							<IconButton key='delete' disabled={Object.keys(editTile).length <= 1} onClick={deleteTile}>
								<DeleteForeverIcon />
							</IconButton>,
							<IconButton key='undo' disabled={!editHistory} onClick={undoEdit}>
								<UndoIcon />
							</IconButton>,
					  ]
					: [
							<Button
								disabled={Object.keys(editTile).length === 0}
								key='edit'
								className={classes.Button}
								startIcon={<EditIcon />}
								variant='contained'
								color='primary'
								size='small'
								onClick={openTileEditor}
							>
								Edit Tile
							</Button>,
							<Button
								disabled={Object.keys(editTile).length <= 1}
								key='delete'
								className={classes.Button}
								startIcon={<DeleteForeverIcon />}
								variant='contained'
								color='primary'
								size='small'
								onClick={deleteTile}
							>
								Delete Tile
							</Button>,
							<Button
								disabled={!editHistory}
								key='undo'
								className={classes.Button}
								startIcon={<UndoIcon />}
								variant='contained'
								color='primary'
								size='small'
								onClick={undoEdit}
							>
								Undo
							</Button>,
					  ]}
				<Box className={classes.RightMenu}>
					{isMobile
						? [
								<IconButton key='save' disabled={!hasChanges} onClick={onSaveEdit}>
									<SaveIcon />
								</IconButton>,
								<IconButton key='close' onClick={onCloseEdit}>
									<CancelIcon />
								</IconButton>,
						  ]
						: [
								<Button
									disabled={!hasChanges}
									key='save'
									className={classes.Button}
									startIcon={<SaveIcon />}
									variant='contained'
									color='primary'
									size='small'
									onClick={onSaveEdit}
								>
									Save
								</Button>,
								<Button
									key='close'
									className={classes.Button}
									startIcon={<CancelIcon />}
									variant='contained'
									color='primary'
									size='small'
									onClick={onCloseEdit}
								>
									Close
								</Button>,
						  ]}
				</Box>
			</Toolbar>
		</AppBar>
	);
};

EditBar.propTypes = {
	onSaveEdit: PropTypes.func.isRequired,
	onCloseEdit: PropTypes.func.isRequired,
	openTileEditor: PropTypes.func.isRequired,
	editTile: PropTypes.object.isRequired,
	deleteTile: PropTypes.func.isRequired,
	hasChanges: PropTypes.bool.isRequired,
	editHistory: PropTypes.bool.isRequired,
	undoEdit: PropTypes.func.isRequired,
};

export default EditBar;
