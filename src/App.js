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
      userProfile: {
        id: '',
        email: "",
        name: "",
        entries: 0,
        joined: ''
      }
    }
  }

  routeChangeGuest = (state) => {
    if(state === 'home'){
      this.setState({
        isGuest: true,
        signedIn: true,
        entries: 0
      });
    }else{
      this.setState({
        isGuest: false,
        signedIn: false,
        entries: 0
      });
    }
    this.setState({route: state});
  }

  routeChange = (state) => {
    if(state === 'home'){
      this.setState({signedIn: true});
    }else{
      this.setState({signedIn: false});
    }
    this.setState({route: state});
  }

  calculateLocation = (data) => {
    const location = data.outputs[0].data.regions[0].region_info.bounding_box;
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

  onInputChange = (event) => {
    this.setState({input: event.target.value});
    //console.log(this.state.input);
  }

  onDetect = () => {
    this.setState({imgURL: this.state.input});
    app.models.predict('c0c0ac362b03416da06ab3fa36fb58e3', this.state.input)
      .then(response => {
        if(response && !this.state.isGuest){
          //console.log(this.state.userProfile.id);
          fetch('http://localhost:3000/image', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.userProfile.id
            })
          })
            .then(response => response.json())
            .then(result => {
              //console.log(result); 
              this.setState(Object.assign(this.state.userProfile, {entries: result}));
            })
        }else if(this.state.isGuest){ 
          console.log(this.state.entries);
          this.setState({ entries: this.state.entries + 1 });
          console.log(this.state.entries);
        }
        this.calculateLocation(response)
      })
      .catch(err => console.log(err))
  }

  updateProfile = (user) => {
    this.setState({userProfile: {
      id: user.id,
      email: user.email,
      name: user.name,
      entries: user.entries,
      joined: user.joined
    }});
    //console.log(this.state.userProfile);
  }

  render(){
    return (
      <div className="App">
        <Particles className='particles' params={particlesOption}/>
        <Navigation signedIn={this.state.signedIn} routeChange={this.routeChange} routeChangeGuest={this.routeChangeGuest} isGuest={this.state.isGuest} />
        { this.state.route === 'home'
          ? <div>
              <Logo />
              <Rank name={this.state.userProfile.name} entries={this.state.userProfile.entries} isGuest={this.state.isGuest} />
              <LinkForm 
                onDetect={this.onDetect} 
                onInputChange={this.onInputChange} 
              /> 
              <FaceRecognition box={this.state.box} imgURL={this.state.imgURL} />
            </div>
          : (
              this.state.route === 'signin'
              ?<SigninForm routeChangeGuest={this.routeChangeGuest} updateProfile={this.updateProfile} routeChange={this.routeChange} />
              :<Register routeChangeGuest={this.routeChangeGuest} updateProfile={this.updateProfile} routeChange={this.routeChange} />
            )
        } 
      </div>
    );
  }
}

export default App;
