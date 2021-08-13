import { Component } from "react";

export class ErrorBoundary extends Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    componentDidCatch(error) {
      localStorage.removeItem('userData');
      this.setState({ hasError: true });
    }
    
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return <h1>Something went wrong. Try to reload page</h1>;
      }
      return this.props.children;
    }
  }