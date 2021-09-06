import { Component } from "react";
import { userCookie } from "../pwnzVariables";;

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error) {
    localStorage.removeItem(userCookie);
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className='error-page-container'>
          <div className='pwnz-errorMessage pwnz-p20'>
            <h1 className='pwnz-t-c pwnz-m0'>
              Something went wrong.
              <br />
              Try to reload the page.
            </h1>
          </div>
        </div>
      )
    }
    return this.props.children;
  }
}