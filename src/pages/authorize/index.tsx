import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Block } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { GETUSERINFO, GETPHONENUMBER, LOGINMETHOD } from '../../constants/user';
import { goToAction } from '../../actions/activity'
import { decodeData } from '../../services/index';
import s from './index.module.scss'
import { User } from '../../types/user';
import classnames from 'classnames';
import LoginModule from '../../components/login-module/index'
import WechatLoginModule from '../../components/wechat-login-module/index'
import { saveUserInfoAction, bindingPhoneAction, findEmployeeByPhoneAction } from '../../actions/user';
import { loginByPhoneValidateCode, loginByPhonePwd } from '../../services/user';

// #region 书写注意
// 
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion

type PageStateProps = {
  activity: {
    current: string,
    config: any
  }
  user: {
    identity: string,
    userinfo: User,
    authToken: string,
    isSign: boolean,
  }
}

type PageDispatchProps = {
  goTo: () => Promise<any>,
  saveUserInfo: (userinfo: User) => void,
  bindingPhone: (phone: string) => Promise<any>,
  findEmployeeByPhone: (phone: string) => Promise<any>,
}

type PageOwnProps = {
}

type PageState = {
  nickName: string,
  method: string,
  show: boolean,
  dialogVisable: boolean,
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

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
  }
}))
class Index extends Component<PageOwnProps, PageState> {
  /**
 * 指定config的类型声明为: Taro.Config
 *
 * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
 * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
 * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
 */
  config: Config = {
    navigationBarTitleText: '授权页',
    navigationStyle: 'default',
  }

  constructor(props) {
    super(props);
    this.state = {
      nickName: '',
      method: '',
      show: false,
      dialogVisable: false,
    }
  }
  componentWillMount() {

    const { changeuser } = this.$router.params;
    if (!changeuser) {
      const { user } = this.props;
      const { userinfo = {
        nickName: '',
        mobilePhone: '',
      } } = user || {};
      const { mobilePhone = '' } = userinfo || {};
      this.userinfo = {};

      if (mobilePhone) {
        this.redirectToPage(false);
      } else {
        this.setState({
          show: true,
        })
      }
    } else {
      this.setState({
        show: true,
      })
    }


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
        const {
          avatarUrl,
          nickName,
          gender
        } = this.userinfo;
        this.props.saveUserInfo({
          nickName,
          gender,
          headimg: avatarUrl,
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
  public onLogin = (isByCode, username, code) => {
    const {
      bindingPhone,
    } = this.props;
    Promise.resolve()
      .then(() =>
        isByCode ? loginByPhoneValidateCode(username, code) : loginByPhonePwd(username, code))
      .then(() => (bindingPhone(username)
      )).then((res) => {
        Taro.setStorageSync('jwt', res.payload.authToken);
        const {
          avatarUrl,
          nickName,
          gender
        } = this.userinfo;
        this.props.saveUserInfo({
          nickName,
          gender,
          headimg: avatarUrl,
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
  public redirectToPage = (isSign) => {
    const {
      goTo } = this.props;
    const { page } = this.$router.params;
    return Promise.resolve().then(() => {
      if (page && page !== 'news') {
        if (isSign) {
          if (page === 'my') {
            Taro.navigateBack({
              delta: 1,
            })
          } else {
            Taro.redirectTo({
              url: `/pages/${page}/index`
            })
          }
        } else {
          Taro.redirectTo({
            url: `/pages/roleselection/index?page=${page}`
          })
        }
      } else {
        Taro.navigateBack({
          delta: 1,
        })
      }
    })

  }
  public onGetUserInfo = (method, e) => {
    if (e.detail.errMsg === GETUSERINFO) {
      const { nickName, } = e.detail.userInfo;
      this.userinfo = e.detail.userInfo
      this.setState({
        nickName,
        method,
        dialogVisable: true,
      })
    }
  }
  public onClose = () => {
    this.setState({
      dialogVisable: false,
    })
  }

  componentDidMount() {
  }
  componentWillUnmount() {

  }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { method, show, dialogVisable } = this.state;
    return (
      <View>
        
        {show ?
          <Block>
            {method !== LOGINMETHOD.PHONE ? <Button className={s.login} open-type="getUserInfo" onGetUserInfo={this.onGetUserInfo.bind(this, LOGINMETHOD.WECHAT)} type="primary">微信登录</Button> : null}
            {method !== LOGINMETHOD.PHONE ? <Button className={s.phonelogin} open-type="getUserInfo" onGetUserInfo={this.onGetUserInfo.bind(this, LOGINMETHOD.PHONE)} type="default">手机登录</Button> : null}
            {method === LOGINMETHOD.PHONE ? <LoginModule onLogin={this.onLogin} /> : null}
            {method === LOGINMETHOD.WECHAT && dialogVisable ? <WechatLoginModule onGetPhoneNumber={this.onGetPhoneNumber} onClose={this.onClose} /> : null}
          </Block> : null}
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

export default Index as ComponentClass<PageOwnProps, PageState>
