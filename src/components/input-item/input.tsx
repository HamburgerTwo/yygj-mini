import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, Image } from '@tarojs/components'
import classnames from 'classnames';
import s from './input.module.scss';
import arrow from '../../assets/icon-arrow.png';

type ComponentsStateProps = {

}


type ComponentsOwnProps = {
  name: string,
  value: string,
  onChange: (e: object) => any,
}

type ComponentsState = {
}

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
  public onDataChange = (e) => {
    this.props.onChange(e.detail.value);
  }
  render() {
    return (
      <View className={classnames('item-class', s.item)}>
        <Text className={s.label}>{this.props.name}</Text>
        <Input type='text' value={this.props.value} onInput={this.onDataChange} className={s.input} />
        <Image src={arrow} className={s.arrow} />
      </View>
    )
  }
}

export default Index as ComponentClass<ComponentsOwnProps, ComponentsState>