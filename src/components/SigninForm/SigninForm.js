import React from 'react';

class Signindiv extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            emailInput:'',
            passwordInput:'',
            errorMessage: ''
        }
    }

    onEmailChange = (event) => {
        this.setState({ emailInput: event.target.value });
    } 

    onPassChange = (event) => {
        this.setState({ passwordInput: event.target.value });
    } 

    onSigninClick = () => {
        fetch('http://localhost:3000/signin', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: this.state.emailInput,
                pass: this.state.passwordInput
            })
        })
            .then(response => response.json())
            .then(result => {
                if(result.id){
                    this.props.updateProfile(result);
                    this.props.routeChange('home', false);
                }else{
                    this.setState({errorMessage: result});
                }
            })
    }

    render(){
        const { routeChange } = this.props;
        return (
            <article className="br3 ba b--black-10 mv4 w-80 w-40-l mw6 shadow-5 center" >
                <main className="pa4 black-80">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f1 fw6 ph0 mh0">Sign In</legend>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f4" for="email-address">Email</label>
                                <input onChange={this.onEmailChange} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-80" type="email" name="email-address"  id="email-address"/>
                            </div>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f4" for="password">Password</label>
                                <input onChange={this.onPassChange} className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-80" type="password" name="password"  id="password"/>
                            </div>
                        </fieldset>
                        { this.state.errorMessage === ''
                            ? ''
                            : <div className='f4 b mv1 red'>{this.state.errorMessage}</div>
                        }
                        <div className="mt3">
                            <input 
                                onClick = {this.onSigninClick} 
                                className="w-60 mv2 b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f4 dib" 
                                type="submit" 
                                value="Sign In"
                            />
                            <input 
                                onClick={() => routeChange('register', false)}
                                className="w-60 mv2 b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f4 dib" 
                                type="submit" 
                                value="Register"
                            />
                            <input 
                                onClick={() => routeChange('home', true)}
                                className="w-60 mv2 b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f4 dib" 
                                type="submit" 
                                value="Guest Login"
                            />
                        </div>
                    </div>
                </main>
            </article>
        );
    }
}

export default Signindiv;
