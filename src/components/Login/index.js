import Redirect from 'umi/redirect';
import styles from './index.less';
import { connect } from 'dva';
import { Button, Form, Input } from 'antd';
import { PureComponent } from 'react';

@connect(({ login }) => ({
  loginRes: login.loginRes,
}))
class Login extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      eyeX: 0,
      eyeY: 0,
      username: '',
      password: '',
      loginRes: null
    };
    window.onmousemove = e => this.onMouseMove(e);
  }
  onMouseMove = e => {
    const dw = document.body.clientWidth / 15;
    const dh = document.body.clientHeight / 15;
    const x = e.pageX / dw;
    const y = e.pageY / dh;
    this.setState({
      eyeX: x,
      eyeY: y
    });
  }
  onLogin = () => {
    // router.push('/workbench/myProject');
    const { username, password } = this.state;
    if (!username || !password) return;
    const { dispatch } = this.props;
    dispatch({
      type: 'login/login',
      payload: {
        username,
        password
      }
    });
  }
  onCustomLogin = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/login',
      payload: {
        username: 'Zelda',
        password: '256000123'
      }
    });
  }
  handlePwChange = (e) => {
    this.setState({
      password: e.target.value
    });
  }
  handleUnChange = (e) => {
    this.setState({
      username: e.target.value
    });
  }

  render() {
    // console.log(this.state.loginRes);
    if (this.props.loginRes && this.props.loginRes.name) {
      window.sessionStorage['user'] = JSON.stringify(this.props.loginRes);
      return <Redirect to="/workbench/myProject" />;
    }
    return <div className={styles.bg}>
      <div className={styles.panda}>
        <div className={styles.ear}></div>
        <div className={styles.face}>
          <div className={styles.eyeShade}></div>
          <div className={styles.eyeWhite}>
            <div style={{ width: this.state.eyeX, height: this.state.eyeY }} className={styles.eyeBall}></div>
          </div>
          <div className={`${styles.eyeShade} ${styles.rgt}`}></div>
          <div className={`${styles.eyeWhite} ${styles.rgt}`}>
            <div style={{ width: this.state.eyeX, height: this.state.eyeY }} className={styles.eyeBall}></div>
          </div>
          <div className={styles.nose}></div>
        </div>
      </div>
      <Form className={styles.pandaForm}>
        <div className={styles.hand}></div>
        <div className={`${styles.hand} ${styles.rgt}`}></div>
        <h1>Login Penda</h1>
        <div className={styles.formGroup}>
          <Input
            id="username"
            className={styles.formControl}
            onChange={this.handleUnChange}
          />
          <label visible={this.state.unLabel} className={styles.formLabel}>Username</label>
        </div>
        <div className={styles.formGroup}>
          <Input
            id="password"
            type="password"
            className={styles.formControl}
            onChange={this.handlePwChange}
          />
          <label visible={this.state.pwLabel} className={styles.formLabel}>Password</label>
          <Button className={styles.btn} onClick={this.onLogin}>登录</Button>
          <Button className={styles.btn} onClick={this.onCustomLogin}>访客登录</Button>
        </div>
      </Form>
    </div>;
  }
}

export default Login;
