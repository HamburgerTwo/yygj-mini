import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import classnames from 'classnames';
import s from './item.module.scss';
import itembg from '../../assets/item-bg.png';


type ComponentsStateProps = {
  activity: {
    current: string
  }
}

type ComponentsOwnProps = {
  name: string,
  url: string,
}

type ComponentsState = {}

type ComponentsDispatchProps = {
 
}

type IProps = ComponentsStateProps & ComponentsDispatchProps & ComponentsOwnProps


interface Index {
  props: IProps,
}



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
      Taro.navigateTo({
          url: `/pages/activity/index?url=${encodeURIComponent(this.props.url)}`
      })
  }
  render() {
    return (
      <View className={classnames(s.item, 'item-class')} onClick={this.goCurrent}>
        <Image src={itembg} />
        {this.props.name}
      </View>
    )
  }
}

export default Index as ComponentClass<ComponentsOwnProps, ComponentsState>