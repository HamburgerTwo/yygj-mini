import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Input, Button } from '@tarojs/components'
import s from './index.module.scss';
import classnames from 'classnames';

import { User } from '../../types/user';
import { connect } from '@tarojs/redux'
import { saveUserInfoAction, bindingPhoneAction, findEmployeeByPhoneAction } from '../../actions/user';
import { loginByPhoneValidateCode, loginByPhonePwd, sendValidateCode } from '../../services/user';

type ComponentsStateProps = {
  
}

type ComponentsOwnProps = {
  onLogin: any
}


type ComponentsState = {
  isByCode: boolean,
  password: string,
  valicode: string,
  username: string,
  valiBtnTxt: string,
}

type ComponentsDispatchProps = {
  saveUserInfo: (userinfo: User) => void,
  bindingPhone: (phone: string) => Promise<any>,
  findEmployeeByPhone: (phone: string) => Promise<any>,
}

type IProps = ComponentsStateProps & ComponentsDispatchProps & ComponentsOwnProps


interface Index {
  props: IProps,
  isValiBtnEnabled: boolean,
  timeInterval: any
}

@connect(({  }) => ({
}), (dispatch) => ({
  saveUserInfo(user) {
    dispatch(saveUserInfoAction(user));
  },
  bindingPhone(phone) {
    return Promise.resolve().then(() => dispatch(bindingPhoneAction(phone)))
  },
  findEmployeeByPhone(phone) {
    return Promise.resolve().then(() => dispatch(findEmployeeByPhoneAction(phone)))
  }
}))


class Index extends Component<IProps, ComponentsState> {
  constructor(props) {
    super(props);
    this.state = {
      isByCode: true,
      password: '',
      valicode: '',
      username: '',
      valiBtnTxt: '发送验证码'
    }
    this.isValiBtnEnabled = true;
  }

  /**
 * 指定config的类型声明为: Taro.Config
 *
 * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
 * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
 * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
 */
  public onSwicthLoginMethod = () => {
    this.setState(({ isByCode }) => ({
      isByCode: !isByCode,
      password: '',
      valicode: '',
    }))
  }

  public onInput = (name: 'password' | 'valicode' | 'username', e) => {
    const stateObj = {
    }
    stateObj[name] = e.detail.value;
    this.setState(stateObj)
  }
  public onLogin = () => {
    const { isByCode, valicode, username, password } = this.state;
    const isLoginDisabled = !username || (isByCode && !valicode) || (!isByCode && !password);
    if(!isLoginDisabled) {
      const {
        bindingPhone,
      } = this.props;
      Promise.resolve()
        .then(() =>
          isByCode ? loginByPhoneValidateCode(username, valicode) : loginByPhonePwd(username, password))
        .then(() => (bindingPhone(username)
        )).then((res) => {
          Taro.setStorageSync('jwt', res.payload.authToken);
          this.props.saveUserInfo({
          })
          return this.props.findEmployeeByPhone(res.payload.mobilePhone)
        }
        ).then((res) => {
          this.props.onLogin(res.payload.isSign);
        }).catch((error) => {
          const { data = {} } = error;
          Taro.showToast({
            title: data.message || '出错了',
            icon: 'none'
          })
        })
    }
  }

  public onSendValiCode = () => {
    const { username } = this.state;

    if (!/^1\d{10}$/.test(username)) {
      Taro.showToast({
        title: '请输入正确的手机号码',
        icon: 'none'
      });
    } else {
      if (this.isValiBtnEnabled) {
        this.isValiBtnEnabled = false;

        sendValidateCode(username).then((res) => {
          let timeLeft = 60;
          this.timeInterval = setInterval(() => {

            if (timeLeft === 0) {
              this.setState({
                valiBtnTxt: `发送验证码`
              })
              this.isValiBtnEnabled = true;
              clearInterval(this.timeInterval);
            } else {
              this.setState({
                valiBtnTxt: `${timeLeft}秒后发送`
              })
              timeLeft = timeLeft - 1;
            }
          }, 1000)
        }).catch((error) => {
          const { data = {} } = error;
          Taro.showToast({
            title: data.message || '出错了',
            icon: 'none'
          });
          this.isValiBtnEnabled = true;
        })
      }
    }
  }
  render() {
    const { isByCode, valicode, username, password, valiBtnTxt } = this.state;
    const isLoginDisabled = !username || (isByCode && !valicode) || (!isByCode && !password);
    return (
      <View className={s.container}>
        <Input className={s.input} placeholder='请输入手机号码' type="number" maxLength={11} onInput={this.onInput.bind(this, 'username')} />
        {isByCode ? <View className={s.field}>
          <Input placeholder='请输入验证码' className={s.valiCode} onInput={this.onInput.bind(this, 'valicode')} /><Button onClick={this.onSendValiCode} className={s.valiBtn}>{valiBtnTxt}</Button>
        </View>
          : <Input className={s.input} onInput={this.onInput.bind(this, 'password')} placeholder='请输入密码' password={true} />}

        <View className={classnames(s.login, {
          [s.disabled]: isLoginDisabled
        })} onClick={this.onLogin}>登录</View>
        <View onClick={this.onSwicthLoginMethod} className={s.method
        }>{isByCode ? '密码登录' : '短信验证码登录'}</View>
      </View>
    )
  }
}

export default Index as ComponentClass<ComponentsOwnProps, ComponentsState>