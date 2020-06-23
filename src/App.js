import React, { Component } from 'react';
import Clarifai from 'clarifai';
import Particles from 'react-particles-js';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import LinkForm from './components/LinkForm/LinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SigninForm from './components/SigninForm/SigninForm';
import Register from './components/Register/Register'

const particlesOption = {
  "particles": {
    "number": {
      "value": 100,
      'desity':{
        'enable': true,
        'value_area': 800
      }
    },
    "size": {
      "value": 3
    }
  },
  // "interactivity": {
  //   "events": {
  //       "onhover": {
  //           "enable": true,
  //           "mode": "repulse"
  //       }
  //   }
  // }
}

const app = new Clarifai.App({
  apiKey: '90d630dbb3394c9a9c99159a78fa0dc5'
});

class App extends Component {
  constructor() {
    super();
    this.state = {
      input:'',
      imgURL:'',
      box:{},
      route:'signin',
      signedIn: false,
      isGuest: false,
      celebrityName: '',
      chance: '',
      imageDetectionError: false,
      userProfile: {
        id: '',
        email: "",
        name: "",
        entries: 0,
        joined: ''
      }
    }
  }

  routeChange = (state, isGuest) => {
    if(state === 'home'){
      this.setState({
        signedIn: true,
        isGuest: isGuest,
        entries: 0
      });
    }else{
      this.setState({
        isGuest: isGuest,
        signedIn: false,
        entries: 0,
        imgURL: '',
        celebrityName: '',
        chance: ''
      });
    }
    this.setState({route: state});
  }

  calculateLocation = (data) => {
    const location = data.region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    const box = {
      left: location.left_col * width,
      top: location.top_row * height,
      right: width - (location.right_col * width),
      bottom: height - (location.bottom_row * height)
    }
    this.setState({box});
  }

  calculateCelebrity = (inputData) => {
    const celebrity = inputData.data.concepts[0];
    const percentage = celebrity.value.toFixed(2) * 100;
    this.setState({
      celebrityName: celebrity.name,
      chance: percentage + '%'
    })
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onDetect = () => {
    this.setState({
      imgURL: this.state.input,
      box: {},
      celebrityName: '',
      chance: '',
      imageDetectionError: false
    });
    app.models.predict(Clarifai.CELEBRITY_MODEL, this.state.input)
      .then(response => {
        if(response.outputs[0].data.regions){
          if(!this.state.isGuest){
            fetch('http://localhost:3000/image', {
              method: 'PUT',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                id: this.state.userProfile.id
              })
            })
              .then(response => response.json())
              .then(result => {
                this.setState(Object.assign(this.state.userProfile, {entries: result}));
              })
          }
          const data = response.outputs[0].data.regions[0];
          this.calculateLocation(data);
          this.calculateCelebrity(data);
        }
      })
      .catch(err => { 
        console.log(err);
        this.setState({imageDetectionError: true});
      })
  }

  updateProfile = (user) => {
    this.setState({userProfile: {
      id: user.id,
      email: user.email,
      name: user.name,
      entries: user.entries,
      joined: user.joined
    }});
  }

  render(){
    return (
      <div className="App">
        <Particles className='particles' params={particlesOption}/>
        <Navigation signedIn={this.state.signedIn} routeChange={this.routeChange} isGuest={this.state.isGuest} />
        { this.state.route === 'home'
          ? <div>
              <Logo />
              <Rank name={this.state.userProfile.name} entries={this.state.userProfile.entries} isGuest={this.state.isGuest} />
              <LinkForm 
                onDetect={this.onDetect} 
                onInputChange={this.onInputChange} 
              /> 
              <FaceRecognition imageDetectionError={this.state.imageDetectionError} celebrityName={this.state.celebrityName} chance={this.state.chance} box={this.state.box} imgURL={this.state.imgURL} />
            </div>
          : (
              this.state.route === 'signin'
              ?<SigninForm updateProfile={this.updateProfile} routeChange={this.routeChange} />
              :<Register routeChangeGuest={this.routeChangeGuest} updateProfile={this.updateProfile} routeChange={this.routeChange} />
            )
        } 
      </div>
    );
  }
}

export default App;
