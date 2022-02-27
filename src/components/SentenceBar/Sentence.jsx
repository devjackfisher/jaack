import PropTypes from 'prop-types';
import { useRef, useEffect } from 'react';
// Material UI functions
import { makeStyles } from '@material-ui/core';
// Material UI components
import { Box } from '@material-ui/core';
// Components
import SentenceSymbol from './SentenceSymbol';

const Sentence = (props) => {
	// Deconstruct props
	const { sentence, onClickSentence } = props;
	// Styling
	const useStyles = makeStyles({
		Row: {
			display: 'flex',
			justifyContent: 'left',
			flexDirection: 'row',
			userSelect: 'none',
			height: '100%',
			flex: '1 1',
			overflowX: 'auto',
			overflowY: 'hidden',
			cursor: 'pointer',
			padding: '8px',
			marginRight: '8px',
			'&:hover': {
				backgroundColor: 'lightgrey',
			},
		},
	});
	const classes = useStyles();

	// Automatically scroll to the end of the sentence
	const row = useRef(null);
	useEffect(() => {
		if (row.current.scroll) {
			row.current.scroll(row.current.scrollWidth, 0);
		}
	});

	return (
		<Box className={classes.Row} onClick={onClickSentence} ref={row}>
			{sentence.map((symbol, symbolIndex) => (
				<SentenceSymbol key={symbolIndex} text={symbol.text} image={symbol.image} />
			))}
		</Box>
	);
};

Sentence.propTypes = {
	sentence: PropTypes.array.isRequired,
	onClickSentence: PropTypes.func.isRequired,
};

export default Sentence;
