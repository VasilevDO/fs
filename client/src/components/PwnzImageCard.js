import React, { Component } from 'react';
import './PwnzImageCard.css';
import cancelPNG from '../assets/buttons/pwnzCancel.png';
import gearPNG from '../assets/buttons/gear.png';
import $ from 'jquery';

class PwnzImageCard extends Component {
    constructor (props) {
        super(props);
        this.state={
            deleteImage:false,
        }
    }
    handleImageClick=()=>{
        if (this.props.format==='mini') {
           this.props.onImageClick(this.props.image);
        }
    }

    closeImage=()=>{
        this.props.closeImage();
    }

    handleNewDescriptionInput=(e)=> {
        this.setState({
            newDescription:e.target.value
        })
    }
    handleNewTagsInput=(e)=> {
        this.setState({
            newTags:e.target.value
        })
    }

    handleDeleteImageCheckbox=()=>{
        this.setState({
            deleteImage:!this.state.deleteImage
        })
    }

    deleteImage=()=> {
        this.props.deleteImage();
    }

    handleImageChangesSubmit=()=>{
        this.props.imageEdit({
            description:this.state.newDescription,
            tags:this.state.newTags
        })
    }

    render() {
        const format=this.props.format||'basic';
        const isControls=this.props.controlsEnabled;
        const src=this.props.image.url;
        const description=this.props.isDescriptionVisible?this.props.image.description:null;
        const tags=this.props.isTagsVisible?this.props.image.tags?this.props.image.tags.split(' ').map(tag=>'#'+tag):null:null;
        const imgHeight=format==='mini'?this.props.height:700;
        const imgWidth=format==='mini'?this.props.width:1200;
        return (
            <div className='pwnzImageCard'>
                <div className='pwnzImageCard-imageDiv'>
                    <img 
                    src={src} 
                    style={{maxHeight:imgHeight+'px', maxWidth:imgWidth+'px'}} 
                    onClick={this.handleImageClick}
                    />
                    {isControls?<div className='pwnzImageCard-controls'>
                        <div className='pwnzImageCard-controls-close'>
                            <img src={cancelPNG} className='pwnz-button-40x40' onClick={this.closeImage}/>
                        </div>
                        <div className='pwnzImageCard-controls-menu'>
                            <div className='pwnz-buttonWdropmenu'>
                                <img className='pwnz-button-40x40 pwnz-dropmenu-button pwnz-animated' alt='menu' rotate='360' src={gearPNG}/>
                                <div className='pwnz-dropmenu pwnz-dropmenu-up-left pwnz-p10' style={{display:'none'}}>
                                    <div className='pwnz-dropmenu-inner'>
                                        <span>Edit description</span>
                                        <input 
                                            placeholder='Enter new description' 
                                            value={this.state.newDescription||description} 
                                            onChange={this.handleNewDescriptionInput} 
                                            type='text'
                                        ></input>
                                        <span>Edit tags</span>
                                        <input 
                                            placeholder='Enter new tags' 
                                            value={this.state.newTags||this.props.image.tags} 
                                            onChange={this.handleNewTagsInput} 
                                            type='text'
                                        ></input>
                                        <button className='pwnz-submitButton pwnz-m5' onClick={this.handleImageChangesSubmit}>Submit changes</button>
                                        <div className='pwnz-buttonWithToggleMenu'>
                                            <button className='pwnz-buttonWithToggleMenu-button pwnz-m5'>Delete image</button>
                                            <div className='pwnz-toggleMenu pwnz-f-c' style={{display:'none'}}>
                                                <span>Are you sure?</span>
                                                <button onClick={this.deleteImage} className='pwnz-m5'>Yes</button>
                                                <button className='pwnz-buttonWithToggledDiv-closeButton pwnz-m5'>No</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>   
                            </div>  
                        </div>
                    </div>:null}
                </div>
                {description?<p>{description}</p>:null}
                {tags?<p>{tags}</p>:null}
            </div>
        );
    }
}

export default PwnzImageCard;