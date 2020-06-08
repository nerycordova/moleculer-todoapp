import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FaceIcon from '@material-ui/icons/Face';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

import Tasks from './Tasks';

const API_URL = process.env.REACT_APP_API_URL;

const useStyles = makeStyles((theme) => ({
  root: {
	margin: '10px',
	width: '20%'
  },
  paper: {
	padding: theme.spacing(2),
  }
}));

export default function User(props) {
  const classes = useStyles();

  const [name, setName] = React.useState(props.data.name);
  const [open, setOpen] = React.useState(false);
  const [showTasks, setShowTasks] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {

		if (name.length < 3) alert('Por favor, escribe un nombre.');

		window.fetch(API_URL+'/users/'+props.data._id, {
			method: 'PATCH', 
			cache: 'no-cache',
			headers: {
			'Content-Type': 'application/json'
			},
			body: JSON.stringify({name})
		})
		.then( response => response.json() )
		.then( json => {setOpen(false);  props.updateAction(props.data._id, name); })
		.catch ( error => console.log(error) );
	}

  const handleDelete = (id) => {
	window.fetch(API_URL+'/users/'+id, {
		method: 'DELETE', 
		cache: 'no-cache'
	  })
	.then( response => response.json() )
	.then( json => props.deleteAction(id) )
	.catch ( error => console.log(error) );
  }


  return (
	  <>
			<div className={classes.root}>
			<Paper className={classes.paper}>
				<Grid>
				<Grid item xs sm container>
					<Grid item>
					<FaceIcon />
					</Grid>
					<Grid item xs container direction="column" spacing={2} style={{marginLeft:'0px'}}>
					<Grid item>
						<Typography gutterBottom variant="subtitle1">
						{props.data.name}
						</Typography>
					</Grid>
					</Grid>
					<Grid item>
						<IconButton color="secondary" style={{marginTop:-10}} onClick={() => handleDelete(props.data._id)}>
							<DeleteIcon />
						</IconButton>
					</Grid>
				</Grid>
				<Grid item xs style={{textAlign:'center'}}>
					<Button color="primary" onClick={()=> handleClickOpen() }>Edit</Button>
					<Button color="primary" style={{marginLeft:10}} onClick={()=> setShowTasks(true)}>Tasks</Button>
				</Grid>
				</Grid>
			</Paper>
			</div>

			<Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
				<DialogTitle id="form-dialog-title">Edit user</DialogTitle>
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

			{showTasks && <Tasks user={props.data} closeTasks={()=>{setShowTasks(false)}}/>}
		</>
  );
}