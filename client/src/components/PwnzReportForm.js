import React, { Component } from 'react';
import './PwnzReportForm.css';
import $ from 'jquery';
import PwnzTextContainer from './PwnzTextContainer'


class PwnzReportForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reportTitle: this.props.reportTitle,
            minHeight:this.props.minHeight,
            maxHeight:this.props.maxHeight
        }
    }

    handleReportTextChange = (val) => {
        this.setState({
            reportText: val
        })
    }

    handleSubmit = () => {
        this.props.onSubmit(this.state.reportText);
    }

    handleCancel = () => {
        this.props.onCancel();
    }

    render() {
        console.log(this.props.post);
        return (
            <div className='pwnz-reportForm'>
                <p className='pwnz-t-c pwnz-mt0 pwnz-mb10'>{`Report post #${this.props.post.number} by ${this.props.post.createdBy}`}</p>
                <PwnzTextContainer
                    value={this.state.reportText}
                    minHeight={this.state.minHeight}
                    maxHeight={this.state.maxHeight}
                    placeholder={"Whats wrong?"}
                    editable={true}
                    textAlign={"left"}
                    onChange={this.handleReportTextChange}
                />
                <div className='pwnz-reportForm-buttons pwnz-f-c pwnz-mt10'>
                    <div className='pwnz-button pwnz-f-c' >
                        <span onClick={this.handleSubmit}>Submit report</span>
                    </div>
                    <div className='pwnz-button pwnz-f-c' >
                        <span onClick={this.handleCancel}>Cancel</span>
                    </div>
                </div>
            </div>
        )
    }
}


export default PwnzReportForm;