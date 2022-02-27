import PropTypes from 'prop-types';
import { useState } from 'react';
// Material UI functions
import { makeStyles } from '@material-ui/core';
// Material UI components
import { Dialog, DialogTitle, Box, TextField, Typography, Button, Grid } from '@material-ui/core';
// Mulberry symbols
const reqSvgs = require.context('../../data/symbols/mulberry', true, /\.svg$/);
// Array of Mulberry symbol .svg files
const svgs = reqSvgs.keys().map((path) => ({ path, file: reqSvgs(path) }));

const ImageSearch = (props) => {
	// Deconstruct props
	const { imageSearchOpen, onCloseImageSearch, setEditedTileSymbol } = props;
	// Styling
	const useStyles = makeStyles((theme) => ({
		DialogContent: {
			height: '50vh',
			display: 'flex',
			flexDirection: 'column',
			paddingBottom: theme.spacing(2),
			paddingLeft: theme.spacing(3),
			paddingRight: theme.spacing(3),
		},
		ResultContainer: {
			flex: '1 1',
		},
		DialogItem: {
			width: '100%',
			marginBottom: '16px',
			display: 'flex',
			flexDirection: 'column',
		},
		ButtonContainer: {
			width: '100%',
			marginBottom: '16px',
		},
		Button: {
			marginLeft: theme.spacing(1),
		},
		SearchResult: {
			width: '100%',
			marginBottom: '16px',
			flex: '1 1',
			display: 'grid',
			gridTemplateColumns: `repeat(5, minmax(0, 1fr))`,
			overflow: 'auto',
		},
		SymbolContainer: {
			padding: theme.spacing(1),
			'&:hover': {
				backgroundColor: 'lightgrey',
			},
		},
		Image: {
			objectFit: 'cover',
			width: '100%',
			maxHeight: '100%',
		},
	}));
	const classes = useStyles();

	const [results, setResults] = useState([]);

	function* filter(array, condition, maxSize) {
		if (!maxSize || maxSize > array.length) {
			maxSize = array.length;
		}
		let count = 0;
		let i = 0;
		while (count < maxSize && i < array.length) {
			if (condition(array[i])) {
				yield array[i];
				count++;
			}
			i++;
		}
	}

	const searchImages = (search) => {
		if (search.trim() === '') {
			setResults();
			return;
		}
		const result = Array.from(filter(svgs, (svg) => svg.path.toLowerCase().includes(search.toLowerCase()), 100));
		if (result.length > 0) {
			setResults(result);
		} else {
			setResults();
		}
	};

	const pathToDataURL = (path) => {
		let url = `symbols/mulberry/${path.slice(2)}`;
		let img = new Image();
		img.setAttribute('crossOrigin', 'anonymous');
		img.onload = function () {
			let canvas = document.createElement('canvas');
			canvas.width = this.width;
			canvas.height = this.height;
			let ctx = canvas.getContext('2d');
			ctx.drawImage(this, 0, 0);
			let dataURL = canvas.toDataURL('image/png');
			setEditedTileSymbol(dataURL, this.width, this.height);
		};
		img.src = url;
	};

	return (
		<Dialog fullWidth={true} onClose={onCloseImageSearch} open={imageSearchOpen}>
			<DialogTitle>Search Images</DialogTitle>
			<Box className={classes.DialogContent}>
				<form noValidate autoComplete='off'>
					<TextField
						className={classes.DialogItem}
						label='Image'
						variant='outlined'
						onChange={(event) => searchImages(event.target.value)}
					/>
				</form>
				{results ? (
					<Box className={classes.ResultContainer}>
						<Box className={`${classes.SearchResult} ${classes.DialogItem}`}>
							{results.map((symbol, symbolIndex) => (
								<Box key={symbolIndex} className={classes.SymbolContainer} onClick={() => pathToDataURL(symbol.path)}>
									<img className={classes.Image} src={`symbols/mulberry/${symbol.path.slice(2)}`} alt='' />
								</Box>
							))}
						</Box>
						{results.length > 0 && <Typography>Mulberry Symbols, CC BY-SA.</Typography>}
					</Box>
				) : (
					<Typography className={classes.ResultContainer}>No matching results found.</Typography>
				)}
				<Grid className={classes.ButtonContainer} container justifyContent='flex-end'>
					<Button
						className={classes.Button}
						variant='contained'
						color='primary'
						size='small'
						onClick={onCloseImageSearch}
					>
						Close
					</Button>
				</Grid>
			</Box>
		</Dialog>
	);
};

ImageSearch.propTypes = {
	imageSearchOpen: PropTypes.bool.isRequired,
	onCloseImageSearch: PropTypes.func.isRequired,
	setEditedTileSymbol: PropTypes.func.isRequired,
};

export default ImageSearch;
