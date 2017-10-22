import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, Image } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import RNFirebase from 'react-native-firebase';
const firebase = RNFirebase.initializeApp();

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      downloadURL: ''
    }
  }

  uploadFoto = (dados) => {
    const { path } = dados;
    const mime = 'image/jpeg';

    const sessionId = new Date().getTime()
    firebase.storage()
      .ref('/imagems').child(`${sessionId}.jpg`)
      .putFile(path, { contentType: mime })
      .then(uploadedFile => {
        console.log(uploadedFile);
        const { downloadURL } = uploadedFile;
        this.setState({
          downloadURL
        })
      })
      .catch(err => {
        console.log(err);
        //Error
      });
  }

  selecionarFoto = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true
    }).then((image) => {
      this.uploadFoto(image);
    }).catch((error) => {
      console.log(error);
    })
  }

  _renderFotoEnviada(){
    const { downloadURL } = this.state;
    if(downloadURL != ''){
      return (<Image source={{uri: downloadURL}} style={{width: 300, height: 300}}/>)
    }
    return null
  }

  render() {
    return (
      <View style={styles.container}>
      {this._renderFotoEnviada()}
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit App.js
        </Text>
        <Button title='Selecionar uma imagem' onPress={() => {
          this.selecionarFoto()
        }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
