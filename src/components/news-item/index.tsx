import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { goToAction } from '../../actions/activity'
import classnames from 'classnames';
import s from './index.module.scss';
import newsimg from '../../assets/news-item.png';


type ComponentsStateProps = {
  activity: {
    current: string
  }
}

type ComponentsOwnProps = {
  title: string,
  url: string,
  content: string,
  date: string,
  border: boolean,
}

type ComponentsState = {}

type ComponentsDispatchProps = {
  goTo: (url: string) => any
}

type IProps = ComponentsStateProps & ComponentsDispatchProps & ComponentsOwnProps


interface Index {
  props: IProps,
}

@connect(({ activity }) => ({
  activity
}), (dispatch) => ({
  goTo: (url: string) => {
    dispatch(goToAction(url));
    Taro.navigateTo({
      url: '/pages/activity/index'
    })
  },
}))

class Index extends Component {
  static externalClasses = ['item-class']
  /**
 * 指定config的类型声明为: Taro.Config
 *
 * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
 * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
 * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
 */
  public goCurrent = () => {

    this.props.goTo(this.props.url);
  }
  render() {
    return (
      <View className={classnames(s.item, 'item-class')} onClick={this.goCurrent}>
        <Image src={newsimg} className={s.img} />
        <View className={s.info}>
          <View className={s.title}>{this.props.title}</View>
          <View className={s.content}>{this.props.content}</View>
          <View className={s.block} >&nbsp;</View>
          <View className={s.date}>{this.props.date}</View>
          <View className={classnames(
            s.divider,
            {
              [s.border]: this.props.border
            })} />
        </View>
      </View>
    )
  }
}

export default Index as ComponentClass<ComponentsOwnProps, ComponentsState>