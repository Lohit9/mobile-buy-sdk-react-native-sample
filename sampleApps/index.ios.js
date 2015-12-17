/**
* Sample React Native App
* https://github.com/facebook/react-native
*/
'use strict';

var React = require('react-native');
var ProductList = require('./List');
var BuySdkManager = require('NativeModules').BuySdkManager;
var { requireNativeComponent } = React;

var {
  StyleSheet,
  NavigatorIOS,
  AppRegistry,
  Component
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

class sampleApps extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <NavigatorIOS
      navigationBarHidden= {false}
      translucent = {false}
      style={styles.container}
      initialRoute={{
        title: 'List of Products',
        component: ProductList,
        passProps: {
        }
      }}/>);
    }
  }

  AppRegistry.registerComponent('sampleApps', () => sampleApps);
