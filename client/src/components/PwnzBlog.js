import { Component } from "react";
import "./PwnzBlog.css";
import PwnzBlogPost from "./PwnzBlogPost";
import PwnzTextContainer from "./PwnzTextContainer";
import $ from 'jquery';

export default class PwnzBlog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loading: true
    };
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
      const response = await fetch('/api/blog/like', { method, body, headers })

      
    } catch (e) {
      console.log(e.message);
    }
  }

  handlePostLike = async (postId) => {
    try {
      const method = 'POST';
      const body = JSON.stringify({
        postId:postId
      });
      const headers = {
        'Content-Type': 'application/json',
        userId: this.props.user.userId,
        Authorization: `Bearer ${this.props.user.token}`
      }
      const { post } = await fetch('/api/blog/create', { method, body, headers })
        .then(data => data.json());
      if (!post) {
        return;//there is should be some error handler
      } else {
        this.setState({
          newPostText: '',
          newPostTitle: '',
          posts: this.state.posts.concat(post)
        })
        $('.pwnzBlog-newPostForm').hide(500);
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


  componentDidMount = async () => {
    const posts = await this.getPosts();
    if (posts) {
      this.setState({
        posts: posts,
        loading: false
      })
    }
  }

  render() {
    const posts = this.state.posts;
    console.log(this.props.user);
    const userRights = this.props.user.userRights;
    console.log(this.props.user);
    ;
    return (
      <div className="pwnzBlog">
        <div className="pwnzBlog-header">
          <h1>Blog user</h1>
        </div>
        <>
          <div className='pwnz-bwtm'>
            <div className='pwnz-bwtm-bd pwnz-f pwnzBlog-newPostFormHeader'>
              <div className='pwnz-f-grow1 pwnz-f-vc'><span>Have something new?</span></div>
              <div className='pwnz-f-shrink1'>
                <span className='pwnz-button pwnz-bwtm-b'>Write new post</span>
                <span style={{ display: 'none' }} className='pwnz-button pwnz-bwtm-b'>Hide form</span>
              </div>
            </div>
            <div className='pwnz-bwtm-c pwnzBlog-newPostForm' style={{ display: 'none' }}>
              <div className="pwnzBlog-newPostForm-title">
                <span>New post title</span>
                <PwnzTextContainer
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
                  minHeight={60}
                  maxHeight={400}
                  placeholder={'Whats new?'}
                  editable={true}
                  onChange={this.handleNewPostTextChange}
                />
              </div>
              <div className='pwnz-button pwnz-f-c' onClick={this.createPost}>
                <span>Submit new post</span>
              </div>
            </div>
          </div>
        </>
        <div className="pwnzBlog-container">
          {posts.map((post) => {
            console.log(posts);
            return <PwnzBlogPost
              post={post}
              editable={this.props.user.userRights.canModerateBlog || post.owner === this.props.user.userId}
              delete={this.deletePost}
              change={this.updatePost}
              onLike={this.handlePostLike}
            />;
          })}
        </div>
      </div>
    );
  }
}
