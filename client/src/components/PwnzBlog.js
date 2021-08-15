import React, { Component } from "react";
import "./PwnzBlog.css";
import PwnzBlogPost from "./PwnzBlogPost";
import PwnzTextContainer from "./PwnzTextContainer";
import $ from 'jquery';
import { randomInt } from "./pwnz";

export default class PwnzBlog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loading: true,
      sort: 'date'
    };
  }

  componentDidMount = async () => {
    const posts = await this.getPosts();
    if (posts) {
      this.setState({
        posts: posts,
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
        this.setState({
          posts: newPosts
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
        this.setState({
          posts: newPosts
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
        this.setState({
          posts: this.state.posts.filter(post => post._id !== postId)
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
      const updatedPosts = this.state.posts.map((item) => {
        if (item._id !== post._id) return item;
        return post;
      });
      console.log(updatedPosts);
      this.setState({
        posts: updatedPosts
      });
    } catch (e) {
      console.log(e.message);
    }
  }

  handleSortChange = (e) => {
    const criteria = e.target.value;
    this.setState({
      sort: criteria,
      posts: this.state.posts.sort((a, b) => {

        if (criteria === 'date') {
          console.log(a[criteria] >= b[criteria])
          return b[criteria] >= a[criteria] ? 1 : -1;
        } else if (criteria === 'random') {
          return randomInt(0, 1) ? 1 : -1;
        } else if (criteria === 'likes') {
          return b.likedBy.length >= a.likedBy.length ? 1 : -1;
        } else if (criteria === 'dislikes') {
          return b.dislikedBy.length >= a.dislikedBy.length ? 1 : -1;
        }
      })
    })

  }



  render() {
    const posts = this.state.posts;
    const userRights = this.props.user.userRights;
    return (
      <div className="pwnzBlog">
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
        <div className='pwnzBlog-controls pwnz-f-c'>
          <div className='pwnz-select'>
            <span className='pwnz-nowrap'>Sort by</span>
            <select onChange={this.handleSortChange} value={this.state.sort}>
              <option value="date">Date</option>
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
          ></input>
          <div className='pwnz-bwdm'>
            <div className='pwnz-bwdm-bd'>
              <div className='pwnz-button pwnz-bwdm-b' >
                <span>Settings</span>
              </div>
            </div>
            <div className='pwnz-bwdm-c pwnz-dropmenu-down-left pwnz-p10' style={{ display: 'none' }}>
              <div className='pwnz-dropmenu-inner'>
                <p className='pwnz-nowrap'>Search in</p>
                <div className='pwnz-checkbox'>
                  <span>#</span>
                  <input for='case sensitivity' type='checkbox' checked={this.state.isSearchCaseSensitive} onChange={this.handleSearchSettingsChange} />
                </div>
                <div className='pwnz-checkbox'>
                  <span>Text</span>
                  <input for='case sensitivity' type='checkbox' checked={this.state.isSearchCaseSensitive} onChange={this.handleSearchSettingsChange} />
                </div>
                <div className='pwnz-checkbox'>
                  <span>Title</span>
                  <input for='case sensitivity' type='checkbox' checked={this.state.isSearchCaseSensitive} onChange={this.handleSearchSettingsChange} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pwnzBlog-container">
          {posts.map((post) => {
            console.log(posts);
            return <PwnzBlogPost
              post={post}
              editable={this.props.user.userRights.canModerateBlog || post.owner === this.props.user.userId}
              delete={this.deletePost}
              change={this.updatePost}
              onLike={this.handlePostLike}
              onDislike={this.handlePostDislike}
              user={this.props.user}
            />;
          })}
        </div>
      </div>
    );
  }
}
