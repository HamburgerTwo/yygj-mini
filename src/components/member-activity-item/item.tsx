import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { goToAction } from '../../actions/activity'
import './item.scss';


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
    console.log(url)
    dispatch(goToAction(url));
    Taro.navigateTo({
      url: '/pages/activity/index'
    })
  },
}))

class Index extends Component {

  /**
 * 指定config的类型声明为: Taro.Config
 *
 * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
 * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
 * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
 */
  public goCurrent = () => {

    this.props.goTo(this.props.url);
    console.log(this.props.url)
  }
  render() {
    return (
      <View className='index' onClick={this.goCurrent}>
        {this.props.name}
      </View>
    )
  }
}

export default Index as ComponentClass<ComponentsOwnProps, ComponentsState>