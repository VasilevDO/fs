import React, { Component } from 'react';
import './PwnzReportForm.css';
import PwnzTextContainer from './PwnzTextContainer'

class PwnzReportForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reportTitle: this.props.reportTitle,
            minHeight: this.props.minHeight,
            maxHeight: this.props.maxHeight,
            alert: null
        }
    }

    handleReportTextChange = (val) => {
        this.setState({
            reportText: val
        })
    }

    handleSubmit = () => {
        if (!this.state.reportText) {
            this.setState({
                alert: {
                    text: 'Report ticket cannot be empty',
                    status: 'red'
                }
            })
            return;
        }
        this.props.onSubmit(this.state.reportText);
    }

    handleCancel = () => {
        this.props.onCancel();
    }

    render() {
        return (
            <div className='pwnz-reportForm'>
                {this.props.message ?
                    <>
                        <p className='pwnz-t-c pwnz-mt0 pwnz-mb10'>{this.props.message}</p>
                        <div className='pwnz-reportForm-buttons pwnz-f-c pwnz-mt10'>
                            <div className='pwnz-button pwnz-f-c' >
                                <div onClick={this.handleCancel}>Ok</div>
                            </div>
                        </div>
                    </>
                    :
                    <>
                        <p className='pwnz-t-c pwnz-mt0 pwnz-mb10'>{`Report post #${this.props.post.number} by ${this.props.post.createdBy}`}</p>
                        {this.state.alert ? <p className={'pwnz-t-c pwnz-mt0 pwnz-mb10' + (this.state.alert.status === 'red' ? ' pwnz-alert-red' : ' pwnz-alert-green')}>{this.state.alert.text}</p> : null}
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
                                <div onClick={this.handleSubmit}>Submit report</div>
                            </div>
                            <div className='pwnz-button pwnz-f-c' >
                                <div onClick={this.handleCancel}>Cancel</div>
                            </div>
                        </div>
                    </>}
            </div>
        )
    }
}

export default PwnzReportForm;