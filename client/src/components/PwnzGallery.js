import React, { Component } from 'react';
import './PwnzGallery.css';
import gearPNG from '../assets/buttons/gear.png';
import plusPNG from '../assets/buttons/pwnzPlus.png';
import searchPNG from '../assets/buttons/pwnzSearch.png';
import arrowLeftPNG from '../assets/buttons/pwnzArrowLeft.png';
import arrowRightPNG from '../assets/buttons/pwnzArrowRight.png';
import $ from 'jquery';
import PwnzImageCard from './PwnzImageCard';
import { Loader } from './Loader';
import { randomInt } from './pwnz';

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

class PwnzGallery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            format: this.props.format || 'basic',
            imagesMaxHeight: this.props.imagesMaxHeight || 400,
            isDescriptionVisible: true,
            isSearchByDescription: true,
            isSearchCaseSensitive: true,
            isTagsVisible: true,
            isSearchByTags: true,
            focusedImage: false
        }
    }

    timing = 500;

    baseImages = this.props.images;

    handleNewImageUrlInputChange = (e) => {
        this.setState({
            newImageUrlInput: e.target.value
        })
    }
    handleNewImageDescriptionInputChange = (e) => {
        this.setState({
            newImageDescriptionInput: e.target.value
        })
    }

    handleSearchInputChange = (e) => {
        this.setState({
            searchInput: e.target.value
        })
    }

    handleNewImageTagsInputChange = (e) => {
        this.setState({
            newImageTagsInput: e.target.value
        })
    }

    handleImageWidthChange = (e) => {
        let target = $(e.target);
        this.setState({
            imagesMaxHeight: target.val()
        })
    }

    handleDesciptionVisibilityChange = () => {
        this.setState({
            isDescriptionVisible: !this.state.isDescriptionVisible
        })
    }

    handleTagsVisibilityChange = () => {
        this.setState({
            isTagsVisible: !this.state.isTagsVisible
        })
    }

    handleSearchSettingsChange = (e) => {
        const target = $(e.target);
        if (target.attr('for') === 'tags') {
            if (this.state.isSearchByTags && !this.state.isSearchByDescription) return;
            this.setState({
                isSearchByTags: !this.state.isSearchByTags
            })
        } else if (target.attr('for') === 'description') {
            if (!this.state.isSearchByTags && this.state.isSearchByDescription) return;
            this.setState({
                isSearchByDescription: !this.state.isSearchByDescription
            })
        } else if (target.attr('for') === 'case sensitivity') {
            this.setState({
                isSearchCaseSensitive: !this.state.isSearchCaseSensitive
            })
        }
    }

    handleSortChange = (e) => {
        let sorted;
        if (e.target.value === 'date') {
            sorted = this.state.images.sort((image1, image2) => {
                return image1.date > image2.date ? 1 : -1;
            })
        } else if (e.target.value === 'random') {
            sorted = shuffleArray(this.state.images.concat());
        }
        this.setState({
            images: sorted || this.state.images
        })
    }

    handleSearchSubmit = () => {
        const description = this.state.isSearchByDescription;
        const tags = this.state.isSearchByTags;
        const isCaseSensitive = this.state.isSearchCaseSensitive;

        const search = isCaseSensitive ? (this.state.searchInput || '') : (this.state.searchInput || '').toLowerCase();
        const filtered = this.baseImages.concat().filter(image => {
            if (tags) {
                const imageTags = isCaseSensitive ? (image.tags || '') : (image.tags || '').toLowerCase();
                if (imageTags.includes(search)) return true;
            }
            if (description) {
                const imageDescription = isCaseSensitive ? (image.description || '') : (image.description || '').toLowerCase();
                if (imageDescription.includes(search)) return true;
            }
            return false;
        })
        this.setState({
            images: filtered
        })
    }

    handleImageFocus = (image) => {
        this.setState({
            focusedImage: image
        })
    }

    cancelFocusedImage = (e) => {
        const target = $(e.target);
        if (target.hasClass('pwnzGallery-focusedImage-container')) {
            this.setState({
                focusedImage: null
            })
            return;
        }
    }

    cancelFocusedImage = (e) => {//to close focused image by clicking out of the image and image controls
        const target = $(e.target);
        if (target.hasClass('pwnzGallery-focusedImage-container')) {
            this.setState({
                focusedImage: null
            })
            return;
        }
    }

    closeFocusedImage = () => {
        this.setState({
            focusedImage: null
        })
    }

    focusNextImage = () => {
        const images = this.state.images;
        const image = this.state.focusedImage;
        const index = images.indexOf(image);
        const newIndex = index === images.length - 1 ? 0 : index + 1;
        this.setState({
            focusedImage: images[newIndex]
        })
    }

    focusPreviousImage = () => {
        const images = this.state.images;
        const image = this.state.focusedImage;
        const index = images.indexOf(image);
        const newIndex = index === 0 ? images.length - 1 : index - 1;
        this.setState({
            focusedImage: images[newIndex]
        })
    }

    editImage = async (changesObj) => {
        const method = 'POST';
        const body = JSON.stringify({
            id: this.state.focusedImage._id,
            description: changesObj.description,
            tags: changesObj.tags
        });
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.props.user.token}`
        };
        const { image } = await fetch('/api/image/edit', { method, body, headers })
            .then(data => data.json());
        const images = this.state.images.map(item => {
            return item._id === image._id ? image : item;
        })
        this.setState({
            focusedImage: image,
            images: images
        })
    }

    deleteFocusedImage = async () => {
        try {
            const id = this.state.focusedImage._id;
            const method = 'POST';
            const body = JSON.stringify({
                id: id
            });
            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.props.user.token}`
            };
            const response = await fetch('/api/image/delete', { method, body, headers })
            if (response.status === 201) {
                const newIndex = this.state.images.findIndex(item => item._id === id);
                const images = this.state.images.filter(item => item._id !== id);

                this.setState({
                    focusedImage: newIndex < images.length ? images[newIndex] : images[0],
                    images: images
                })
            }
        } catch (e) {
        }
    }

    getImages = async () => {
        const method = 'GET';
        const body = null;
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.props.user.token}`
        };
        const {images} = await fetch('/api/image', { method, body, headers })
            .then(data => data.json());
        return images;
    }

    handleNewImageSubmit = async () => {
        const method = 'POST';
        const body = JSON.stringify({
            url: this.state.newImageUrlInput,
            description: this.state.newImageDescriptionInput,
            tags: this.state.newImageTagsInput
        });
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.props.user.token}`
        };
        const { image } = await fetch('/api/image/save', { method, body, headers })
            .then(data => data.json());
        this.setState({
            newImageUrlInput: '',
            newImageTagsInput: '',
            newImageDescriptionInput: '',
            images: this.state.images.concat(image)
        })

    }


    componentDidMount = async () => {
        try {
            if (!this.state.images) {
                const images = await this.getImages();
                this.setState({
                    images: images
                })
            }
        } catch (e) {
        }
    }

    render() {
        const images = this.state.images || this.baseImages;
        if (!images) {
            return (
                <Loader />
            )
        }
        const format = this.state.format;
        const focusedImage = this.state.focusedImage;
        const imagesMaxHeight = this.state.imagesMaxHeight;

        if (!focusedImage && format === 'mini') {
            return (
                <>
                    <PwnzImageCard
                        image={images[randomInt(0, images.length - 1)]}
                        format='mini'
                        width='300'
                        isDescriptionVisible={this.state.isDescriptionVisible}
                        isTagsVisible={this.state.isTagsVisible}
                        onImageClick={this.handleImageFocus}
                    />
                </>
            )
        } else if (focusedImage || format === 'basic') {
            return (
                <div className='pwnzGallery'>
                    <div className='pwnzGallery-header'>
                        <p className='pwnzGallery-header-title'>Gallery</p>
                        <div className='pwnzGallery-img-button-container'>
                            <div className='pwnz-select'>
                                <span className='pwnz-nowrap'>Sort by</span>
                                <select onChange={this.handleSortChange}>
                                    <option value="date">Date</option>
                                    <option value="random">Random</option>
                                </select>
                            </div>
                            <div className='pwnz-buttonWdropmenu pwnz-m5'>
                                <img className='pwnz-button-40x40 pwnz-dropmenu-button pwnz-animated' alt='search' rotate='180' src={searchPNG} />
                                <div className='pwnz-dropmenu pwnz-dropmenu-down-left pwnz-p10 pwnz-w400' style={{ display: 'none' }}>
                                    <div className='pwnz-dropmenu-inner'>
                                        <div className='pwnz-dropmenu-checkbox'>
                                            <span>Search in tags</span>
                                            <input for='tags' type='checkbox' checked={this.state.isSearchByTags} onChange={this.handleSearchSettingsChange} />
                                        </div>
                                        <div className='pwnz-dropmenu-checkbox'>
                                            <span>Search in description</span>
                                            <input for='description' type='checkbox' checked={this.state.isSearchByDescription} onChange={this.handleSearchSettingsChange} />
                                        </div>
                                        <div className='pwnz-dropmenu-checkbox'>
                                            <span>Case sensitivity</span>
                                            <input for='case sensitivity' type='checkbox' checked={this.state.isSearchCaseSensitive} onChange={this.handleSearchSettingsChange} />
                                        </div>
                                        <input
                                            placeholder='Search'
                                            value={this.state.searchInput}
                                            onChange={this.handleSearchInputChange}
                                            id='search'
                                            type='text'
                                            name='search'
                                        ></input>
                                        <button className='pwnzGallery-header-button' onClick={this.handleSearchSubmit}>Search</button>
                                    </div>
                                </div>
                            </div>
                            <div className='pwnz-buttonWdropmenu pwnz-m5'>
                                <img className='pwnz-button-40x40 pwnz-dropmenu-button pwnz-animated' alt='add' rotate='405' src={plusPNG} />
                                <div className='pwnz-dropmenu pwnz-dropmenu-down-left pwnz-p10 pwnz-w400' style={{ display: 'none' }}>
                                    <div className='pwnz-dropmenu-inner'>
                                        <input
                                            placeholder='Enter url'
                                            value={this.state.newImageUrlInput}
                                            onChange={this.handleNewImageUrlInputChange}
                                            id='url'
                                            type='text'
                                            name='url'
                                        ></input>
                                        <input
                                            placeholder='Add short description'
                                            value={this.state.newImageDescriptionInput}
                                            onChange={this.handleNewImageDescriptionInputChange}
                                            id='description'
                                            type='text'
                                            name='description'
                                        ></input>
                                        <input
                                            placeholder='Add some tags'
                                            value={this.state.newImageTagsInput}
                                            onChange={this.handleNewImageTagsInputChange}
                                            id='tags'
                                            type='text'
                                            name='tags'
                                        ></input>
                                        <button className='pwnzGallery-header-button' onClick={this.handleNewImageSubmit}>Add image</button>
                                    </div>
                                </div>
                            </div>
                            <div className='pwnz-buttonWdropmenu pwnz-m5'>
                                <img className='pwnz-button-40x40 pwnz-dropmenu-button pwnz-animated' alt='settings' rotate='360' src={gearPNG} />
                                <div className='pwnz-dropmenu pwnz-dropmenu-down-left pwnz-p10 pwnz-w400' style={{ display: 'none' }}>
                                    <div className='pwnz-dropmenu-inner'>
                                        <div className="pwnzGallery-rangeSliderDiv">
                                            <span className='pwnz-mr10'>Images height:</span>
                                            <input type="range" min="100" max="1000" onChange={this.handleImageWidthChange} value={imagesMaxHeight} />
                                        </div>
                                        <div className='pwnz-dropmenu-checkbox'>
                                            <span>Show description</span>
                                            <input type='checkbox' checked={this.state.isDescriptionVisible} onChange={this.handleDesciptionVisibilityChange} />
                                        </div>
                                        <div className='pwnz-dropmenu-checkbox'>
                                            <span>Show tags</span>
                                            <input type='checkbox' checked={this.state.isTagsVisible} onChange={this.handleTagsVisibilityChange} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                    <div className='pwnzGallery-container'>
                        {images.map((image, index) => {
                            return (<PwnzImageCard
                                image={image}
                                onImageClick={this.handleImageFocus}
                                format='mini'
                                height={imagesMaxHeight}
                                isDescriptionVisible={this.state.isDescriptionVisible}
                                isTagsVisible={this.state.isTagsVisible}
                                key={image._id}
                            ></PwnzImageCard>)
                        })}
                    </div>
                    {focusedImage ?
                        <div className='pwnz-curtain'>
                            <div className='pwnzGallery-focusedImage-container' onClick={this.cancelFocusedImage}>
                                <div className='pwnzGallery-focusedImage'>
                                    <div className='pwnzGallery-focusedImage-arrowLeft' onClick={this.focusPreviousImage}>
                                        <img alt='' src={arrowLeftPNG} ></img>
                                    </div>
                                    <PwnzImageCard
                                        image={focusedImage}
                                        format='large'
                                        isDescriptionVisible={true}
                                        isTagsVisible={true}
                                        controlsEnabled={true}
                                        closeImage={this.closeFocusedImage}
                                        key={'focusedImage' + images.indexOf(focusedImage)}
                                        deleteImage={this.deleteFocusedImage}
                                        imageEdit={this.editImage}
                                    />
                                    <div className='pwnzGallery-focusedImage-arrowRight' onClick={this.focusNextImage}>
                                        <img alt='' src={arrowRightPNG} ></img>
                                    </div>
                                </div>
                            </div>
                        </div> : null}

                </div>
            );
        }
    }
}

export default PwnzGallery;