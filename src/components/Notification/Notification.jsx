import MuiAlert from '@material-ui/lab/Alert';

const Notification = (props) => {
	return <MuiAlert elevation={5} variant='filled' {...props} />;
};

export default Notification;
