/* eslint-disable react/jsx-one-expression-per-line */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Field, reduxForm, } from 'redux-form';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import People from '@mui/icons-material/People';
import ArrowForward from '@mui/icons-material/ArrowForward';
import Paper from '@material-ui/core/Paper';
import Hidden from '@material-ui/core/Hidden';
import brand from 'dan-api/dummy/brand';
import logo from 'dan-images/logo.png';
import LinearProgress from '@material-ui/core/LinearProgress';
import { ContentDivider } from '../Divider';
import { IS_PROD, BUILD_VERSION, IS_CANARY } from '../../config/constants';
import { TextField } from '@mui/material';
import {withStyles} from "@mui/styles"
import styles from "./user-jss";
// validation functions
const required = value => (value == null ? 'Required' : undefined);
const email = value => (
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email'
    : undefined
);

class LoginForm extends React.Component {
  state = {
    showPassword: false
  }

  handleClickShowPassword = () => {
    const { showPassword } = this.state;
    this.setState({ showPassword: !showPassword });
  };

  handleMouseDownPassword = event => {
    event.preventDefault();
  };

  showProgressBar = () => {
    if (this.props.started) {
      return (
        <div>
          <p style={{ color: 'darkgray' }}>We are checking...</p>
          <LinearProgress />
        </div>
      );
    }
  }

  render() {
    const {
      classes,
      handleSubmit,
      pristine,
      submitting,
      deco,
      err,
      normalLoginFxn,
    } = this.props;
    const { showPassword } = this.state;

    return (
      <Fragment>
        <Hidden mdUp>
          <NavLink
            to="/"
            className={classNames(
              classes && classes.brand,
              classes && classes.outer
            )}
          >
            <img src={logo} alt={brand && brand.name} />
            {brand && brand.name}
          </NavLink>
        </Hidden>
        <Paper
          className={classNames(
            classes && classes.paperWrap,
            deco && classes && classes.petal
          )}
        >
          <Hidden smDown>
            <div className={classes && classes.topBar}>
              <NavLink to="/" className={classes && classes.brand}>
                <img src={logo} alt={brand && brand.name} />
                {brand && brand.name}
              </NavLink>
              {/* <Button size="small" className={classes.buttonLink} component={NavLink} to="/register">
                <Icon className={classes.icon}>arrow_forward</Icon>
                Create new account
              </Button> */}
            </div>
          </Hidden>
          {IS_PROD && (
            <Typography
              variant="h4"
              className={classes && classes.title}
              gutterBottom
            >
              Administrators - Sign In
            </Typography>
          )}
          {IS_CANARY && (
            <Typography
              variant="h4"
              className={classes && classes.title}
              gutterBottom
            >
              Canary: Administrators - Sign In
            </Typography>
          )}
          {!IS_PROD && !IS_CANARY && (
            <Typography
              variant="h4"
              className={classes &&  classes.title}
              gutterBottom
            >
              DEV: Administrators - Sign In
            </Typography>
          )}

          <Typography
            variant="caption"
            className={classes && classes.subtitle}
            gutterBottom
            align="center"
          >
            This site is meant to be exclusively used by Administrators
            only.
          </Typography>
          <section className={classes && classes.socmedLogin}>
            <div className={classes && classes.btnArea}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => this.props.loginWithGoogleFxn()}
                className={classes && classes.redBtn}
                type="button"
              >
                <People
                  className={classNames(
                    classes && classes.leftIcon,
                    classes && classes.iconSmall
                  )}
                />
                Google
              </Button>
              {/* <Button variant="outlined" onClick={() => this.props.loginWithFacebookFxn()}size="small" className={classes.blueBtn} type="button">
                <People className={classNames(classes.leftIcon, classes.iconSmall)} />
                Facebook
              </Button> */}
              {/* <Button variant="outlined" size="small" className={classes.cyanBtn} type="button">
                <People className={classNames(classes.leftIcon, classes.iconSmall)} />
                Twitter
              </Button> */}
            </div>
            <ContentDivider content="Or sign in with email" />
          </section>
          <section className={classes && classes.formWrap}>
            <form onSubmit={(e) => e.preventDefault()}>
              <div>
                <FormControl className={classes && classes.formControl}>
                  {err && (
                    <Typography
                      style={{ color: "red" }}
                      variant="caption"
                      className={classes && classes.subtitle}
                      gutterBottom
                      align="center"
                    >
                      {err}
                    </Typography>
                  )}
                  <Field
                    ref="email"
                    name="email"
                    component={TextField}
                    placeholder="Your Email"
                    label="Your Email"
                    required
                    validate={[required, email]}
                    className={classes && classes.field}
                  />
                </FormControl>
              </div>
              <div>
                <FormControl className={classes && classes.formControl}>
                  <Field
                    ref="pass"
                    name="password"
                    component={TextField}
                    type={showPassword ? "text" : "password"}
                    label="Your Password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="Toggle password visibility"
                            onClick={this.handleClickShowPassword}
                            onMouseDown={this.handleMouseDownPassword}
                          >
                            {showPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    required
                    validate={required}
                    className={classes && classes.field}
                  />
                </FormControl>
              </div>
              <div className={classes && classes.optArea}>
                {/* <FormControlLabel className={classes && classes.label} control={<Field name="checkbox" component={Checkbox} />} label="Remember" /> */}
                {/* <Button size="small" component={NavLink} to="/reset-password" className={classes && classes.buttonLink}>Forgot Password</Button> */}
              </div>
              {this.showProgressBar()}
              <div className={classes && classes.btnArea}>
                <Button
                  variant="contained"
                  onClick={() =>
                    normalLoginFxn(
                      this.refs.email.value,
                      this.refs.pass.value
                    )
                  }
                  color="primary"
                  size="large"
                  type="submit"
                >
                  Sign in
                  <ArrowForward
                    className={classNames(
                      classes && classes.rightIcon,
                      classes && classes.iconSmall
                    )}
                    disabled={submitting || pristine}
                  />
                </Button>
                {/* <button onClick = {(e)=>{e.preventDefault();this.props.signOutFxn()}}>signout</button> */}
              </div>
            </form>
            {IS_PROD && (
              <Typography
                variant="body1"
                className={classes && classes.title}
                gutterBottom
              >
                Production Build {BUILD_VERSION}
              </Typography>
            )}
            {!IS_PROD && (
              <Typography
                variant="body1"
                className={classes && classes.title}
                gutterBottom
              >
                Development Build {BUILD_VERSION}
              </Typography>
            )}
          </section>
        </Paper>
      </Fragment>
    );
  }
}

LoginForm.propTypes = {
  // classes: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  deco: PropTypes.bool.isRequired,
};

const LoginFormReduxed = reduxForm({
  form: 'immutableExample',
  enableReinitialize: true,
})(LoginForm);

const reducerLogin = 'login';
const reducerUi = 'ui';
const FormInit = connect(
  state => ({
    force: state,
    initialValues: state.getIn([reducerLogin, 'usersLogin']),
    deco: state.getIn([reducerUi, 'decoration'])
  }),
)(LoginFormReduxed);

export default withStyles(styles)(FormInit);
