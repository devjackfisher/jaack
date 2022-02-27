import PropTypes from 'prop-types';
import { useRef, useState, useEffect } from 'react';
//Material UI functions
import { makeStyles, useTheme, useMediaQuery } from '@material-ui/core';
// Material UI components
import { AppBar, Toolbar, Box, Button, IconButton, Menu, MenuItem, Typography } from '@material-ui/core';
// Material UI icons
import SettingsIcon from '@material-ui/icons/Settings';
import FolderIcon from '@material-ui/icons/Folder';
import EditIcon from '@material-ui/icons/Edit';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import GetAppIcon from '@material-ui/icons/GetApp';

const NavigationBar = (props) => {
	// Deconstruct props
	const { onOpenSettings, onOpenEdit, onFileUpload, onExport, openPreviousBoard, history } = props;
	// Styling
	const useStyles = makeStyles((theme) => ({
		RightMenu: {
			marginLeft: 'auto',
		},
		Hidden: {
			visibility: 'hidden',
		},
		Button: {
			margin: theme.spacing(1),
		},
		MenuItemTypography: {
			marginLeft: theme.spacing(1),
		},
	}));
	const classes = useStyles();

	// Reference to file input element
	const inputFile = useRef(null);

	// Mobile
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down(601));
	const [menuAnchor, setMenuAnchor] = useState(null);

	const onOpenMenu = (event) => {
		setMenuAnchor(event.currentTarget);
	};
	const onCloseMenu = () => {
		setMenuAnchor(null);
	};

	// Close the drop-down menu on window resize
	useEffect(() => {
		function handleResize() {
			onCloseMenu();
		}
		window.addEventListener('resize', handleResize);
	});

	return (
		<AppBar position='static' color='default'>
			<Toolbar>
				{history.length > 0 &&
					(isMobile ? (
						<IconButton onClick={openPreviousBoard}>
							<ArrowBackIcon />
						</IconButton>
					) : (
						<Button
							className={classes.Button}
							startIcon={<ArrowBackIcon />}
							variant='contained'
							color='primary'
							size='small'
							onClick={openPreviousBoard}
						>
							Back
						</Button>
					))}
				<Box className={classes.RightMenu}>
					<form>
						<input
							type='file'
							id='file'
							accept='.obf, .obz'
							ref={inputFile}
							style={{ display: 'none' }}
							onChange={onFileUpload}
						/>
					</form>
					{isMobile
						? [
								<IconButton key='menuButton' onClick={onOpenMenu}>
									<MenuIcon />
								</IconButton>,
								<Menu
									key='menu'
									anchorEl={menuAnchor}
									keepMounted={true}
									open={Boolean(menuAnchor)}
									onClose={onCloseMenu}
								>
									<MenuItem
										key='settings'
										onClick={() => {
											onOpenSettings();
											onCloseMenu();
										}}
									>
										<SettingsIcon />
										<Typography className={classes.MenuItemTypography} align='center'>
											Settings
										</Typography>
									</MenuItem>
									<MenuItem
										key='open'
										onClick={() => {
											inputFile.current.click();
											onCloseMenu();
										}}
									>
										<FolderIcon />
										<Typography className={classes.MenuItemTypography} align='center'>
											Open
										</Typography>
									</MenuItem>
									<MenuItem
										key='export'
										onClick={() => {
											onExport();
											onCloseMenu();
										}}
									>
										<GetAppIcon />
										<Typography className={classes.MenuItemTypography} align='center'>
											Export
										</Typography>
									</MenuItem>
									<MenuItem
										key='edit'
										onClick={() => {
											onOpenEdit();
											onCloseMenu();
										}}
									>
										<EditIcon />
										<Typography className={classes.MenuItemTypography} align='center'>
											Edit
										</Typography>
									</MenuItem>
								</Menu>,
						  ]
						: [
								<Button
									key='settings'
									className={classes.Button}
									startIcon={<SettingsIcon />}
									variant='contained'
									color='primary'
									size='small'
									onClick={onOpenSettings}
								>
									Settings
								</Button>,
								<Button
									key='open'
									className={classes.Button}
									startIcon={<FolderIcon />}
									variant='contained'
									color='primary'
									size='small'
									onClick={() => inputFile.current.click()}
								>
									Open
								</Button>,
								<Button
									key='export'
									className={classes.Button}
									startIcon={<GetAppIcon />}
									variant='contained'
									color='primary'
									size='small'
									onClick={onExport}
								>
									Export
								</Button>,
								<Button
									key='edit'
									className={classes.Button}
									startIcon={<EditIcon />}
									variant='contained'
									color='primary'
									size='small'
									onClick={onOpenEdit}
								>
									Edit
								</Button>,
						  ]}
				</Box>
			</Toolbar>
		</AppBar>
	);
};

NavigationBar.propTypes = {
	onOpenSettings: PropTypes.func.isRequired,
	onOpenEdit: PropTypes.func.isRequired,
	onFileUpload: PropTypes.func.isRequired,
	onExport: PropTypes.func.isRequired,
	openPreviousBoard: PropTypes.func.isRequired,
	history: PropTypes.array,
};

export default NavigationBar;
