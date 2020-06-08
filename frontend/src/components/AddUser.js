import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

const API_URL = process.env.REACT_APP_API_URL;

const useStyles = makeStyles((theme) => ({
  root: {
	width: '20%',
	margin: '10px',
  },
  paper: {
	padding: theme.spacing(2),
	height: '100%'
  },
  addGrid:{
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center'
  }
}));

export default function AddUser(props) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {

		if (name.length < 3) {
			alert('Please, enter the name of the user.');
			return;
		}

		window.fetch(API_URL+'/users', {
			method: 'POST', 
			cache: 'no-cache',
			headers: {
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify({name})
		  })
		.then( response => response.json() )
		.then( json => {setOpen(false); setName(''); props.addAction(json); })
		.catch ( error => console.log(error) );
  }
  

  return (
	<>
		<div className={classes.root}>
		<Paper className={classes.paper}>
			<Grid className={classes.addGrid}>
				<PersonAddIcon style={{fontSize:'50px', marginTop:-10}}/>
				<Button color="primary" onClick={handleClickOpen}>Add user</Button>
			</Grid>
		</Paper>
		</div>
		<Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
			<DialogTitle id="form-dialog-title">Add user</DialogTitle>
			<DialogContent>
				<TextField
					autoFocus
					margin="dense"
					id="name"
					label="Name"
					type="string"
					fullWidth
					value={name}
					onChange={ evt => setName(evt.target.value) }
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleSave} color="primary">
					Save
				</Button>
				<Button onClick={handleClose} color="primary">
					Cancel
				</Button>
			</DialogActions>
      	</Dialog>
	</>
  );
}