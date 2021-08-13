import React, { Component } from "react";
import "./PwnzTextContainer.css";
import $ from "jquery";

export default class PwnzTextarea extends Component {
  constructor(props) {
    super(props);
    this.textareaRef = React.createRef();
  }


  handleValueChange=(e)=>{
    this.props.onChange(e.target.value);
  }

  adjustHeight=()=>{
    const textarea = $(this.textareaRef.current);
    textarea.height(this.props.minHeight);
    const newHeight=textarea.prop('scrollHeight')
    -parseInt(textarea.css('padding-top'))
    -parseInt(textarea.css('padding-bottom'))
    textarea.height(Math.max(this.props.minHeight,newHeight));
  }

  componentDidMount = () => {
      this.adjustHeight();
  };

  componentDidUpdate = (prevProps) => {
    this.adjustHeight();
  };

  render() {

    const className =
      "pwnz-textContainer  " + "pwnz-textContainer-" + (this.props.textAlign?this.props.textAlign:'left');
    const placeholder = this.props.placeholder || "Enter your text";
    const editable = this.props.editable || false;
    const textContainerClassName = editable ? "pwnz-textContainer-editable" : "";
      return (
        <div
          className={className}
          style={{
              minHeight:this.props.minHeight+'px',
              maxHeight:this.props.maxHeight+'px'
          }}
        >
            <textarea
            className={textContainerClassName}
            value={this.props.value}
            placeholder={placeholder || "Enter your text"}
            onChange={this.handleValueChange}
            readOnly={editable ? undefined : "readonly"}
            ref={this.textareaRef}
         />     
        </div>
      );
    }
    
  }


/** <textarea
          rows={this.state.rows}
          value={this.state.value}
          placeholder={placeholder || "Enter your text"}
          onChange={this.adjustRows}
          readOnly={editable ? undefined : "readonly"}
          ref={this.textareaRef}
        /> 
        
        
        <div
        className={className}
        //style={{
          //maxHeight: this.props.maxHeight + "px",
          //minHeight: this.props.minHeight + "px"
        //}}
      >
        {this.state.criteria==='height'? 
          <textarea
          style={{
            height:'1.5em'
          }}
          value={this.state.value}
          placeholder={placeholder || "Enter your text"}
          onChange={this.adjustHeight}
          readOnly={editable ? undefined : "readonly"}
          ref={this.textareaRef}
       />:
          <textarea
          rows={this.state.rows}
          value={this.state.value}
          placeholder={placeholder || "Enter your text"}
          onChange={this.adjustRows}
          readOnly={editable ? undefined : "readonly"}
          ref={this.textareaRef}
        />
        }        
      </div>
        
        
        */