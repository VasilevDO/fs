import React, { Component } from "react";
import "./PwnzTextarea.css";
import $ from "jquery";

export default class PwnzTextarea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      criteria:this.props.maxRows?'rows':'height',
      value: this.props.value || "",
      placeholder: this.props.placeholder || "Enter your text",
      rows: this.props.rows || this.props.minRows,
      height:this.props.height||this.props.minHeight
    };
    this.textareaRef = React.createRef();
  }

  adjustRows = () => {
    const textareaLineHeight = 16;
    const { minRows, maxRows } = this.state;

    const textarea = this.textareaRef.current;

    const previousRows = textarea.rows;
    textarea.rows = minRows || 1; // reset number of rows in textarea

    
    const currentRows = ~~(textarea.scrollHeight / textareaLineHeight);
    if (currentRows === previousRows) {
      textarea.rows = currentRows;
    }

    if (currentRows >= maxRows) {
      textarea.rows = maxRows;
      textarea.scrollTop = textarea.scrollHeight;
    }

    this.setState({
      value: textarea.value,
      rows: maxRows
        ? currentRows < maxRows
          ? currentRows
          : maxRows
        : currentRows
    });
  };

  adjustHeight=()=>{
    const textarea = this.textareaRef.current;
    const min=this.props.minHeight;
    if (textarea.scrollHeight>textarea.offsetHeight) {
      this.setState({
        value: textarea.value,
        height:textarea.scrollHeight>this.props.maxHeight?
        this.props.maxHeight:textarea.scrollHeight
      });
    } else {
      this.setState({
        value: textarea.value
      });
    }
    
  }

  componentDidMount = () => {
    if (this.state.criteria==='rows') {
      this.adjustRows();
    } else if (this.state.criteria==='height') {
      this.adjustHeight();
    }
    
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.value !== this.props.value) {
      this.setState({
        value: this.props.value
      });
    }
  };

  render() {
    const className =
      "pwnz-textarea " + "pwnz-textarea-" + (this.props.textAlign?this.props.textAlign:'left');

    const placeholder = this.props.placeholder || "Enter your text";

    const editable = this.props.editable || false;




    if (this.state.criteria==='height') {
      return (
        <div
          className={className}
          style={{
            height:this.state.height+'px'
          }}
        >
          {this.state.criteria==='height'? 
            <textarea
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
      );
    }
    return (
      <textarea
          rows={this.state.rows}
          value={this.state.value}
          placeholder={placeholder || "Enter your text"}
          onChange={this.adjustRows}
          readOnly={editable ? undefined : "readonly"}
          ref={this.textareaRef}
        /> 
    )
    
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