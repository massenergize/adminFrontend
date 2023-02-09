import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

const styles = {
  root: {
    flexGrow: 1,
  },
};

class LinearBuffer extends React.Component {
  state = {
    completed: 0,
    buffer: 10,
  };

  timer = null;

  componentDidMount() {
    this.timer = setInterval(this.progress, 500);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  progress = () => {
    const { completed } = this.state;
    if (completed > 100) {
      this.setState({ completed: 0, buffer: 10 });
    } else {
      const diff = Math.random() * 10;
      const diff2 = Math.random() * 10;
      this.setState({
        completed: completed + diff,
        buffer: completed + diff + diff2,
      });
    }
  };

  render() {
    const { classes, message } = this.props;
    const { completed, buffer } = this.state;
    return (
      <div className={classes.root}>
        {message && <p>{message}</p>}
        {!message && (
          <div>
            <p>
              Hold tight, I am fetching data from the database. Almost done ...
              <span role="img" aria-label="smiley">
                😊
              </span>
            </p>
          </div>
        )}
        <LinearProgress
          variant="buffer"
          value={completed}
          valueBuffer={buffer}
        />
        <br />
        <LinearProgress
          color="secondary"
          variant="buffer"
          value={completed}
          valueBuffer={buffer}
        />
      </div>
    );
  }
}

LinearBuffer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LinearBuffer);
