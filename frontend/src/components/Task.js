import React from "react";

import Switch from '@material-ui/core/Switch';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

const API_URL = process.env.REACT_APP_API_URL;

const Task = (props) => {

	const task = props.task;
	const [tState, setTState] = React.useState(task.state);

	const handleStateChange = () => {
		
		let newState = !tState;
		setTState(newState);
		window.fetch(API_URL+'/tasks/'+task._id, {
			method: 'PATCH', 
			cache: 'no-cache',
			headers: {
			'Content-Type': 'application/json'
			},
			body: JSON.stringify({state : newState})
		})
		.then( response => response.json() )
		.then( json => {})
		.catch ( error => console.log(error) );
	}


	return (
		<TableRow key={task.name}>
			<TableCell component="th" scope="row">
				{task.description}
			</TableCell>
			<TableCell align="right">
				<Switch
					checked={tState}
					onChange={handleStateChange}
					color="primary"
					name="completed"
					inputProps={{ 'aria-label': 'primary checkbox' }}
				/>
			</TableCell>
		</TableRow>
	)

}

export default Task;