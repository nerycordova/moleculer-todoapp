const mongoose = require("mongoose");
const Task  = require("../../models/tasks.model");
const User  = require("../../models/users.model");

const taskId = new mongoose.Types.ObjectId();

const taskToBeCreated = {
	description:"Write documentation",
};


const setupDatabase = async () => {
	await Task.deleteMany(); //delete all tasks
};

module.exports = {
	taskId,
	taskToBeCreated,
	setupDatabase,
};