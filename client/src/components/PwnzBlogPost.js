import React, { Component } from "react";
import "./PwnzBlogPost.css";
import PwnzTextContainer from "./PwnzTextContainer";
import { iso8601ToDateStr } from './pwnz';

export default class PwnzBlogPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.post.title,
      text: this.props.post.text,
      dateEdited: this.props.post.dateEdited,
      editMode: false,
      format: 'mini',//mini or basic
    };
  }

  toggleFormat = () => {

  };

  handleTitleChange = (title) => {
    this.setState({
      title: title
    })
  }

  handleTextChange = (text) => {
    this.setState({
      text: text
    })
  }

  turnEditMode = () => {
    const savedTitle = this.state.title;
    const savedText = this.state.text;
    console.log('KEKEKS')
    this.setState({
      editMode: true,
      savedTitle: savedTitle,
      savedText: savedText
    });
  };

  saveChanges = () => {
    const newTitle = this.state.title;
    const newText = this.state.text;
    const alert = {};
    if (newTitle === "" || newText === "") {
      alert.status = "red";
      alert.text = "Title and text fields can not be empty";
    }
    if (alert.status === "red") {
      this.setState({
        alert: alert
      });
      return;
    }
    this.setState({
      editMode: false,
      alert: null
    });
    this.props.change({
      id: this.props.post._id,
      title: newTitle,
      text: newText
    })
  };

  discardChanges = () => {
    this.setState({
      editMode: false,
      title: this.state.savedTitle,
      text: this.state.savedText
    });
  };

  deletePost = () => {
    this.props.delete(this.props.post._id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.post.dateEdited !== this.props.post.dateEdited) {// Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
      this.setState({
        dateEdited: this.props.post.dateEdited
      })
    }

    if (prevProps.post.title !== this.props.post.title) {// Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
      this.setState({
        title: this.props.post.title
      })
    }

    if (prevProps.post.text !== this.props.post.text) {// Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
      this.setState({
        title: this.props.post.text
      })
    }
  }

  render() {
    const { title, text, format, dateEdited } = this.state;
    const titleHeight = {},
      textHeight = {};
    if (format === "mini") {
      titleHeight.min = 20;
      titleHeight.max = 40;
      textHeight.min = 40;
      textHeight.max = 100;
    } else if (format === "basic") {
      titleHeight.min = 20;
      titleHeight.max = 100;
      textHeight.min = 60;
      textHeight.max = 600;
    }

    return (
      <>
        <div className={"pwnzBlogPost"}>
          {this.state.alert ? (
            <div className="pwnzBlogPost-alert">
              <span>{this.state.alert.text}</span>
            </div>
          ) : null}

          <div
            className="pwnzBlogPost-title"
          >
            <PwnzTextContainer
              value={title}
              minHeight={titleHeight.min}
              maxHeight={titleHeight.max}
              placeholder={"Enter title"}
              editable={this.state.editMode}
              textAlign={"center"}
              onChange={this.handleTitleChange}
            />


          </div>
          <div className="pwnzBlogPost-content">

            <PwnzTextContainer
              value={text}
              minHeight={textHeight.min}
              maxHeight={textHeight.max}
              placeholder={"Enter title"}
              editable={this.state.editMode}
              textAlign={"left"}
              onChange={this.handleTextChange}
            />
          </div>
          <div className='pwnzBlogPost-footer'>
            <span>{`Posted by ${this.props.post.createdBy} ${iso8601ToDateStr(this.props.post.date)}`}</span>
            {dateEdited ?
              <span>{`Edited by ${this.props.post.editedBy} ${iso8601ToDateStr(dateEdited)}`}</span>
              : null}
          </div>
          <div className="pwnzBlogPost-controls">
            <div className='pwnz-bwdm'>
              <div className='pwnz-dotsButton pwnz-bwdm-bd'>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className='pwnz-bwdm-c pwnz-dropmenu-down-left pwnz-p10' style={{ display: 'none' }}>
                <div className='pwnz-dropmenu-inner'>
                  {this.props.editable ?
                    <>
                      <div className='pwnz-bwtm'>
                        <div className='pwnz-bwtm-bd'>
                          <span className='pwnz-button pwnz-bwtm-b' onClick={this.turnEditMode}>Edit</span>
                          <span style={{ display: 'none' }} className='pwnz-button pwnz-bwtm-b pwnz-disabled pwnz-nowrap'>Save changes?</span>
                        </div>
                        <div className='pwnz-bwtm-c pwnz-f-c' style={{ display: 'none' }}>

                          <div className='pwnz-button pwnz-f-grow1' onClick={this.saveChanges}>
                            <span className='pwnz-nowrap pwnz-nowrap pwnz-bwtm-cb'>Yes</span>
                          </div>
                          <div className='pwnz-button pwnz-f-grow1'>
                            <span className='pwnz-nowrap pwnz-bwtm-cb' onClick={this.discardChanges}>No</span>
                          </div>
                        </div>
                      </div>
                      <div className='pwnz-bwtm'>
                        <div className='pwnz-bwtm-bd'>
                          <span className='pwnz-button pwnz-bwtm-b'>Delete</span>
                          <span style={{ display: 'none' }} className='pwnz-button pwnz-bwtm-b pwnz-disabled pwnz-nowrap'>Are you sure?</span>
                        </div>
                        <div className='pwnz-bwtm-c pwnz-f-c' style={{ display: 'none' }}>

                          <div className='pwnz-button pwnz-f-grow1' onClick={this.deletePost}>
                            <span className='pwnz-nowrap'>Yes</span>
                          </div>
                          <div className='pwnz-button pwnz-f-grow1'>
                            <span className='pwnz-nowrap pwnz-bwtm-cb'>No</span>
                          </div>
                        </div>
                      </div>
                    </>
                    : null}
                  <div className='pwnz-button pwnz-f-c'>
                    <span className='pwnz-nowrap' onClick={this.deletePost}>Report</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
