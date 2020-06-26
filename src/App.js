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

//background object
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
  //********Background Interaction Option Disabled********
  // "interactivity": {
  //   "events": {
  //       "onhover": {
  //           "enable": true,
  //           "mode": "repulse"
  //       }
  //   }
  // }
}

//Clarifal celebrity recognition api setup
const app = new Clarifai.App({
  apiKey: '90d630dbb3394c9a9c99159a78fa0dc5'
});


//Variable used to reset state upon logout
const initialState = {
  input:'',
  imgURL:'',
  box:{},
  route:'signin',
  signedIn: false,
  isGuest: false,
  celebrityNameMessage: '',
  imageDetectionError: false,
  userProfile: {
    id: '',
    email: "",
    name: "",
    entries: 0,
    joined: ''
  }
}

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
      celebrityNameMessage: '',
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

  //state change when users signin/register/signout
  routeChange = (state, isGuest) => {
    if(state === 'home'){
      this.setState({
        signedIn: true,
        isGuest: isGuest,
      });
    }else{
      this.setState(initialState);
    }
    this.setState({route: state});
  }

  //calculate location of the face using data responded by Clarifai API
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

  //obtain the celebrity information using data responded by Clarifai API
  calculateCelebrity = (inputData) => {
    const celebrity = inputData.data.concepts[0];
    const percentage = Math.round(celebrity.value*10000)/100;
    this.setState({
      celebrityNameMessage: (percentage < 1)?'No Celebrity Detection':(celebrity.name + ': ' + percentage + '%')
    })
  }

  //function used to change state when the image URL input changes
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  //upon detecting celebrity/face from image,
  //setstate according to the user input image 
  // URL and responded data from Clarifai
  onDetect = () => {
    this.setState({ //reset state upon clicking button
      imgURL: this.state.input,
      box: {},
      celebrityNameMessage: '',
      imageDetectionError: false
    });
    app.models.predict(Clarifai.CELEBRITY_MODEL, this.state.input)
      .then(response => {
        if(response.outputs[0].data.regions){ //if the format of the responded data is corrent
          if(!this.state.isGuest){ //if user is registered, updating user informtion(number of entries from users) to the server
            fetch('https://secret-shore-76423.herokuapp.com/image', {
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
          //calls functions to calculate face location/ celebrity information
          const data = response.outputs[0].data.regions[0];
          this.calculateLocation(data);
          this.calculateCelebrity(data);
        }
      })
      .catch(err => { 
        this.setState({imageDetectionError: true});
      })
  }

  //function updating user profile upon logging in
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
        <Particles 
          className='particles' 
          params={particlesOption}
        />
        <Navigation 
          signedIn={this.state.signedIn} 
          routeChange={this.routeChange} 
          isGuest={this.state.isGuest} 
        />
        
        {/* Displaying homepage/signinPage/registerPage according to route state */}
        { this.state.route === 'home'
          ? <div>
              <Logo />
              <Rank 
                name={this.state.userProfile.name} 
                entries={this.state.userProfile.entries} 
                isGuest={this.state.isGuest} 
              />
              <LinkForm 
                onDetect={this.onDetect} 
                onInputChange={this.onInputChange} 
              /> 
              <FaceRecognition 
                imageDetectionError={this.state.imageDetectionError} 
                celebrityNameMessage={this.state.celebrityNameMessage} 
                box={this.state.box} 
                imgURL={this.state.imgURL} 
              />
            </div>
          : (
              this.state.route === 'signin'
              ?<SigninForm 
                updateProfile={this.updateProfile} 
                routeChange={this.routeChange} 
              />
              :<Register 
                routeChangeGuest={this.routeChangeGuest} 
                updateProfile={this.updateProfile} 
                routeChange={this.routeChange} 
              />
            )
        } 
      </div>
    );
  }
}

export default App;
