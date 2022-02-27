import { useState, useRef, useEffect } from 'react';
import { makeStyles, Box, Snackbar } from '@material-ui/core';
// Utility functions
import Utils from '../../utils';
// Mulberry icons
import PencilAndPaperIcon from '../../data/symbols/mulberry/pencil_and_paper_2.svg';
import PaperIcon from '../../data/symbols/mulberry/paper.svg';
// Components
import NavigationBar from '../NavigationBar/NavigationBar';
import EditBar from '../NavigationBar/EditBar';
import SentenceBar from '../SentenceBar/SentenceBar';
import Grid from '../Grid/Grid';
import EditableGrid from '../Grid/EditableGrid';
import TileEditor from '../Dialog/TileEditor';
import Settings from '../Dialog/Settings';
import Notification from '../Notification/Notification';
// Default board
import DefaultBoard from '../../data/boards/project-core.obf';

const Board = () => {
	// Styling
	const useStyles = makeStyles({
		Board: {
			display: 'flex',
			flexDirection: 'column',
			height: '100%',
		},
	});
	const classes = useStyles();

	// Board states
	const [board, setBoard] = useState({});
	const [archive, setArchive] = useState({});
	const [sentence, setSentence] = useState([]);
	const [history, setHistory] = useState([]);
	// Board edit states
	const [editMode, setEditMode] = useState(false);
	const [editBoard, setEditBoard] = useState({});
	const [editTile, setEditTile] = useState({});
	const [editHistory, setEditHistory] = useState([]);
	const [tileEditorOpen, setTileEditorOpen] = useState(false);
	// Settings states
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [settingsVoice, setSettingsVoice] = useState('');
	const [settingsVolume, setSettingsVolume] = useState(0.5);
	const [settingsRate, setSettingsRate] = useState(1.0);
	const [settingsLabelPosition, setSettingsLabelPosition] = useState('above');
	const [settingsVocalizeFolders, setSettingsVocalizeFolders] = useState(false);
	// Notification states
	const [notificationOpen, setNotificationOpen] = useState(false);
	const [notificationMessage, setNotificationMessage] = useState('');
	const [notificationSeverity, setNotificationSeverity] = useState('');

	const loadDefault = () => {
		var request = new XMLHttpRequest();
		request.open('get', DefaultBoard, true);
		request.responseType = 'blob';
		request.onload = function () {
			Utils.readOBF(request.response).then(
				(board) => {
					setHistory([]);
					setSentence([]);
					setArchive({});
					setBoard(board);
				},
				(error) => {
					setNotificationOpen(true);
					setNotificationMessage(error.message);
					setNotificationSeverity('error');
				}
			);
		};
		request.send();
	};

	// Persistence with localStorage
	useEffect(() => {
		// Retrieve board information from localStorage
		const localState = JSON.parse(window.localStorage.getItem('state'));
		if (localState) {
			setBoard(localState.board);
			setArchive(localState.archive);
			setSentence(localState.sentence);
			setHistory(localState.history);
		} else {
			loadDefault();
		}
		// Retrieve settings from localStorage
		const localSettings = JSON.parse(window.localStorage.getItem('settings'));
		if (localSettings) {
			setSettingsVoice(localSettings.voice);
			setSettingsVolume(localSettings.volume);
			setSettingsRate(localSettings.rate);
			setSettingsLabelPosition(localSettings.labelPosition);
			setSettingsVocalizeFolders(localSettings.vocalizeFolders);
		}
	}, []);

	useEffect(() => {
		// Add board information to localStorage for persistence
		let state = {
			board: board,
			archive: archive,
			sentence: sentence,
			history: history,
		};
		window.localStorage.setItem('state', JSON.stringify(state));
	}, [board, archive, sentence, history]);

	useEffect(() => {
		// Add settings to localStorage for persistence
		let settings = {
			voice: settingsVoice,
			volume: settingsVolume,
			rate: settingsRate,
			labelPosition: settingsLabelPosition,
			vocalizeFolders: settingsVocalizeFolders,
		};
		window.localStorage.setItem('settings', JSON.stringify(settings));
	}, [settingsVoice, settingsVolume, settingsRate, settingsLabelPosition, settingsVocalizeFolders]);

	// Speech synthesis
	const speechRef = useRef(window.speechSynthesis);
	const speak = (input) => {
		const voices = speechRef.current.getVoices();
		let defaultVoice = voices.find((voice) => voice.lang === navigator.language);
		if (!defaultVoice) {
			defaultVoice = voices.find((voice) => voice.default === true);
		}
		if (!defaultVoice) {
			defaultVoice = voices[0];
		}
		const currentVoice = voices.find((voice) => voice.voiceURI === settingsVoice);
		const utterance = new SpeechSynthesisUtterance();
		utterance.voice = currentVoice ? currentVoice : defaultVoice;
		utterance.volume = settingsVolume;
		utterance.rate = settingsRate;
		if (typeof input === 'string') {
			utterance.text = input;
			speechRef.current.speak(utterance);
		} else if (Array.isArray(input) && input.length > 0) {
			// Join the input into a single string
			utterance.text = input.join('. ');
			speechRef.current.speak(utterance);
		}
	};

	// Board editing
	const swapTiles = (newPosition) => {
		const oldPosition = editTile.position;
		let grid = editBoard.grid;
		let order = grid.order;
		const oldOrder = order[oldPosition[0]][oldPosition[1]];
		const newOrder = order[newPosition[0]][newPosition[1]];
		order[oldPosition[0]][oldPosition[1]] = newOrder;
		order[newPosition[0]][newPosition[1]] = oldOrder;
		const newGrid = { ...grid, order: order };
		setEditTile({});
		setEditBoard({ ...editBoard, grid: newGrid });
		// Update edit history
		let editHistoryCopy = JSON.parse(JSON.stringify(editHistory));
		editHistoryCopy.push(editBoard);
		setEditHistory(JSON.parse(JSON.stringify(editHistoryCopy)));
	};

	const deleteTile = () => {
		let grid = editBoard.grid;
		let order = grid.order;
		order[editTile.position[0]][editTile.position[1]] = 'null';
		const newGrid = { ...grid, order: order };
		setEditTile({});
		setEditBoard({ ...editBoard, grid: newGrid });
		// Update edit history
		let editHistoryCopy = JSON.parse(JSON.stringify(editHistory));
		editHistoryCopy.push(editBoard);
		setEditHistory(JSON.parse(JSON.stringify(editHistoryCopy)));
	};

	const undoEdit = () => {
		setEditTile({});
		let editHistoryCopy = JSON.parse(JSON.stringify(editHistory));
		editHistoryCopy.pop();
		let [previousEditBoard] = editHistoryCopy.slice(-1);
		setEditHistory(JSON.parse(JSON.stringify(editHistoryCopy)));
		setEditBoard(JSON.parse(JSON.stringify(previousEditBoard)));
	};

	const onClickTile = (tile, isFolder, action) => {
		if (action) {
			addToSentence(undefined, undefined, action);
			return;
		}
		const text = tile.vocalization ? tile.vocalization : tile.label;
		const image = tile.image_id && board.images.find((image) => image.id.toString() === tile.image_id.toString());
		if (!isFolder) {
			addToSentence(text, image);
		}
		speak(text);
	};

	const onClickFolder = (folder) => {
		let historyCopy = history;
		historyCopy.push(archive.manifest.paths.boards[board.id]);
		setHistory(JSON.parse(JSON.stringify(historyCopy)));
		setBoard(archive.boards[folder.load_board.path]);
	};

	const openPreviousBoard = () => {
		let historyCopy = history;
		let previousBoard = historyCopy.pop();
		setHistory(JSON.parse(JSON.stringify(historyCopy)));
		setBoard(archive.boards[previousBoard]);
	};

	const openRootBoard = () => {
		if (!archive) return;
		const root = archive.boards[archive.manifest.root];
		let historyCopy = history;
		historyCopy.push(board);
		setHistory(JSON.parse(JSON.stringify(historyCopy)));
		setBoard(root);
	};

	const addToSentence = (text, image, action) => {
		let sentenceCopy = sentence;
		if (action) {
			let endItem = sentenceCopy[sentenceCopy.length - 1];
			if (action === 'space') {
				if (endItem && endItem.type === 'word') {
					endItem.type = 'symbol';
					endItem.image = { url: PaperIcon };
					speak(endItem.text);
				} else {
					return;
				}
			} else if (endItem && endItem.type === 'word') {
				endItem.text = endItem.text + action;
				sentenceCopy[sentenceCopy.length - 1] = endItem;
			} else {
				let word = {
					type: 'word',
					text: action,
					image: { url: PencilAndPaperIcon },
				};
				sentenceCopy = [...sentenceCopy, word];
			}
		} else {
			let symbol = { type: 'symbol', text: text, image: image };
			if (sentenceCopy) {
				let endItem = sentenceCopy[sentenceCopy.length - 1];
				if (endItem && endItem.type === 'word') {
					endItem.type = 'symbol';
					endItem.image = { url: PaperIcon };
				}
				sentenceCopy = [...sentenceCopy, symbol];
			} else {
				sentenceCopy = [symbol];
			}
		}
		setSentence(JSON.parse(JSON.stringify(sentenceCopy)));
	};

	const onClickSentence = () => {
		speechRef.current.cancel();
		let sentenceItems = [];
		sentence.forEach((item) => {
			sentenceItems.push(item.text);
		});
		speak(sentenceItems);
	};

	const onPopSentence = () => {
		speechRef.current.cancel();
		let sentenceCopy = sentence;
		if (sentenceCopy.length > 0) {
			let endItem = sentenceCopy[sentenceCopy.length - 1];
			if (endItem.type === 'word') {
				if (endItem.text.length > 1) {
					endItem.text = endItem.text.slice(0, -1);
					sentenceCopy[sentenceCopy.length - 1] = endItem;
				} else {
					sentenceCopy.pop();
				}
			} else {
				if (sentenceCopy.length > 1) {
					sentenceCopy.pop();
				} else {
					sentenceCopy = [];
				}
			}
		}
		setSentence(JSON.parse(JSON.stringify(sentenceCopy)));
	};

	const onClearSentence = () => {
		speechRef.current.cancel();
		setSentence([]);
	};

	// Handle onChange event from file input element
	const onFileUpload = (event) => {
		const file = event.target.files[0];
		if (!file) {
			return;
		}
		const extension = file.name.split('.')[1];
		switch (extension) {
			case 'obz':
				Utils.readOBZ(file).then(
					(archive) => {
						const board = archive.boards[archive.manifest.root];
						setHistory([]);
						setSentence([]);
						setArchive(archive);
						setBoard(board);
					},
					(error) => {
						setNotificationOpen(true);
						setNotificationMessage(error.message);
						setNotificationSeverity('error');
					}
				);
				break;
			case 'obf':
				Utils.readOBF(file).then(
					(board) => {
						setHistory([]);
						setSentence([]);
						setArchive({});
						setBoard(board);
					},
					(error) => {
						setNotificationOpen(true);
						setNotificationMessage(error.message);
						setNotificationSeverity('error');
					}
				);
				break;
			default:
				setNotificationOpen(true);
				setNotificationMessage('Only .obf and .obz file types are supported.');
				setNotificationSeverity('error');
		}
		// Reset the file input form
		event.currentTarget.parentElement.reset();
	};

	const onExport = () => {
		if (archive.manifest) {
			const manifest = JSON.parse(JSON.stringify(archive.manifest));
			const boards = JSON.parse(JSON.stringify(archive.boards));
			Utils.exportOBZ(manifest, boards);
		} else {
			Utils.exportOBF(JSON.parse(JSON.stringify(board)));
		}
	};

	// Component Props
	const NavigationBarProps = {
		onOpenSettings: () => setSettingsOpen(true),
		onOpenEdit: () => {
			setEditTile({});
			setEditBoard(JSON.parse(JSON.stringify(board)));
			setEditMode(true);
			// Set edit history
			setEditHistory([JSON.parse(JSON.stringify(board))]);
		},
		onFileUpload: onFileUpload,
		onExport: onExport,
		openPreviousBoard: openPreviousBoard,
		history: history,
	};

	const EditBarProps = {
		onCloseEdit: () => {
			setEditTile({});
			setEditBoard({});
			setEditHistory({});
			setEditMode(false);
		},
		onSaveEdit: () => {
			setEditTile({});
			setBoard(JSON.parse(JSON.stringify(editBoard)));
			if (archive.manifest) {
				const archiveCopy = JSON.parse(JSON.stringify(archive));
				const boardsCopy = archiveCopy.boards;
				boardsCopy[archive.manifest.paths.boards[editBoard.id]] = editBoard;
				setArchive({ ...archive, boards: boardsCopy });
			}
			setEditBoard({});
			setEditHistory({});
			setEditMode(false);
		},
		openTileEditor: () => {
			setTileEditorOpen(true);
		},
		editTile: editTile,
		deleteTile: deleteTile,
		hasChanges: JSON.stringify(editBoard) !== JSON.stringify(board),
		editHistory: editHistory.length > 1,
		undoEdit: undoEdit,
	};

	const SentenceBarProps = {
		sentence: sentence,
		onClickSentence: onClickSentence,
		onPopSentence: onPopSentence,
		onClearSentence: onClearSentence,
	};

	const GridProps = {
		board: board,
		archive: archive,
		onClickTile: onClickTile,
		onClickFolder: onClickFolder,
		onClickSentence: onClickSentence,
		openRootBoard: openRootBoard,
		onClearSentence: onClearSentence,
		onPopSentence: onPopSentence,
		labelPosition: settingsLabelPosition,
		vocalizeFolders: settingsVocalizeFolders,
	};

	const EditableGridProps = {
		editBoard: editBoard,
		setEditBoard: setEditBoard,
		editTile: editTile,
		setEditTile: setEditTile,
		swapTiles: swapTiles,
		labelPosition: settingsLabelPosition,
	};

	const SettingsProps = {
		settingsOpen: settingsOpen,
		onCloseSettings: () => setSettingsOpen(false),
		voices: speechRef.current.getVoices(),
		settingsVoice: settingsVoice,
		setVoice: setSettingsVoice,
		volume: settingsVolume,
		setVolume: setSettingsVolume,
		rate: settingsRate,
		setRate: setSettingsRate,
		labelPosition: settingsLabelPosition,
		setLabelPosition: setSettingsLabelPosition,
		vocalizeFolders: settingsVocalizeFolders,
		setVocalizeFolders: setSettingsVocalizeFolders,
	};

	const TileEditorProps = {
		editBoard: editBoard,
		setEditBoard: setEditBoard,
		editTile: editTile,
		labelPosition: settingsLabelPosition,
		speak: speak,
		tileEditorOpen: tileEditorOpen,
		closeTileEditor: () => {
			setEditTile({});
			setTileEditorOpen(false);
		},
	};

	return (
		<Box className={classes.Board}>
			{editMode
				? [
						<EditBar key='editBar' {...EditBarProps} />,
						<EditableGrid key='grid' {...EditableGridProps} />,
						Object.keys(editTile).length > 0 && <TileEditor key='tileEditor' {...TileEditorProps} />,
				  ]
				: [
						<NavigationBar key='navigationBar' {...NavigationBarProps} />,
						<SentenceBar key='sentenceBar' {...SentenceBarProps} />,
						Object.keys(board).length > 0 && <Grid key='grid' {...GridProps} />,
						<Settings key='settings' {...SettingsProps} />,
				  ]}
			<Snackbar open={notificationOpen} autoHideDuration={5000} onClose={() => setNotificationOpen(false)}>
				<Notification onClose={() => setNotificationOpen(false)} severity={notificationSeverity}>
					{notificationMessage}
				</Notification>
			</Snackbar>
		</Box>
	);
};

export default Board;
