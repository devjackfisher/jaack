import { makeStyles } from '@material-ui/core';
import Board from './components/Board/Board';

function App() {
	// Styling
	const useStyles = makeStyles({
		App: {
			height: '100%',
			textAlign: 'center',
		},
	});
	const classes = useStyles();
	return (
		<div className={classes.App}>
			<Board />
		</div>
	);
}

export default App;
