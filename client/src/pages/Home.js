import React, { Component } from 'react';
import AuthForm from '../components/AuthForm';
import Logo from '../assets/images/logo.png';
import { connect } from 'react-redux';
import { toggleNavbar } from '../actions/app';
import { Link } from 'react-router-dom';
import { signIn } from '../actions/app';
import { signUp } from '../actions/app';


class Home extends Component {
	constructor(props){
		super(props);
		this.state = {
			signMode: 'menu'
		}

		this.getAuthComponent = this.getAuthComponent.bind(this);
		this.setMenuMode = this.setMenuMode.bind(this);
		this.setLoginMode = this.setLoginMode.bind(this);
		this.setSignupMode = this.setSignupMode.bind(this);
	}

	componentDidMount() {
		if(this.props.isLogged)
			this.props.history.push(`/u/${this.props.user}`)
	}

	componentDidUpdate() {
		if(this.props.isLogged)
			this.props.history.push(`/u/${this.props.user}`)
	}

	setLoginMode() {
		this.setState(() => ({signMode: 'login'}))
	}

	setMenuMode() {
		this.setState(() => ({signMode: 'menu'}))
	}

	setSignupMode() {
		this.setState(() => ({signMode: 'signup'}))
	}

	getAuthComponent() {
		const signMode = this.state.signMode;

		switch (signMode) {
			case 'signup':
				return <AuthForm type="signup" backMethod={this.setMenuMode} onSuccess={this.props.signUp} />
			case 'login':
				return <AuthForm type="login" backMethod={this.setMenuMode} onSuccess={this.props.signIn} />
		}
	}

	render(){
		return (
			<div className="home">
				<div className="row h-100">
					<div className="col-8 d-none d-md-flex flex-column justify-content-sm-start pl-5 home__left">

					</div>
					<div className="col-12 col-md-4 bg-white home__right d-flex flex-column justify-content-center">
						<div className="row justify-content-center">
							<div className="col-6">
								<h4>Социальная сеть БГТУ</h4>
								<img src={Logo} className="mx-auto d-block img-fluid" />
							</div>
						</div>
						<div className="row pr-md-3">
							<div className="col-12 px-4">
								<div className="card border-0 rounded-0">
									<div className="card-body">
										{this.state.signMode == 'menu' &&
											<div>
												<button
													className="btn btn-outline-brand btn-block rounded-pill"
													onClick={this.setSignupMode}>Регистрация</button>
												<button
													className="btn btn-brand btn-block text-light rounded-pill"
													onClick={this.setLoginMode}>Вход на сайт</button>
												<hr/>
												<Link to="/explore"
													className="btn btn-brand-secondary btn-block text-white rounded-pill">
													Войти как гость
												</Link>
											</div>
										}
										{this.state.signMode != 'menu' &&
											<>
												{this.getAuthComponent()}
											</>
										}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

const stateToProps = state => ({
	isLogged: state.app.logged.isLogged,
	user: state.app.logged.username
});

const dispatchToProps = dispatch => ({
	toggleNavbar: value => dispatch(toggleNavbar(value)),
	signIn: value => dispatch(signIn(value)),
	signUp: value => dispatch(signUp(value))
})

export default connect(stateToProps, dispatchToProps)(Home);
