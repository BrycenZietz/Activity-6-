// Activity 6: Interactive To-Do List (Part 2)

// Part A: Application state and element references
let tasks = []; // Stores the tasks
let taskIdCounter = 1; // Gives each task a different ID

// Find the controls once for all functions
const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskBtn");
const todoList = document.getElementById("todo-list");

// Was inside addTask; now returns true or false
function validateTaskInput(taskText) {
    // Validate input
    if (taskText === "") {
        alert("Please enter a task!");
        console.log("Task addition failed: empty input");
        return false; // Input failed validation
    }

    // Reject more than 100 characters
    if (taskText.length > 100) {
        alert("Task is too long! Please keep it under 100 characters.");
        console.log("Task addition failed: too long");
        return false;
    }

    return true; // Input is usable
}

// Part B: Was reading the field; now accepts text and returns the task
function addTask(taskText) {
    // Show activity in the console
    console.log(`Attempting to add task: "${taskText}"`);

    if (!validateTaskInput(taskText)) {
        return null; // No task was added
    }

    // Create task object
    const task = {
        id: taskIdCounter++,
        text: taskText,
        completed: false,
        createdAt: new Date() // Saves the creation time
    };

    // Add to tasks array
    tasks.push(task);
    console.log("Task added to array:", task);

    // Create list item element
    const listItem = createTaskElement(task);

    // Append to list
    todoList.appendChild(listItem);

    // Update statistics
    updateTaskStats();

    console.log(`Task "${taskText}" added successfully. Total tasks: ${tasks.length}`);
    return task; // Send the new task back
}

// Part C: Build the list item element for a task
function createTaskElement(task) {
    // Create list item
    const listItem = document.createElement("li");
    listItem.className = "task-item";
    listItem.setAttribute("data-task-id", task.id); // Connects the row to its task

    // Create task text span
    const taskTextSpan = document.createElement("span");
    taskTextSpan.className = "task-text";
    taskTextSpan.textContent = task.text;

    // Create status span
    const statusSpan = document.createElement("span");
    statusSpan.className = "task-status";

    // Set initial state
    if (task.completed) {
        listItem.classList.add("done");
        statusSpan.textContent = "\u2713 Done";
        statusSpan.classList.add("status-done");
    } else {
        statusSpan.textContent = "\u23F3 Pending";
        statusSpan.classList.add("status-pending");
    }

    // Create a Delete button for this task
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn"; // Apply the red button style
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("data-action", "delete"); // Marks this as a delete click

    // Append everything to the list item
    listItem.appendChild(taskTextSpan);
    listItem.appendChild(statusSpan);

    listItem.appendChild(deleteButton);

    console.log("Created task element:", listItem);
    return listItem; // Sends back the new row
}

// Part D: Toggle a task's completion state
function toggleTaskCompletion(taskId) {
    console.log(`Toggling completion for task ID: ${taskId}`);

    // Find task in array
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
        console.error(`Task with ID ${taskId} not found`);
        return;
    }

    // Toggle completion status
    task.completed = !task.completed;
    console.log(`Task "${task.text}" is now ${task.completed ? 'completed' : 'pending'}`);

    // Find and update DOM element
    const listItem = document.querySelector(`[data-task-id="${taskId}"]`);
    const statusSpan = listItem.querySelector(".task-status");

    if (task.completed) {
        listItem.classList.add("done");
        statusSpan.textContent = "\u2713 Done";
        statusSpan.classList.remove("status-pending");
        statusSpan.classList.add("status-done");
    } else {
        listItem.classList.remove("done");
        statusSpan.textContent = "\u23F3 Pending";
        statusSpan.classList.remove("status-done");
        statusSpan.classList.add("status-pending");
    }

    // Update statistics
    updateTaskStats();
}

// Remove the task from the array and page
function deleteTask(taskId) {
    console.log(`Deleting task ID: ${taskId}`);

    // Find task in array
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
        console.error(`Task with ID ${taskId} not found`);
        return;
    }

    // Keep every other task
    tasks = tasks.filter(t => t.id !== taskId);

    // Remove its row
    const listItem = document.querySelector(`[data-task-id="${taskId}"]`);
    listItem.remove();

    // Update statistics
    updateTaskStats();
    console.log(`Task "${task.text}" deleted. Total tasks: ${tasks.length}`);
}

// Part E: Update the task statistics
function updateTaskStats() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length; // Counts finished tasks
    const pendingTasks = totalTasks - completedTasks;
    // Use task for one, tasks for other counts
    const countLabel = `(${totalTasks} task${totalTasks !== 1 ? 's' : ''})`;

    // Update DOM elements
    document.getElementById("taskCount").textContent = countLabel;
    document.getElementById("totalTasks").textContent = `Total: ${totalTasks}`;
    document.getElementById("completedTasks").textContent = `Completed: ${completedTasks}`;
    document.getElementById("pendingTasks").textContent = `Pending: ${pendingTasks}`;

    console.log(`Stats updated - Total: ${totalTasks}, Completed: ${completedTasks}, Pending: ${pendingTasks}`);
}

// Part F: Was onclick/onkeydown; now uses event listeners

// Function declaration
function handleAddTask() {
    const taskText = taskInput.value.trim(); // Removes outer spaces
    const task = addTask(taskText); // Pass text in and keep the return value

    // Clear input only after success
    if (task !== null) {
        taskInput.value = "";
    }
}

// Function expression; one handler for the whole list
const handleListClick = function(event) {
    const listItem = event.target.closest(".task-item"); // Find the clicked task row
    if (listItem === null) { // Ignore clicks between tasks
        return;
    }

    // Convert the stored ID from text to a number
    const taskId = parseInt(listItem.dataset.taskId);
    console.log(`List clicked: target is <${event.target.tagName.toLowerCase()}>, task ID ${taskId}`);

    // Delete button removes; other task clicks toggle
    if (event.target.dataset.action === "delete") {
        deleteTask(taskId);
    } else {
        toggleTaskCompletion(taskId);
    }
};

// Arrow function for the Enter key
const handleInputKeydown = (event) => {
    if (event.key === "Enter") {
        handleAddTask();
    }
};

// Connect each event to its handler
addTaskButton.addEventListener("click", handleAddTask);
todoList.addEventListener("click", handleListClick);
taskInput.addEventListener("keydown", handleInputKeydown);

// Confirm the script loaded
console.log("To-Do List application loaded");