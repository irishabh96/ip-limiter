import React, { Component } from "react";

class Alert extends Component {
  render() {
    return (
      <div className="m-2 alert alert-warning alert-dismissible fade show" role="alert">
        {this.props.message}
        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">×</span>
        </button>
      </div>
    );
  }
}

export default Alert;
