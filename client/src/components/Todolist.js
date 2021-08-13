import React, { Component } from "react";
import "./Todolist.css";
import $ from "jquery";
import DatePicker from "./DatePicker.js";
import {Loader} from './Loader';

class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      format: this.props.format || "basic",
      task: this.props.task
    };
  }

  statusChangeButton = {
    mini: ["✓", "📁", "↻"],
    basic: ["Move to done", "Move to archive", "Move to active"]
  };

  deleteButton = {
    mini: 'Del',
    basic: 'Delete'
  };

  dateToStrFormat = (date) => {
    if (!date) return null;
    let day = date.getDate();
    let month = date.getMonth() + 1; //+1 coz months starting from 0
    let year = date.getFullYear();
    if (day < 10) day = "0" + day;
    if (month < 10) month = "0" + month;
    return day + "." + month + "." + year;
  };

  timeToStrFormat = (time) => {
    if (!time) return null;
    return time.hours + ":" + time.minutes;
  };

  handleDatePick = (deadline) => {
    let updatedTask = this.state.task;
    updatedTask.deadline = deadline;
    this.props.taskChange(updatedTask);
    this.setState({
      task:updatedTask
    })
  };

  handleStatusChange = () => {
    const updatedTask = this.state.task;
    updatedTask.status =
      updatedTask.status === "active"
        ? "done"
        : updatedTask.status === "done"
        ? "archived"
        : "active";
    if (updatedTask.status === "active") {
      updatedTask.doneDate = null;
    }

    if (updatedTask.status === "done") {
      let now = new Date();
      let doneDate =
        this.timeToStrFormat({
          hours: now.getHours() < 10 ? "0" + now.getHours() : now.getHours(),
          minutes:
            now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes()
        }) +
        " " +
        this.dateToStrFormat(now);
      updatedTask.doneDate = doneDate;
    }
    this.props.taskChange(updatedTask);
  };

  deleteTask=()=> {
    this.props.deleteTask(this.props.task._id);
  }

  getStatusButtonText = (status) => {
    if (status === "active")
      return this.statusChangeButton[this.state.format][0]; //"Move to done";
    if (status === "done") return this.statusChangeButton[this.state.format][1];
    if (status === "archived")
      return this.statusChangeButton[this.state.format][2];
  };

  render() {
 
    const format = this.state.format;
    const task = this.state.task;
    const text = task.text;
    const className = "todolist-task";
    const datePickerText = task.doneDate || task.deadline;
    const statusButtonText = this.getStatusButtonText(task.status);
    
    if (format === "mini") {
      return (
        <div className={className}>
          <p>
            <div className='pwnz-buttonWithToggleMenu'>
                <button className='pwnz-buttonWithToggleMenu-button'>{this.deleteButton[format]}</button>
                <div className='pwnz-toggleMenu' style={{display:'none'}}>
                  <span>Are you sure?</span>
                  <button onClick={this.deleteTask}>Yes</button>
                  <button className='pwnz-buttonWithToggledDiv-closeButton'>No</button>
                </div>
              </div>
            <button onClick={this.handleStatusChange}>
              {statusButtonText}
            </button>
            <DatePicker
              format={format}
              selectedDate={datePickerText}
              datePick={this.handleDatePick}
              disabled={this.state.task.doneDate}
            ></DatePicker>
            {text}
          </p>
        </div>
      );
    } else if (format === "basic") {
      return (
        <div className={className}>
          <p>
            <div className='pwnz-buttonWithToggleMenu'>
              <button className='pwnz-buttonWithToggleMenu-button'>{this.deleteButton[format]}</button>
              <div className='pwnz-toggleMenu' style={{display:'none'}}>
                <span>Are you sure?</span>
                <button onClick={this.deleteTask}>Yes</button>
                <button className='pwnz-buttonWithToggledDiv-closeButton'>No</button>
              </div>
            </div>
            <button onClick={this.handleStatusChange}>
              {statusButtonText}
            </button>
            <DatePicker
              format={format}
              selectedDate={datePickerText}
              datePick={this.handleDatePick}
              disabled={this.state.task.doneDate}
            ></DatePicker>
            {text}
          </p>
        </div>
      );
    }
  }
}

class TaskInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      format: this.props.format,
      input: ""
    };
  }

  changeInput = (e) => {
    this.setState({ input: e.target.value });
  };

  addTask = () => {
    let { input } = this.state;
    if (input==='') return;
      this.props.addTask(input);
      this.setState({ input: "" });
  };

  buttonText = {
    mini: "+",
    basic: "Add task"
  };

  render() {
    return (
      <div className="todolist-task-input">
        <input onChange={this.changeInput} value={this.state.input}></input>
        <button onClick={this.addTask} className='pwnz-nowrap'>
          {this.buttonText[this.state.format]}
        </button>
      </div>
    );
  }
}

class Todolist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      format: this.props.format || "basic", //format can be mini and basic
      loading:true,
      tasks: this.props.tasks || [
        {
          id: 0,
          text: "Create new task",
          status: "active"
        },
        {
          id: 1,
          text: "Dont forget to drink some water",
          status: "active",
          deadline: null
        }
      ]
    };
  }

  createTask=async(newTaskText)=> {
    try {
      const method='POST';
      const body = JSON.stringify({
        task:{
          text:newTaskText,
          status:'active'
        }
      });
      const headers={
       'Content-Type':'application/json',
       Authorization:`Bearer ${this.props.user.token}`
      }
      const task=await fetch('/api/todolist/create', {method,body,headers})
      .then(data=>data.json());
      if (task) {
        this.setState({
          tasks:this.state.tasks.concat(task)
        })
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  updateTask=async(updatedTask)=> {
    try {
      const method='POST';
      const body = JSON.stringify({
        task:updatedTask
      });
      const headers={
       'Content-Type':'application/json',
       Authorization:`Bearer ${this.props.user.token}`
      }
      const response=await fetch('/api/todolist/update', {method,body,headers})
      
      if (response.status===201) {
        const updatedTasks = this.state.tasks.map((task) => {
          if (task._id !== updatedTask._id) return task;
          return updatedTask;
        });
        this.setState({
          tasks: updatedTasks
        });
      };
    } catch (e) {
      console.log(e.message);
    }
  }

  getTasks=async () => {
    try {
      const method='GET';
      const body=null;
      const headers={
        'Content-Type':'application/json',
        Authorization:`Bearer ${this.props.user.token}`
      };
      const tasks=await fetch('/api/todolist', {method,body,headers})
      .then(data=>data.json());
      return tasks;
    } catch (e) {
    console.log(e.message);
    }
}



  toggleArchivedTasks = (e) => {
    let target = $(e.target);
    let archive = target.siblings(".archived-tasks");
    if (archive.css("display") === "none") {
      target.text("Hide archive");
      archive.show();
    } else if (archive.css("display") === "block") {
      target.text("Show archive");
      archive.hide();
    }
  };

  deleteTask=async(id)=> {
    try {
      const method='POST';
      const body=JSON.stringify({
        id:id
      });
      const headers={
        'Content-Type':'application/json',
        Authorization:`Bearer ${this.props.user.token}`
      };
      const response=await fetch('/api/todolist/delete', {method,body,headers})
      if (response.status===201) {
        this.setState({
          tasks:this.state.tasks.filter(task=>task._id!==id)
        })
      }
    } catch (e) {
    console.log(e.message);
    }
  }

  componentDidMount=async()=>{
    const tasks=await this.getTasks();
    if (tasks) {
      this.setState({
        tasks:tasks,
        loading:false
      })
    }
  }

  render() {

    if (this.state.loading) {
      return <Loader/>
    }

    const format = this.state.format;
    const tasks = this.state.tasks;
    const activeTasks = tasks.filter((task) => task.status === "active");
    const doneTasks = tasks.filter((task) => task.status === "done");
    const archivedTasks = tasks.filter((task) => task.status === "archived");
  

    if (format === "mini") {
      return (
        <div className="todolist-item-mini">
          {activeTasks.length ? null : <span>No active tasks found</span>}
          {activeTasks.map((task) => (
            <Task
            format={format}
            task={task}
            key={task.id}
            taskChange={this.updateTask}
            deleteTask={this.deleteTask}
            ></Task>
          ))}
          <TaskInput
            format={format}
            className="todolist-task-input"
            addTask={this.createTask}
          ></TaskInput>
        </div>
      );
    } else if (format === "basic") {
      return (
        <>
          <div className="todolist">
            <div className="todolist-item">
              <span className="pwnz-title">Active: {activeTasks.length}</span>
              {activeTasks.map((task) => (
                <Task
                  format={format}
                  task={task}
                  key={task.id}
                  taskChange={this.updateTask}
                  deleteTask={this.deleteTask}
                ></Task>
              ))}
              <TaskInput
                format={format}
                className="todolist-task-input"
                addTask={this.createTask}
              ></TaskInput>
            </div>
            <div className="todolist-item">
              <span className="pwnz-title">Done: {doneTasks.length}</span>
              <div className='pwnz-buttonWithToggleMenu'>
                <button className='pwnz-buttonWithToggleMenu-button pwnz-button-show-hide'>Show</button>
                <div className='pwnz-toggleMenu' style={{display:'none'}}>
                  <div className="done-tasks">
                    {doneTasks.map((task) => (
                      <Task
                        format={format}
                        task={task}
                        key={task.id}
                        taskChange={this.updateTask}
                        deleteTask={this.deleteTask}
                      ></Task>
                    ))}
                </div>
                </div>
              </div>  
            </div>
            <div className="todolist-item">
              <span className="pwnz-title">Archived: {archivedTasks.length}</span>
              <div className='pwnz-buttonWithToggleMenu'>
                <button className='pwnz-buttonWithToggleMenu-button pwnz-button-show-hide'>Show</button>
                <div className='pwnz-toggleMenu' style={{display:'none'}}>
                  <div className="archived-tasks">
                    {archivedTasks.map((task) => (
                      <Task
                        format={format}
                        task={task}
                        key={task.id}
                        taskChange={this.updateTask}
                        deleteTask={this.deleteTask}
                      ></Task>
                    ))}
                </div>
                </div>
              </div>              
            </div>
          </div>
        </>
      );
    }
  }
}

export default Todolist;

/**
 */
