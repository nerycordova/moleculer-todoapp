const mongoose = require("mongoose");
const User  = require("../../models/users.model");

const userOne = {
	_id : new mongoose.Types.ObjectId(),
	name:"Nery Chucuy"
};

const userTwo = {
	_id : new mongoose.Types.ObjectId(),
	name:"John Doe",
};

const userToBeCreated = {
	name:"Mary Doe",
};

const setupDatabase = async () => {
	await User.deleteMany(); //delete all users
	//Setup test users
	await new User(userOne).save();
	await new User(userTwo).save();
};

module.exports = {
	userOne,
	userTwo,
	userToBeCreated,
	setupDatabase,
};