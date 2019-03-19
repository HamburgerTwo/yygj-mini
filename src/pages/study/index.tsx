import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Swiper, SwiperItem, Block, Button, WebView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.scss'
import s from './index.module.scss'
import AuthorizeItem from '../../components/authorize-item/index';
// import NewsItem from '../../components/news-item'
// import newsbanner from '../../assets/news-item.png';
// import classnames from 'classnames';
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
  activity: any,
}

type PageDispatchProps = {
  goTo: (url: string) => Promise<any>,
  
}

type PageOwnProps = {}

type PageState = {
  currentUrl: string,
  jwt: string,
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

@connect(({ user, activity }) => ({
  user,
  activity,
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
    navigationBarTitleText: '学院',
    navigationStyle: 'default',
  }

  constructor(props) {
    super(props);
    this.state = {
      currentUrl: '',
      jwt: '',
    }
  }
  componentWillReceiveProps(nextProps) {
    this.onLogined(nextProps);
  }
  componentWillMount() {
    
  }


  
  componentDidMount() {
  }
  componentWillUnmount() {

  }

  componentDidShow() {
    this.onLogined(this.props);
   
  }
  public onLogined = (props) => {
    
    const { activity = {}, user = {},  } = props;
    const { config = {
    } } = activity || {};
    const { userinfo = {
      mobilePhone : '',
      
    } } = user || {};
    const { mobilePhone } = userinfo;
    if (!mobilePhone) {
      Taro.setNavigationBarTitle({
        title: '登录'
      });
    } else {
      Taro.setNavigationBarTitle({
        title: '学院'
      });
    }
    const { jwt } = this.state;
    if (jwt !== Taro.getStorageSync('jwt')) {
      const { userinfo = {} } = user
      const { dbqbStudyUrl = '' } = config;
      const currentUrl = dbqbStudyUrl ? `${dbqbStudyUrl.replace('{{jwt}}', userinfo.mobilePhone ? Taro.getStorageSync('jwt') : '')}` : '';
      
      this.setState({
        currentUrl,
        jwt: Taro.getStorageSync('jwt'),
       
      })
    } 
  }
  
  componentDidHide() { 
    
  }

  render() {
    const { user } = this.props;
    
    const { userinfo = {
      mobilePhone : ''
    } } = user || {};
    const { mobilePhone } = userinfo;
    const {  currentUrl} = this.state;
    return (
      <View>
        {mobilePhone ? <WebView src={currentUrl} /> : <AuthorizeItem />}
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
