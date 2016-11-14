'use strict';
var React = require('react-native');
var BuySdkManager = require('NativeModules').BuySdkManager;

/*Please enter your shop details here:----------------- */
var SHOP_DOMAIN = "";
var API_KEY = "";
var CHANNEL_ID = "";
var MERCHANT_ID= " ";
/*------------------------------------------------------*/
var REQUEST_URL = "https://" + SHOP_DOMAIN + "/api/channels/" + CHANNEL_ID + "/product_publications.json?limit=25&page=1";

var {
  Navigator,
  Image,
  StyleSheet,
  Text,
  View,
  Component,
  ListView,
  TouchableHighlight,
  ActivityIndicatorIOS
} = React;

var styles = StyleSheet.create({
  container:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 10
  },
  thumbnail: {
    width: 53,
    height: 81,
    marginRight: 10
  },
  rightContainer: {

    flex: 1
  },
  title: {
    fontSize: 20,
    marginBottom: 8
  },
  price: {
    color: '#656565'
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  listView: {
    backgroundColor: '#F5FCFF'
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }

});

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authstring:' ',
      isLoading: true,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
    };
  }

  authorize(domain,api,channel,merchantid) {
    BuySdkManager.authorize(domain,api,channel,merchantid, (error, header) => {
      this.state.authstring = header;
      var object = {
        headers:{
          Authorization:this.state.authstring
        }
      };
      fetch(REQUEST_URL,object)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData.product_publications),
          isLoading: false
        });
      })
      .done();
    })
  }

  componentDidMount(){
    this.authorize(SHOP_DOMAIN,API_KEY,CHANNEL_ID,MERCHANT_ID);
  };

  render() {
    if (this.state.isLoading) {
      return this.renderLoadingView();
    }
    return (
      <ListView
      dataSource={this.state.dataSource}
      renderRow={this.renderproducts.bind(this)}
      style={styles.listView}
      />);
    }

    renderLoadingView() {
      return (
        <View style={styles.loading}>
        <ActivityIndicatorIOS
        size='large'/>
        <Text>
        Loading Products...
        </Text>
        </View>
      );
    }

    //functions handles callbacks and displaying of native view after product is seleced
    OnClick(products){
      console.log("product selected")
      BuySdkManager.presentProductwithId(String(products.product_id));
      console.log("product view displayed succesfully");
    }

    renderproducts(products){
      var imageURI = (typeof products.images[0] !== 'undefined') ? products.images[0].src : '';
      return (
        <TouchableHighlight onPress={() => this.OnClick(products)}  underlayColor='#dddddd'>
        <View>
        <View style={styles.container}>
        <Image
        source={{uri: imageURI}}
        style={styles.thumbnail} />
        <View style={styles.rightContainer}>
        <Text style={styles.title}>{products.title}</Text>
        <Text style={styles.author}>{products.variants[0].price}</Text>
        </View>
        </View>
        <View style={styles.separator} />
        </View>
        </TouchableHighlight>
      );
    }
  }

  module.exports = List;
