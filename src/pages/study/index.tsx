import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Swiper, SwiperItem, Block, Button, WebView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.scss'
import s from './index.module.scss'
// import NewsItem from '../../components/news-item'
// import newsbanner from '../../assets/news-item.png';
// import classnames from 'classnames';
import { DbqbUrl } from '../../config';
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
  user: any,
}

type PageDispatchProps = {
  goTo: (url: string) => Promise<any>
}

type PageOwnProps = {}

type PageState = {
  current: number,
  show: boolean,
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

@connect(({ user }) => ({
  user
}), (dispatch) => ({
  goTo: (url) => {
    
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
    navigationBarTitleText: '学习',
    navigationStyle: 'default',
  }

  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      show: true,
    }
  }
  componentWillReceiveProps(nextProps) {

  }
  componentWillMount() {
    const { user } = this.props;
    const { userinfo = {
      mobilePhone : ''
    } } = user || {};
    const { mobilePhone } = userinfo;
    if(!mobilePhone) {
      Taro.navigateTo({
        url:'/pages/authorize/index?page=news'
      });
    }
  }

  public onChange = (e) => {
    this.setState({
      current: e.detail.current
    })
  }

  public onAuthorize = () => {
    Taro.navigateTo({
      url:'/pages/authorize/index?page=news'
    });
  }
  componentDidMount() {
  }
  componentWillUnmount() {

  }

  componentDidShow() {
    this.setState({
      show: true,
    })
  }

  componentDidHide() { 
    this.setState({
      show: false,
    })
  }

  render() {
    const { user } = this.props;
    const { userinfo = {
      mobilePhone : ''
    } } = user || {};
    const { mobilePhone } = userinfo;
    const { show } = this.state;
    return (
      show ?
      <View>
        {mobilePhone ? <WebView src={`${DbqbUrl}?jwt=${Taro.getStorageSync('jwt')}#/News`} /> : <Button onClick={this.onAuthorize} className={s.login} type='primary'>去登录</Button>}
      </View> 
      : null
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
