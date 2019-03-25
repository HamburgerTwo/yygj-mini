






const withShare:any = () => {

  // 设置默认
  const defalutPath = 'pages/index/index';
  const defalutTitle = '夺宝奇兵';

  return (component) => {
    // redux里面的用户数据

    return class WithShare extends component {
      constructor(props) {
        super(props)
      }
      async componentWillMount() {

        if (super.componentWillMount) {
          super.componentWillMount();
        }
      }

      // 点击分享的那一刻会进行调用
      onShareAppMessage() {
        return {
          title: defalutTitle,
          path: defalutPath,
        };
      }

      componentWillUnmount() {
        if (super.componentWillUnmount) {
          super.componentWillUnmount()
        }
      }
      render() {
        return super.render();
      }
    }
  };
}

export default withShare;
