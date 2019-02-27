import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Swiper, SwiperItem, Block, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.scss'
import s from './index.module.scss'
import NewsItem from '../../components/news-item'
import newsbanner from '../../assets/news-item.png';
import classnames from 'classnames';

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
      current: 0
    }
  }
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)

  }
  componentWillMount() {
    const { user } = this.props;
    const { isSign = false } = user || {};
    if(!isSign) {
      Taro.navigateTo({
        url:'/pages/authorize/index?page=study'
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
      url:'/pages/authorize/index?page=study'
    });
  }
  componentDidMount() {
  }
  componentWillUnmount() {

  }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { current } = this.state;
    const { user } = this.props;
    const { isSign = false } = user || {};
    return (
      <View>
        {isSign ? <Block>
          <Swiper
            className={s.swiper}
            circular
            autoplay
            onChange={this.onChange}>
            <SwiperItem>
              <Image src={newsbanner} />
            </SwiperItem>
            <SwiperItem>
              <Image src={newsbanner} />
            </SwiperItem>
            <SwiperItem>
              <Image src={newsbanner} />
            </SwiperItem>
          </Swiper>
          <View className={s.nav}>
            <View className={classnames({
              [s.current]: current === 0
            })}></View>
            <View className={classnames({
              [s.current]: current === 1
            })}></View>
            <View className={classnames({
              [s.current]: current === 2
            })}></View>
          </View>
          <NewsItem border={true} title="新闻1" url="http://www.baidu.com" content="新闻内容新闻内容新闻内容新闻" date="2018-01-11" />
          <NewsItem border={true} title="新闻1" url="http://www.baidu.com" content="新闻内容新闻内容新闻内容新闻" date="2018-01-11" />
          <NewsItem border={false} title="新闻1" url="http://www.baidu.com" content="新闻内容新闻内容新闻内容新闻" date="2018-01-11" />
        </Block> : <Button onClick={this.onAuthorize} className={s.login} type='primary'>去登录</Button>}
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
