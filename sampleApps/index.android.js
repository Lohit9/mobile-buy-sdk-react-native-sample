'use strict';
var ProductList = require('./List');
var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Component,
  Navigator
} = React;

class sampleApps extends Component {

    constructor(props) {
       super(props);
    }

  render() {
   return (
    <Navigator
       initialRoute={{name: 'My First Scene', index: 0}}
       renderScene={(route, navigator) =>
           <ProductList
              name={route.name}
              onForward={() => {
               var nextIndex = route.index + 1;
               navigator.push({
               name: 'Scene ' + nextIndex,
               index: nextIndex,
               });
            }}
         onBack={() => {
           if (route.index > 0) {
             navigator.pop();
           }
         }}/>
       }/>);
 }}

var styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

AppRegistry.registerComponent('sampleApps', () => sampleApps);
