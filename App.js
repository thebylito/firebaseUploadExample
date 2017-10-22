import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, Image, Slider, Dimensions  } from 'react-native';
const width = Dimensions.get('screen').width;
import ImagePicker from 'react-native-image-crop-picker';
import firebase from 'react-native-firebase';

//const firebase = RNFirebase.initializeApp();

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      downloadURL: '',
      estado : 0.0
    }
  }

  uploadFoto = (dados) => {
    const { path } = dados;
    const mime = 'image/jpeg';

    const sessionId = new Date().getTime()
  uploadImagem = firebase.storage()
      .ref('/imagems').child(`${sessionId}.jpg`)
      .put(path, { contentType: mime });

      uploadImagem.on('state_changed', (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progresso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        console.log(progresso + '% ');
        this.setState({
          estado: progresso
        },()=>{
          console.log(snapshot.state)

        })
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // ou 'paused'
            console.log('upload pausado');
            break;
          case firebase.storage.TaskState.RUNNING: // ou 'running'
            console.log('upload em andamento');
            break;
          }
        }, (error) => {
          ImagePicker.clean().then(() => {
            console.log('arquivos temporarios removido');// para limpar o cache
          }).catch(e => {
            console.log(e);
          });
          console.log(error);
        }, (sucess) => {
          ImagePicker.clean().then(() => {
            console.log('arquivos temporarios removido');// para limpar o cache
          }).catch(e => {
            console.log(e);
          });
          console.log(sucess);
          const { downloadURL } = sucess;
          this.setState({
            downloadURL
          })

      });
  }

  selecionarFoto = () => {
    ImagePicker.openPicker({
      width: 1024,
      height: 1024,
      //cropperCircleOverlay: true,
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
      return (<View style={{elevation: 5}}><Image source={{uri: downloadURL}} style={{width: 300, height: 400}}/></View>)
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
        <Slider style={{width}} value={this.state.estado} minimumValue={0.0} maximumValue={100.0} step={this.state.estado}/>
        <Text>Enviando: {Math.floor(this.state.estado) } %</Text>
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
