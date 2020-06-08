import React from "react";
import { makeStyles } from '@material-ui/core/styles';

import User from "./User";
import Loader from "./Loader";
import AddUser from "./AddUser";

const API_URL = process.env.REACT_APP_API_URL;

const useStyles = makeStyles((theme) => ({
	root: {
	  display: 'flex',
	  flexDirection: 'row',
	  flexWrap: 'wrap'
	},
  }));
  

const Users = (props) => {

	const classes = useStyles();

	const [users, setUsers] = React.useState([]);
	const [isLoading, setIsLoading] = React.useState(false);

	const fetchUsers = () => {
		window.fetch(API_URL+'/users')
			.then( response => response.json() )
			.then( json => { setUsers(json); setIsLoading(false); })
			.catch( error => console.log(error) ) ;
	}

	const handleAddUser = (user) =>{
		setUsers( [
			user,
			...users
		] )
	}

	const handleDeleteUser = (id) => {
		setUsers( users => users.filter( user => user._id !== id ));
	}

	const handleUpdateUser = (id, name) => {
		setUsers( users => users.map( user => {
			if (user._id === id){
				user.name = name;
			}
			return user;
		}));
	}

	React.useEffect( () => {

		setIsLoading(true);
		fetchUsers();

	} , []);


	if (isLoading) return <Loader />

	return(
		<>
			<h1>Users</h1>
			<div className={classes.root}>
				<AddUser addAction={handleAddUser}/>
				{users.map( user => <User data={user} key={user._id} deleteAction={handleDeleteUser} updateAction={handleUpdateUser} /> )}
			</div>
		</>
	)

}

export default Users;