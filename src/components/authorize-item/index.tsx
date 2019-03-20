import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Button, Block } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { GETUSERINFO, GETPHONENUMBER, LOGINMETHOD } from '../../constants/user';
import { goToAction } from '../../actions/activity'
import { decodeData } from '../../services/index';
import s from './index.module.scss'
import { User } from '../../types/user';
import LoginModule from '../../components/login-module/index'
import WechatLoginModule from '../../components/wechat-login-module/index'
import { saveUserInfoAction, bindingPhoneAction, findEmployeeByPhoneAction, saveTemporaryUserInfoAction } from '../../actions/user';


// #region 书写注意
// 
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion

type ComponentsStateProps = {
  activity: {
    current: string,
    config: any
  }
  user: {
    identity: string,
    userinfo: User,
    authToken: string,
    isSign: boolean,
  },


}

type ComponentsDispatchProps = {
  goTo: () => Promise<any>,
  saveUserInfo: (userinfo: User) => void,
  bindingPhone: (phone: string) => Promise<any>,
  findEmployeeByPhone: (phone: string) => Promise<any>,
  saveTemporaryUserInfo: (userinfo: User) => Promise<any>,
}

type ComponentsOwnProps = {
  onCallBack?: any,
  page: string
}

type ComponentsState = {
  method: string,
  dialogVisable: boolean,
}

type IProps = ComponentsStateProps & ComponentsDispatchProps & ComponentsOwnProps

interface Index {
  props: IProps;
  userinfo: any,
}

@connect(({ activity, user }) => ({
  activity,
  user,
}), (dispatch) => ({
  goTo: () => {
    return Promise.resolve().then(() =>
      dispatch(goToAction(true))
    )
  },
  saveUserInfo(user) {
    dispatch(saveUserInfoAction(user));
  },
  bindingPhone(phone) {
    return Promise.resolve().then(() => dispatch(bindingPhoneAction(phone)))
  },
  findEmployeeByPhone(phone) {
    return Promise.resolve().then(() => dispatch(findEmployeeByPhoneAction(phone)))
  },
  saveTemporaryUserInfo(user) {
    return Promise.resolve().then(() => dispatch(saveTemporaryUserInfoAction(user)))
  }
}))
class Index extends Component<IProps, ComponentsState> {

  constructor(props) {
    super(props);
    this.state = {
      method: '',
      dialogVisable: false,
    }
  }
  componentWillMount() {
  }
  componentWillReceiveProps(nextProps) {

  }
  public onGetPhoneNumber = (e) => {
    const {
      errMsg,
      encryptedData,
      iv
    } = e.detail;
    const { user,
      bindingPhone,
    } = this.props;
    if (errMsg === GETPHONENUMBER) {
      decodeData(user.identity, encryptedData, iv).then((res) => (
        bindingPhone(res.purePhoneNumber))
      ).then((res) => {
        Taro.setStorageSync('jwt', res.payload.authToken);

        this.props.saveUserInfo({
        })
        return this.props.findEmployeeByPhone(res.payload.mobilePhone);
      }
      ).then((res) => {
        this.redirectToPage(res.payload.isSign);
      }).catch((error) => {
        const { data = {} } = error;
        Taro.showToast({
          title: data.message || '出错了',
          icon: 'none'
        })
      })
    }
  }

  public redirectToPage = (isSign) => {
    if (this.props.onCallBack) {
      this.props.onCallBack(isSign);
    }
  }
  public onGetUserInfo = (method, e) => {
    if (e.detail.errMsg === GETUSERINFO) {
      const { nickName, avatarUrl, gender } = e.detail.userInfo;
      this.props.saveTemporaryUserInfo({
        nickName,
        headimg: avatarUrl,
        gender
      })
      this.setState({
        method,
        dialogVisable: true,
      })
      if (method === LOGINMETHOD.PHONE) {
        if (this.props.page === 'study') {
          Taro.navigateTo({
            url: `/pages/loginByPhone/index`
          });
        }
      }
    }
  }
  public onClose = () => {
    this.setState({
      dialogVisable: false,
    })
  }
  public onLogin = (isSign) => {
      this.redirectToPage(isSign);
  }
  componentDidMount() {
  }
  componentWillUnmount() {

  }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { page } = this.props;
    const { method, dialogVisable } = this.state;
    return (
      <View>
        <Block>
          {method !== LOGINMETHOD.PHONE || page === 'study' ? <Button className={s.login} open-type="getUserInfo" onGetUserInfo={this.onGetUserInfo.bind(this, LOGINMETHOD.WECHAT)} type="primary">微信登录</Button> : null}
          {method !== LOGINMETHOD.PHONE || page === 'study'? <Button className={s.phonelogin} open-type="getUserInfo" onGetUserInfo={this.onGetUserInfo.bind(this, LOGINMETHOD.PHONE)} type="default">手机登录</Button> : null}
          {method === LOGINMETHOD.PHONE && page !== 'study'? <LoginModule onLogin={this.onLogin} /> : null}
          {method === LOGINMETHOD.WECHAT && dialogVisable ? <WechatLoginModule onGetPhoneNumber={this.onGetPhoneNumber} onClose={this.onClose} /> : null}
        </Block>
      </View>
    )
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Index as ComponentClass<ComponentsOwnProps, ComponentsState>
