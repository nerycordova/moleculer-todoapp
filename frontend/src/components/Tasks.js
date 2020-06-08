import React from "react";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Task from './Task';
import Switch from '@material-ui/core/Switch';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

import Loader from "./Loader";

const API_URL = process.env.REACT_APP_API_URL;

const useStyles = makeStyles({
	table: {
	  minWidth: 650,
	},
 });

const Tasks = (props) => {

	const classes = useStyles();

	const [tasks, setTasks] = React.useState([]);
	const [isLoading, setIsLoading] = React.useState(false);
	const [addingTask, setAddingTask] = React.useState(false);
	const [newTaskState, setNewTaskState] = React.useState(false);
	const [newTaskDesc, setNewTaskDesc] = React.useState('');

	const fetchTasks = () => {
		window.fetch(API_URL+'/tasks/user/'+props.user._id)
			.then( response => response.json() )
			.then( json => { setTasks(json); setIsLoading(false); })
			.catch( error => console.log(error) ) ;
	}

	const handleSaveNewTask = () => {
		if (newTaskDesc.length < 3) {
			alert('Please, enter a task description');
			return;
		}
		window.fetch(API_URL+'/tasks', {
			method: 'POST', 
			cache: 'no-cache',
			headers: {
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify({description: newTaskDesc, state: newTaskState, user_id: props.user._id})
		  })
		.then( response => response.json() )
		.then( json => { 
			setAddingTask(false); setNewTaskDesc(''); setNewTaskState(false);
			setTasks( tasks => [json, ...tasks] );
		})
		.catch ( error => console.log(error) );
	}	

	React.useEffect( () => {

		setIsLoading(true);
		fetchTasks();

	} , []);

	if (isLoading) return <Loader />

	return (
		<Dialog open={true} onClose={props.closeTasks} aria-labelledby="form-dialog-title" maxWidth="lg">
			<DialogTitle id="form-dialog-title">{props.user.name}'s tasks</DialogTitle>
			<DialogContent>

				<TableContainer component={Paper}>
					<Table className={classes.table} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>Description</TableCell>
								<TableCell align="right">Completed</TableCell>
							</TableRow>
						</TableHead>

						<TableBody>
					
						<TableRow key="new_record">
							{!addingTask &&
								<TableCell component="th" scope="row" colspan={2} style={{textAlign:'center'}}>
									<IconButton color="primary" style={{marginTop:-10}} onClick={() => { setAddingTask(true)}}>
										<AddIcon />
									</IconButton>
								</TableCell>
							}

							{addingTask && 
								<>
									<TableCell component="th" scope="row">
										<TextField
											autoFocus
											margin="dense"
											id="name"
											label="Description"
											type="string"
											fullWidth
											value={newTaskDesc}
											onChange={ evt => setNewTaskDesc(evt.target.value) }
										/>

										<Button color="primary" onClick={ () => handleSaveNewTask() }>
											Save
										</Button>
										<Button color="primary" onClick={ () => { setAddingTask(false); setNewTaskDesc(''); setNewTaskState(false); } }>
											Cancel
										</Button>

									</TableCell>
									<TableCell align="right">
										<Switch
											checked={newTaskState}
											onChange={() => { setNewTaskState(!newTaskState) } }
											color="primary"
											name="new_task_state"
											inputProps={{ 'aria-label': 'primary checkbox' }}
										/>
									</TableCell>
								</>
							}
						</TableRow>
						{tasks.length === 0 && (
							<TableRow key="no_records">
								<TableCell component="th" scope="row" colspan={2} style={{textAlign:'center', color:'red'}}>
									No records found
								</TableCell>
							</TableRow>
						)}
						{tasks.length > 0 &&
							tasks.map((task) => (
								<Task task={task} key={task._id}/>
							))
						}
						</TableBody>
					</Table>
				</TableContainer>
				
			</DialogContent>
			<DialogActions>
				<Button onClick={props.closeTasks} color="primary">
					Close
				</Button>
			</DialogActions>
		</Dialog>

	)

}

export default Tasks;