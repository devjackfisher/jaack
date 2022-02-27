import PropTypes from 'prop-types';
// Material UI functions
import { makeStyles } from '@material-ui/core';
// Material UI components
import { Toolbar, Box, IconButton } from '@material-ui/core';
// Material UI icons
import BackspaceIcon from '@material-ui/icons/Backspace';
import DeleteIcon from '@material-ui/icons/Delete';
// Components
import Sentence from './Sentence';

const SentenceBar = (props) => {
	// Deconstruct props
	const { sentence, onClickSentence, onPopSentence, onClearSentence } = props;
	// Styling
	const useStyles = makeStyles((theme) => ({
		SentenceBar: {
			borderBottom: '1px black solid',
			flex: '1 1 20%',
			padding: '0',
		},
		RightMenu: {
			marginLeft: 'auto',
			marginRight: theme.spacing(2),
		},
		LargeIcon: {
			fontSize: '1.5em',
		},
	}));
	const classes = useStyles();
	return (
		<Toolbar className={classes.SentenceBar}>
			{sentence.length > 0 && <Sentence sentence={sentence} onClickSentence={onClickSentence} />}
			<Box className={classes.RightMenu}>
				<IconButton color='inherit' component='span' onClick={onPopSentence}>
					<BackspaceIcon className={classes.LargeIcon} />
				</IconButton>
				<IconButton color='inherit' component='span' onClick={onClearSentence}>
					<DeleteIcon className={classes.LargeIcon} />
				</IconButton>
			</Box>
		</Toolbar>
	);
};

SentenceBar.propTypes = {
	sentence: PropTypes.array,
	onPopSentence: PropTypes.func.isRequired,
	onClearSentence: PropTypes.func.isRequired,
	onClickSentence: PropTypes.func.isRequired,
};

export default SentenceBar;
