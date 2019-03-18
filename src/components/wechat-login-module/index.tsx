import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components'
import s from './index.module.scss';
import close from '../../assets/close.png';

type ComponentsStateProps = {

}

type ComponentsOwnProps = {
  onGetPhoneNumber: any,
  onClose: any
}

type ComponentsState = {
}

type ComponentsDispatchProps = {
}

type IProps = ComponentsStateProps & ComponentsDispatchProps & ComponentsOwnProps


interface Index {
  props: IProps,
}



class Index extends Component<ComponentsOwnProps, ComponentsState> {
  constructor(props) {
    super(props);
  }

  /**
 * 指定config的类型声明为: Taro.Config
 *
 * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
 * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
 * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
 */


  render() {
    return (
      <View className={s.container}>
        <View className={s.dialog}>
          <View className={s.close} onClick={this.props.onClose} >
            <Image src={close} />
          </View>
          <View className={s.title}>
            授权手机号码
          </View>
          <View className={s.tips}>
            <View>我们需要你授权你在微信绑定的手</View>
            <View>机号码，为你提供相关服务</View>
          </View>
          <Button className={s.login} open-type="getPhoneNumber" onGetPhoneNumber={this.props.onGetPhoneNumber} type="primary">同意授权</Button>
        </View>
      </View>
    )
  }
}

export default Index as ComponentClass<ComponentsOwnProps, ComponentsState>