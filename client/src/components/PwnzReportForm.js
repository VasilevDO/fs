import React, { Component } from 'react';
import './PwnzReportForm.css';
import $ from 'jquery';
import PwnzTextContainer from './PwnzTextContainer'


class PwnzReportForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reportTitle: this.props.reportTitle
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
        return (
            <div className='pwnz-reportForm'>
                <p className='pwnz-t-c pwnz-m0'>this.props.reportTitle</p>
                <PwnzTextContainer
                    value={this.state.reportText}
                    minHeight={20}
                    maxHeight={170}
                    placeholder={"Whats wrong?"}
                    editable={true}
                    textAlign={"left"}
                    onChange={this.handleReportTextChange}
                />
                <div className='pwnz-reportForm-buttons pwnz-f-c'>
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