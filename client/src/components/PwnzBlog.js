import React, { Component } from "react";
import "./PwnzBlog.css";
import PwnzBlogPost from "./PwnzBlogPost";
import PwnzTextContainer from "./PwnzTextContainer";
import $ from 'jquery';
import { randomInt } from "./pwnz";
import PwnzReportForm from "./PwnzReportForm";

export default class PwnzBlog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      postsToShow: [],
      loading: true,
      sortBy: 'date',
      searchCriteria: {
        searchInNumber: true,
        searchInText: true,
        searchInTitle: true,
        searchInAuthor: true
      },
      reportPost: null
    };
  }

  componentDidMount = async () => {
    const posts = await this.getPosts();
    if (posts) {
      this.setState({
        posts: this.sortPosts(posts, this.state.sortBy),
        postsToShow: this.sortPosts(posts, this.state.sortBy),
        loading: false
      })
    }
  }

  handleNewPostTextChange = (newVal) => {
    this.setState({
      newPostText: newVal
    });
  };

  handleNewPostTitleChange = (newVal) => {
    this.setState({
      newPostTitle: newVal
    });
  };

  createPost = async () => {
    try {
      const method = 'POST';
      const body = JSON.stringify({
        text: this.state.newPostText,
        title: this.state.newPostTitle,
        createdBy: this.props.user.userName
      });
      const headers = {
        'Content-Type': 'application/json',
        userId: this.props.user.userId,
        Authorization: `Bearer ${this.props.user.token}`
      }
      const { post } = await fetch('/api/blog/create', { method, body, headers })
        .then(data => data.json());
      if (post) {
        $('.pwnzBlog-newPostForm').hide(500);
        $('.pwnzBlog-newPostForm').siblings('.pwnz-bwtm-bd').find('.pwnz-bwtm-b').toggle(1);
        this.setState({
          posts: this.state.posts.concat(post),
          postsToShow: this.state.postsToShow.concat(post),
          newPostText: '',
          newPostTitle: ''
        })
      }


    } catch (e) {
      console.log(e.message);
    }
  }

  handlePostLike = async (postId) => {
    try {
      const method = 'POST';
      const body = JSON.stringify({
        postId: postId
      });
      const headers = {
        'Content-Type': 'application/json',
        userId: this.props.user.userId,
        Authorization: `Bearer ${this.props.user.token}`
      }
      const { post } = await fetch('/api/blog/like', { method, body, headers })
        .then(data => data.json());
      if (post) {
        const newPosts = this.state.posts.map(item => {
          if (item._id === postId) return post;
          return item;
        })
        const newPostsToShow = this.state.postsToShow.map(item => {
          if (item._id === postId) return post;
          return item;
        })
        this.setState({
          posts: newPosts,
          postsToShow: newPostsToShow
        })

      } else {
        return;//there is should be some error handler
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  handlePostDislike = async (postId) => {
    try {
      const method = 'POST';
      const body = JSON.stringify({
        postId: postId
      });
      const headers = {
        'Content-Type': 'application/json',
        userId: this.props.user.userId,
        Authorization: `Bearer ${this.props.user.token}`
      }
      const { post } = await fetch('/api/blog/dislike', { method, body, headers })
        .then(data => data.json());
      if (post) {
        const newPosts = this.state.posts.map(item => {
          if (item._id === postId) return post;
          return item;
        })
        const newPostsToShow = this.state.postsToShow.map(item => {
          if (item._id === postId) return post;
          return item;
        })
        this.setState({
          posts: newPosts,
          postsToShow: newPostsToShow
        })
      } else {
        return;//there is should be some error handler
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  getPosts = async () => {
    try {
      const method = 'GET';
      const body = null;
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.props.user.token}`
      };
      const { posts } = await fetch('/api/blog', { method, body, headers })
        .then(data => data.json());
      return posts.map(post => {
        if (post.owner === this.props.user.userId) {
          post.canEdit = true;
        }
        return post;
      });
    } catch (e) {
      console.log(e.message);
    }
  }

  deletePost = async (postId) => {
    try {
      const method = 'POST';
      const body = JSON.stringify({
        id: postId
      });
      const headers = {
        'Content-Type': 'application/json',
        userId: this.props.user.userId,
        Authorization: `Bearer ${this.props.user.token}`
      };
      const response = await fetch('/api/blog/delete', { method, body, headers })
      if (response.status === 201) {
        const newPosts = this.state.posts.filter(post => post._id !== postId);
        this.setState({
          posts: newPosts
        })
      }
    } catch (e) {
      console.log(e.message);
    }
  }



  updatePost = async (updatedPost) => {
    try {
      const method = 'POST';
      const body = JSON.stringify({
        post: updatedPost
      });
      const headers = {
        'Content-Type': 'application/json',
        userId: this.props.user.userId,
        Authorization: `Bearer ${this.props.user.token}`
      }
      const post = await fetch('/api/blog/update', { method, body, headers })
        .then(data => data.json())
      console.log(post);
      const newPosts = this.state.posts.map((item) => {
        if (item._id !== post._id) return item;
        return post;
      });
      this.setState({
        posts: newPosts
      });
    } catch (e) {
      console.log(e.message);
    }
  }


  sortPosts = (posts, sortBy) => {
    const sortedPosts = posts.concat().sort((a, b) => {
      if (sortBy === 'date') {
        return b[sortBy] >= a[sortBy] ? 1 : -1;
      } else if (sortBy === 'random') {
        return randomInt(0, 1) ? 1 : -1;
      } else if (sortBy === 'likes') {
        return b.likedBy.length >= a.likedBy.length ? 1 : -1;
      } else if (sortBy === 'dislikes') {
        return b.dislikedBy.length >= a.dislikedBy.length ? 1 : -1;
      }
    });
    return sortedPosts;
  }

  handleSortChange = (e) => {
    this.setState({
      sortBy: e.target.value,
      posts: this.sortPosts(this.state.posts, e.target.value),
      postsToShow: this.sortPosts(this.state.postsToShow, e.target.value)
    })
  }

  handleSearchSettingsChange = (e) => {
    const target = $(e.target);
    const searchCriteria = this.state.searchCriteria;

    if (target.attr('for') === 'number') {
      searchCriteria.searchInNumber = !searchCriteria.searchInNumber
    } else if (target.attr('for') === 'text') {
      searchCriteria.searchInText = !searchCriteria.searchInText
    } else if (target.attr('for') === 'title') {
      searchCriteria.searchInTitle = !searchCriteria.searchInTitle
    } else if (target.attr('for') === 'author') {
      searchCriteria.searchInAuthor = !searchCriteria.searchInAuthor
    }
    this.setState({
      searchCriteria: searchCriteria,
      postsToShow: this.searchPosts(this.state.posts, this.state.searchInput, searchCriteria)
    })

  }

  searchPosts = (posts, value, criteria) => {
    if (!value) return posts;
    if (!Object.entries(criteria).filter(item => item[1] !== false).length) return posts;
    const filteredPosts = new Set();
    if (criteria.searchInNumber) {
      posts.forEach(post => {
        if (~('' + post.number).indexOf(value)) filteredPosts.add(post);
      })
    }
    if (criteria.searchInText) {
      posts.forEach(post => {
        if (~('' + post.text).indexOf(value)) filteredPosts.add(post);
      })
    }
    if (criteria.searchInTitle) {
      posts.forEach(post => {
        if (~('' + post.title).indexOf(value)) filteredPosts.add(post);
      })
    }
    if (criteria.searchInAuthor) {
      posts.forEach(post => {
        if (~('' + post.createdBy).indexOf(value)) filteredPosts.add(post);
      })
    }
    return Array.from(filteredPosts);
  }

  handleSearchInputChange = (e) => {
    this.setState({
      searchInput: e.target.value,
      postsToShow: this.searchPosts(this.state.posts, e.target.value, this.state.searchCriteria)
    })
  }

  handlePostReport = (post) => {
    this.setState({
      reportPost: post
    })
  }

  handleReportFormCancel = () => {
    this.setState({
      reportPost: null
    })
  }

  hideReportForm=(e)=>{
    const target=$(e.target);
    if (target.hasClass('pwnz-curtain')) {
      this.setState({
        reportPost: null
      })
    }
  }

  handleReportFormSubmit=(text)=>{
    
  }

  render() {
    const posts = this.state.postsToShow;
    const { searchInNumber, searchInTitle, searchInAuthor, searchInText } = this.state.searchCriteria;

    return (
      <div className="pwnzBlog" >
        <div className='pwnz-bwtm pwnz-mb10'>
          <div className='pwnz-bwtm-bd pwnz-f pwnzBlog-newPostFormHeader'>
            <div className='pwnz-f-grow1 pwnz-f-vc'><span>Have something new? Let us know!</span></div>
            <div className='pwnz-f-shrink1'>
              <span className='pwnz-button pwnz-bwtm-b'>Write new post</span>
              <span style={{ display: 'none' }} className='pwnz-button pwnz-bwtm-b'>Hide form</span>
            </div>
          </div>
          <div className='pwnz-bwtm-c pwnzBlog-newPostForm' style={{ display: 'none' }}>
            <div className="pwnzBlog-newPostForm-title">
              <span>New post title</span>
              <PwnzTextContainer
                value={this.state.newPostTitle}
                minHeight={20}
                maxHeight={100}
                placeholder={"Enter title"}
                editable={true}
                onChange={this.handleNewPostTitleChange}
              />
            </div>
            <div className="pwnzBlog-newPostForm-container">
              <span>New post content</span>
              <PwnzTextContainer
                value={this.state.newPostText}
                minHeight={60}
                maxHeight={400}
                placeholder={'Whats new?'}
                editable={true}
                onChange={this.handleNewPostTextChange}
              />
            </div>
            <div className='pwnz-button pwnz-f-c' >
              <span onClick={this.createPost}>Submit new post</span>
            </div>
          </div>
        </div>
        <div className='pwnzBlog-controls pwnz-f-c pwnz-mb10'>
          <div className='pwnz-select'>
            <span className='pwnz-nowrap'>Sorted by {this.state.sortBy}</span>
            <select className='pwnz-f-grow1' onChange={this.handleSortChange} value={!!this.state.sortBy} >
              <option value='' hidden>{this.state.sortBy[0].toUpperCase() + this.state.sortBy.slice(1)}</option>
              <option value="date" >Date</option>
              <option value="random">Random</option>
              <option value="likes">Likes</option>
              <option value="dislikes">Dislikes</option>
            </select>
          </div>

          <input
            placeholder='Search'
            value={this.state.searchInput}
            onChange={this.handleSearchInputChange}
            id='search'
            type='text'
            name='search'
            className='pwnz-m0'
          ></input>
          <div className='pwnz-bwdm'>
            <div className='pwnz-bwdm-bd'>
              <div className='pwnz-button pwnz-bwdm-b' >
                <span className='pwnz-nowrap'>Search options</span>
              </div>
            </div>
            <div className='pwnz-bwdm-c pwnz-bwdm-downLeft pwnz-p10' style={{ display: 'none' }}>
              <div className='pwnz-bwdm-c-inner'>
                <span className='pwnz-nowrap pwnz-m0'>Search in</span>
                <div className='pwnz-checkbox'>
                  <span>#</span>
                  <input for='number' type='checkbox' checked={searchInNumber} onChange={this.handleSearchSettingsChange} />
                </div>
                <div className='pwnz-checkbox'>
                  <span>Author</span>
                  <input for='author' type='checkbox' checked={searchInAuthor} onChange={this.handleSearchSettingsChange} />
                </div>
                <div className='pwnz-checkbox'>
                  <span>Title</span>
                  <input for='title' type='checkbox' checked={searchInTitle} onChange={this.handleSearchSettingsChange} />
                </div>
                <div className='pwnz-checkbox'>
                  <span>Text</span>
                  <input for='text' type='checkbox' checked={searchInText} onChange={this.handleSearchSettingsChange} />
                </div>

              </div>
            </div>
          </div>
        </div>
        <div className="pwnzBlog-container">
          {posts.length ? posts.map((post) => {
            return <PwnzBlogPost
              post={post}
              editable={this.props.user.userRights.canModerateBlog || post.owner === this.props.user.userId}
              delete={this.deletePost}
              change={this.updatePost}
              onLike={this.handlePostLike}
              onDislike={this.handlePostDislike}
              user={this.props.user}
              onReport={this.handlePostReport}
            />;
          }) :
            <p className='pwnz-t-c'>No posts found</p>}
        </div>
        {this.state.reportPost ?
          <div className='pwnz-curtain pwnz-f-c' onClick={this.hideReportForm}>
            <div className='pwnzBlog-reportForm'>
              <PwnzReportForm
                post={this.state.reportPost}
                onSubmit={this.handleReportFormSubmit}
                onCancel={this.handleReportFormCancel}
                minHeight={20}
                maxHeight={170}
              />
            </div>
          </div>
          : null}
      </div>
    );
  }
}
