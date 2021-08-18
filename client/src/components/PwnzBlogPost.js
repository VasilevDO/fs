import React, { Component } from "react";
import "./PwnzBlogPost.css";
import PwnzTextContainer from "./PwnzTextContainer";
import { iso8601ToDateStr } from './pwnz';
import $ from 'jquery';

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

  handlePostLike = () => {
    this.props.onLike(this.props.post._id);
  }

  handlePostDislike = () => {
    this.props.onDislike(this.props.post._id);
  }

  reportPost=(e)=>{
    const target=$(e.target);
    target.closest('.pwnz-bwdm-c').hide(500);
    this.props.onReport(this.props.post)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.post !== this.props.post) {
      this.setState({
        title: this.props.post.title,
        text: this.props.post.text,
        dateEdited: this.props.post.dateEdited
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

    const isLiked = !!this.props.post.likedBy.find(item => item === this.props.user.userId);
    const isDisliked = !!this.props.post.dislikedBy.find(item => item === this.props.user.userId);
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
            <div className='pwnz-f-c'>
              <span>{`#${this.props.post.number}`}&nbsp;</span>
              <span>{`Posted by ${this.props.post.createdBy} ${iso8601ToDateStr(this.props.post.date)}`}</span>
              {dateEdited ?
                <span>{` / Edited by ${this.props.post.editedBy} ${iso8601ToDateStr(dateEdited)}`}</span>
                : null}
            </div>
            <div className='pwnz-f-c'>
              <div className={'pwnz-button pwnz-f-c' + (isLiked ? ' pwnz-checked' : '')} >
                <div className='pwnz-nowrap' onClick={this.handlePostLike}>{`Like (${this.props.post.likedBy.length})`}</div>
              </div>
              <div className={'pwnz-button pwnz-f-c pwnz-ml5' + (isDisliked ? ' pwnz-checked' : '')} >
                <div className='pwnz-nowrap' onClick={this.handlePostDislike}>{`Dislike (${this.props.post.dislikedBy.length})`}</div>
              </div>
            </div>

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
                        <div className='pwnz-button pwnz-bwtm-bd'>
                          <div className='pwnz-bwtm-b' onClick={this.turnEditMode}>Edit</div>
                          <div style={{ display: 'none' }} className='pwnz-bwtm-b pwnz-disabled pwnz-nowrap'>Save changes?</div>
                        </div>
                        <div className='pwnz-bwtm-c pwnz-f-c' style={{ display: 'none' }}>

                          <div className='pwnz-button pwnz-f-grow1' onClick={this.saveChanges}>
                            <div className='pwnz-nowrap pwnz-nowrap pwnz-bwtm-cb'>Yes</div>
                          </div>
                          <div className='pwnz-button pwnz-f-grow1'>
                            <div className='pwnz-nowrap pwnz-bwtm-cb' onClick={this.discardChanges}>No</div>
                          </div>
                        </div>
                      </div>
                      <div className='pwnz-bwtm'>
                        <div className='pwnz-button pwnz-bwtm-bd'>
                          <div className='pwnz-bwtm-b'>Delete</div>
                          <div style={{ display: 'none' }} className='pwnz-bwtm-b pwnz-disabled pwnz-nowrap'>Are you sure?</div>
                        </div>
                        <div className='pwnz-bwtm-c pwnz-f-c' style={{ display: 'none' }}>

                          <div className='pwnz-button pwnz-f-grow1'>
                            <div className='pwnz-nowrap' onClick={this.deletePost}>Yes</div>
                          </div>
                          <div className='pwnz-button pwnz-f-grow1'>
                            <div className='pwnz-nowrap pwnz-bwtm-cb'>No</div>
                          </div>
                        </div>
                      </div>
                    </>
                    : null}
                  <div className='pwnz-button'>
                    <div className='pwnz-nowrap' onClick={this.reportPost}>Report</div>
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
