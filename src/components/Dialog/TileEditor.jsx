import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
// Material UI functions
import { makeStyles } from '@material-ui/core';
// Material UI components
import { Dialog, DialogTitle, Box, Grid, Button, TextField, Typography, Switch } from '@material-ui/core';
// Material UI icons
import SearchIcon from '@material-ui/icons/Search';
import PublishIcon from '@material-ui/icons/Publish';
// Components
import PreviewTile from '../Grid/Tile/PreviewTile';
import ImageSearch from '../ImageSearch/ImageSearch';
import { ColorPicker } from 'material-ui-color';
// Functions
import rgbHex from 'rgb-hex';
import hexRgb from 'hex-rgb';

const TileEditor = (props) => {
	// Deconstruct props
	const { editTile, editBoard, setEditBoard, labelPosition, speak, tileEditorOpen, closeTileEditor } = props;
	// Styling
	const useStyles = makeStyles((theme) => ({
		DialogContent: {
			padding: '0 24px 0 24px',
			display: 'flex',
			flexDirection: 'column',
		},
		DialogItemRow: {
			display: 'flex',
			marginBottom: theme.spacing(1),
		},
		ColourPickerContainer: {
			flex: '1 1',
			display: 'flex',
			alignItems: 'center',
		},
		SwitchContainer: {
			flex: '1 1',
			display: 'flex',
			alignItems: 'center',
		},
		TextFieldColumn: {
			flex: '1 1 60%',
			display: 'flex',
			flexDirection: 'column',
			padding: theme.spacing(1),
		},
		DialogItemColumn: {
			flex: '1 1 40%',
			display: 'flex',
			flexDirection: 'column',
			padding: theme.spacing(1),
		},
		PreviewTileContainer: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			marginBottom: theme.spacing(1),
		},
		DialogItem: {
			flex: '1 1',
			marginBottom: theme.spacing(1),
		},
		DialogForm: {
			flex: '1 1 25%',
			marginBottom: theme.spacing(1),
		},
		DialogButtonContainer: {
			flex: '1 1',
			marginBottom: theme.spacing(2),
		},
		Button: {
			marginLeft: theme.spacing(1),
		},
		TextField: {
			width: '100%',
		},
	}));
	const classes = useStyles();

	// Reference to file input element
	const inputFile = useRef(null);

	const [editedTile, setEditedTile] = useState(editTile);
	const [imageSearchOpen, setImageSearchOpen] = useState(false);

	const onClickPreviewTile = () => {
		const text = editedTile.vocalization ? editedTile.vocalization : editedTile.label;
		speak(text);
	};

	const saveTile = () => {
		let buttonsCopy = JSON.parse(JSON.stringify(editBoard.buttons));
		if (!editedTile.id) {
			const randId = Math.random().toString().slice(2);
			editedTile.id = randId;
			buttonsCopy.push(editedTile);
			let grid = editBoard.grid;
			let order = grid.order;
			order[editedTile.position[0]][editedTile.position[1]] = editedTile.id;
			const newGrid = { ...grid, order: order };
			const newBoard = { ...editBoard, grid: newGrid, buttons: buttonsCopy };
			setEditBoard(newBoard);
		} else {
			let button = buttonsCopy.find((button) => button.id === editedTile.id);
			buttonsCopy[buttonsCopy.indexOf(button)] = editedTile;
			const newBoard = { ...editBoard, buttons: buttonsCopy };
			setEditBoard(newBoard);
		}
		closeTileEditor();
	};

	const setEditedTileSymbol = (dataURI, width, height) => {
		const randId = Math.random().toString().slice(2);
		let image = {
			id: randId,
			width: width,
			height: height,
			data: dataURI,
			content_type: 'image/png',
		};
		let imagesCopy = JSON.parse(JSON.stringify(editBoard.images));
		imagesCopy.push(image);
		setEditBoard({ ...editBoard, images: imagesCopy });
		setEditedTile({ ...editedTile, image_id: randId });
		setImageSearchOpen(false);
	};

	const onImageUpload = (event) => {
		const file = event.target.files[0];
		if (!file) {
			return;
		}
		const extension = file.name.split('.')[1];
		if (extension !== 'jpeg' && extension !== 'jpg' && extension !== 'png' && extension !== 'svg') return;
		new Promise((resolve, reject) => {
			const reader = new FileReader();

			reader.onload = (readerEvent) => {
				let image = new Image();

				image.onload = function () {
					setEditedTileSymbol(readerEvent.target.result, image.width, image.height);
				};

				image.src = readerEvent.target.result;
			};

			reader.readAsDataURL(file);
		});
	};

	const ImageSearchProps = {
		imageSearchOpen: imageSearchOpen,
		onCloseImageSearch: () => setImageSearchOpen(false),
		setEditedTileSymbol: setEditedTileSymbol,
	};

	return (
		<Box>
			{imageSearchOpen ? (
				<ImageSearch {...ImageSearchProps} />
			) : (
				<Dialog fullWidth={true} onClose={closeTileEditor} open={tileEditorOpen}>
					<DialogTitle>Edit Tile</DialogTitle>
					<Box className={classes.DialogContent}>
						<Box className={classes.DialogItemRow}>
							<Box className={classes.DialogItemColumn}>
								<Box className={classes.PreviewTileContainer}>
									<PreviewTile
										onPreviewTileClick={onClickPreviewTile}
										editBoard={editBoard}
										tileData={editedTile}
										labelPosition={labelPosition}
									/>
								</Box>

								<Button
									className={classes.DialogItem}
									startIcon={<SearchIcon />}
									variant='contained'
									color='primary'
									size='small'
									onClick={() => setImageSearchOpen(true)}
								>
									Search Images
								</Button>
								<form>
									<input
										type='file'
										id='file'
										accept='image/png, image/jpeg, image/svg+xml'
										ref={inputFile}
										style={{ display: 'none' }}
										onChange={onImageUpload}
									/>
								</form>
								<Button
									className={classes.DialogItem}
									startIcon={<PublishIcon />}
									variant='contained'
									color='primary'
									size='small'
									onClick={() => inputFile.current.click()}
								>
									Upload Image
								</Button>
							</Box>
							<Box className={classes.TextFieldColumn}>
								<form className={classes.DialogForm} noValidate autoComplete='off'>
									<TextField
										className={classes.TextField}
										label='Label'
										variant='outlined'
										defaultValue={editedTile.label}
										onChange={(event) =>
											setEditedTile({
												...editedTile,
												label: event.target.value,
											})
										}
									/>
								</form>
								<form className={classes.DialogForm} noValidate autoComplete='off'>
									<TextField
										className={classes.TextField}
										label='Vocalization'
										variant='outlined'
										defaultValue={editedTile.vocalization}
										onChange={(event) =>
											setEditedTile({
												...editedTile,
												vocalization: event.target.value,
											})
										}
									/>
								</form>

								<Box className={classes.ColourPickerContainer}>
									<Typography>Background Colour:</Typography>
									<ColorPicker
										hideTextfield
										value={`#${editedTile.background_color ? rgbHex(editedTile.background_color) : 'fff'}`}
										onChange={(e) =>
											setEditedTile({
												...editedTile,
												background_color: hexRgb(e.hex, { format: 'css' }),
											})
										}
									/>
								</Box>
								<Box className={classes.ColourPickerContainer}>
									<Typography>Border Colour:</Typography>
									<ColorPicker
										hideTextfield
										value={`#${editedTile.border_color ? rgbHex(editedTile.border_color) : '000'}`}
										onChange={(e) =>
											setEditedTile({
												...editedTile,
												border_color: hexRgb(e.hex, { format: 'css' }),
											})
										}
									/>
								</Box>

								<Box className={classes.SwitchContainer}>
									<Typography gutterBottom>Hidden:</Typography>
									<Switch
										checked={editedTile.hidden ? editedTile.hidden : false}
										onChange={(event) =>
											setEditedTile({
												...editedTile,
												hidden: event.target.checked,
											})
										}
										color='primary'
									/>
								</Box>
							</Box>
						</Box>
						<Grid className={classes.DialogButtonContainer} container justifyContent='flex-end'>
							<Button
								className={classes.Button}
								variant='contained'
								color='primary'
								size='small'
								onClick={closeTileEditor}
							>
								Close
							</Button>
							<Button className={classes.Button} variant='contained' color='primary' size='small' onClick={saveTile}>
								Save
							</Button>
						</Grid>
					</Box>
				</Dialog>
			)}
		</Box>
	);
};

TileEditor.propTypes = {
	editTile: PropTypes.object.isRequired,
	editBoard: PropTypes.object.isRequired,
	setEditBoard: PropTypes.func.isRequired,
	closeTileEditor: PropTypes.func.isRequired,
	labelPosition: PropTypes.string.isRequired,
	tileEditorOpen: PropTypes.bool.isRequired,
	speak: PropTypes.func.isRequired,
};

export default TileEditor;
