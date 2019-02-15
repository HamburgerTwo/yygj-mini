import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker, Image } from '@tarojs/components'
import classnames from 'classnames';
import s from './select.module.scss';
import arrow from '../../assets/icon-arrow.png';

type ComponentsStateProps = {

}

type selectItem = {
  id: number,
  value: string,
}

type ComponentsOwnProps = {
  name: string,
  selectedItem: selectItem,
  list: Array<selectItem>,
  onChange: (e: object) => any,
}

type ComponentsState = {
}

type ComponentsDispatchProps = {
  goTo: (url: string) => any
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
    this.props.onChange(this.props.list[e.detail.value]);
  }
  static defaultProps = {
    list: []
  }
  render() {
    const index = this.props.list.findIndex(x => x.id === this.props.selectedItem.id) || 0
    return (
      <Picker className={classnames('item-class')} mode='selector' range={this.props.list} rangeKey="value" value={index} onChange={this.onDataChange}>
        <View className={s.item}><Text className={s.label}>{this.props.name}</Text>
          <View className={s.selector}>
            {this.props.selectedItem.value}
          </View>
          <Image src={arrow} className={s.arrow} />
        </View>
      </Picker>
    )
  }
}

export default Index as ComponentClass<ComponentsOwnProps, ComponentsState>