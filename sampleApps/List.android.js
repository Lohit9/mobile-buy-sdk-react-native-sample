'use strict';
var React = require('react-native');
var { NativeModules } = require('react-native'); // used to import the react node modules
var BuySDKManager = require('./Export') // used to import the native android module

//--------------------------------------------------------//
var SHOP_DOMAIN = "<YOUR SHOP DOMAIN>";
var API_KEY = "<YOUR API KEY>";
var CHANNEL_ID = "<YOUR CHANNEL ID>";
//-------------------------------------------------------//

//the below code generates an URL from which we will get the list of products
var REQUEST_URL = "https://" + SHOP_DOMAIN + "/api/channels/" + CHANNEL_ID + "/product_publications.json?limit=25&page=1";

//The code below is a declaration of objects,variables and their style attributes
var {
    Navigator,
    Image,
    StyleSheet,
    Text,
    View,
    Component,
    ListView,
    TouchableHighlight,
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
    view: {
      flex: 1
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
//Generates the authentication header used to authenticate the above request url.
    authorize() {
      // Makes a call to native code, the function showToast generates the auth header
      BuySDKManager.showToast(API_KEY,(msg) => {
      this.state.authstring = msg
      var object = {
          headers:{
          Authorization:this.state.authstring
      }};
      // Parses the json and stores it in a data source object which we will use to populate the table view
      fetch(REQUEST_URL,object)
          .then((response) => response.json())
          .then((responseData) => {
              this.setState({
                  dataSource: this.state.dataSource.cloneWithRows(responseData.product_publications),
                  isLoading: false
              });
          })
          .done();
      })}

componentDidMount() {
  this.authorize();
};

//Renders the List View
    render() {
        if (this.state.isLoading) {
            return this.renderLoadingView();
        }
        return (
          <View style={styles.view}>
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderproducts.bind(this)}
                style={styles.listView}
                />
          </View>
        );
    }

    renderLoadingView() {
        return (
            <View style={styles.loading}>
                <Text>
                    Loading Products...
                </Text>
            </View>
        );}

    renderproducts(products){
        var imageURI = (typeof products.images[0] !== 'undefined') ? products.images[0].src : ' ';
        return (
          // This calls the native function presentProductwithId function, this renders the product view activity
            <TouchableHighlight onPress={() => BuySDKManager.presentProductWithId(String(products.product_id), SHOP_DOMAIN,API_KEY,CHANNEL_ID)}  underlayColor='#dddddd'>
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
