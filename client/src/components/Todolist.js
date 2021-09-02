import React, { Component } from "react";
import "./Todolist.css";
import $ from "jquery";
import DatePicker from "./DatePicker.js";
import PwnzTextContainer from './PwnzTextContainer';

class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      format: this.props.format || "basic",
      task: this.props.task,
      editable:false,
      text:null
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

  optionsButton= {
    mini: 'Opt',
    basic: 'Options'
  }

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
      task: updatedTask
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

  deleteTask = () => {
    this.props.deleteTask(this.props.task._id);
  }

  getStatusButtonText = (status) => {
    if (status === "active")
      return this.statusChangeButton[this.state.format][0]; //"Move to done";
    if (status === "done") return this.statusChangeButton[this.state.format][1];
    if (status === "archived")
      return this.statusChangeButton[this.state.format][2];
  };

  turnEditMode=()=>{
    this.setState({
      editable:true
    })
  }

  handleTextChange=(newText)=>{
    this.setState({
      text:newText
    })
  }

  saveChanges=async ()=>{
    const updatedTask={...this.state.task,text:this.state.text};
    await this.props.taskChange(updatedTask);
    this.setState({
      text:'',
      editable:false
    })
  }

  discardChanges=()=>{
    this.setState({
      text:'',
      editable:false
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.task !== this.props.task) {
      this.setState({
        task: this.props.task
      })

    }
  }

  render() {
    const format = this.state.format;
    const task = this.state.task;
    const text = this.state.text===null?task.text:this.state.text;
    const datePickerText = task.doneDate || task.deadline;
    const statusButtonText = this.getStatusButtonText(task.status);

    return (
      <div className="todolist-task pwnz-f-c">
        <PwnzTextContainer
          value={text}
          editable={this.state.editable}
          onChange={this.handleTextChange}
          minHeight={25}
          maxHeight={90}
          textAlign={"left"}
        />
        <DatePicker
          format={format}
          selectedDate={datePickerText}
          datePick={this.handleDatePick}
          disabled={this.state.task.doneDate}
        />
        <div className='pwnz-bwdm pwnz-ml5'>
        <div className='pwnz-dotsButton-mini pwnz-bwdm-bd'>
                <span></span>
                <span></span>
                <span></span>
              </div>
          <div className='pwnz-bwdm-c pwnz-bwdm-downLeft pwnz-p10' style={{ display: 'none' }}>
            <div className='pwnz-button pwnz-f-c pwnz-w100' >
              <div className='pwnz-nowrap pwnz-bwdm-cb' onClick={this.handleStatusChange}>{statusButtonText}</div>
            </div>
            <div className='pwnz-bwtm pwnz-mt5'>
              <div className='pwnz-button pwnz-bwtm-bd'>
                <div className='pwnz-bwtm-b' onClick={this.turnEditMode}>Edit</div>
                <div style={{ display: 'none' }} className='pwnz-bwtm-b pwnz-disabled pwnz-nowrap'>Save changes?</div>
              </div>
              <div className='pwnz-bwtm-c pwnz-f-c pwnz-mt5' style={{ display: 'none' }}>
                <div className='pwnz-button pwnz-f-grow1' >
                  <div className='pwnz-nowrap pwnz-nowrap pwnz-bwdm-cb pwnz-bwtm-cb' onClick={this.saveChanges}>Yes</div>
                </div>
                <div className='pwnz-button pwnz-f-grow1 pwnz-ml5'>
                  <div className='pwnz-nowrap pwnz-bwtm-cb' onClick={this.discardChanges}>No</div>
                </div>
              </div>
            </div>
            <div className='pwnz-bwtm'>
              <div className='pwnz-button pwnz-bwtm-bd pwnz-mt5'>
                <div className='pwnz-bwtm-b'>{this.deleteButton[format]}</div>
                <div style={{ display: 'none' }} className='pwnz-bwtm-b pwnz-disabled pwnz-nowrap'>Are you sure?</div>
              </div>
              <div className='pwnz-bwtm-c pwnz-f-c pwnz-mt5' style={{ display: 'none' }}>
                <div className='pwnz-button pwnz-f-grow1'>
                  <div className='pwnz-nowrap pwnz-bwdm-cb pwnz-bwtm-cb' onClick={this.deleteTask}>Yes</div>
                </div>
                <div className='pwnz-button pwnz-f-grow1 pwnz-ml5'>
                  <div className='pwnz-nowrap pwnz-bwtm-cb'>No</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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

  changeInput = (val) => {
    this.setState({ input: val });
  };

  addTask = () => {
    let { input } = this.state;
    if (input === '') return;
    this.props.addTask(input);
    this.setState({ input: "" });
  };

  buttonText = {
    mini: "+",
    basic: "Add task"
  };

  render() {
    return (
      <div className="pwnz-f-c-stretch">
        <PwnzTextContainer
          onChange={this.changeInput}
          value={this.state.input}
          minHeight={25}
          maxHeight={170}
          placeholder={"Whats next?"}
          editable={true}
          textAlign={"left"}
        />
        <div className='pwnz-button pwnz-ml5' >
          <div onClick={this.addTask} className='pwnz-nowrap'>{this.buttonText[this.state.format]}</div>
        </div>
      </div>
    );
  }
}

class Todolist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      format: this.props.format || "basic", //format can be mini and basic
      loading: true,
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

  createTask = async (newTaskText) => {
    try {
      const method = 'POST';
      const body = JSON.stringify({
        task: {
          text: newTaskText,
          status: 'active'
        }
      });
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.props.user.token}`
      }
      const task = await fetch('/api/todolist/create', { method, body, headers })
        .then(data => data.json());
      if (task) {
        this.setState({
          tasks: this.state.tasks.concat(task)
        })
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  updateTask = async (updatedTask) => {
    try {
      const method = 'POST';
      const body = JSON.stringify({
        task: updatedTask
      });
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.props.user.token}`
      }
      const response = await fetch('/api/todolist/update', { method, body, headers })

      if (response.status === 201) {
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

  getTasks = async () => {
    try {
      const method = 'GET';
      const body = null;
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.props.user.token}`
      };
      const tasks = await fetch('/api/todolist', { method, body, headers })
        .then(data => data.json());
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

  deleteTask = async (id) => {
    try {
      const method = 'POST';
      const body = JSON.stringify({
        id: id
      });
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.props.user.token}`
      };
      const response = await fetch('/api/todolist/delete', { method, body, headers })
      if (response.status === 201) {
        this.setState({
          tasks: this.state.tasks.filter(task => task._id !== id)
        })
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  componentDidMount = async () => {
    const tasks = await this.getTasks();
    if (tasks) {
      this.setState({
        tasks: tasks,
        loading: false
      })
    }
  }

  render() {

    const format = this.state.format;
    const tasks = this.state.tasks;
    const activeTasks = tasks.filter((task) => task.status === "active");
    const doneTasks = tasks.filter((task) => task.status === "done");
    const archivedTasks = tasks.filter((task) => task.status === "archived");


    if (format === "mini") {
      return (
        <div className="todolist-item-mini">
          {activeTasks.length ? null : <span className='pwnz-mb10'>No active tasks found</span>}
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
              <span className="pwnz-title pwnz-mb10">Active: {activeTasks.length}</span>
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
              <span className="pwnz-title pwnz-mb10">Done: {doneTasks.length}</span>
              <div className='pwnz-bwtm'>
                <div className='pwnz-button pwnz-bwtm-bd'>
                  <div className='pwnz-bwtm-b'>Show</div>
                  <div style={{ display: 'none' }} className='pwnz-bwtm-b'>Hide</div>
                </div>
                <div className='pwnz-bwtm-c' style={{ display: 'none' }}>
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
              <span className="pwnz-title pwnz-mb10">Archived: {archivedTasks.length}</span>
              <div className='pwnz-bwtm'>
                <div className='pwnz-button pwnz-bwtm-bd'>
                  <div className='pwnz-bwtm-b'>Show</div>
                  <div style={{ display: 'none' }} className='pwnz-bwtm-b'>Hide</div>
                </div>
                <div className='pwnz-bwtm-c' style={{ display: 'none' }}>
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
