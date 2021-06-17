import React, {Component} from 'react';
import { connect } from 'react-redux';
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs';
import { deleteMessage } from '../actions/messages';
import { Link, withRouter } from 'react-router-dom';
import Linkify from 'react-linkify';
import cogoToast from "cogo-toast";



class Message extends Component {
	constructor(props) {
		super(props);

		this.deleteMessage = this.deleteMessage.bind(this);
		this.canDeleteIt = this.canDeleteIt.bind(this);
		this.parseText = this.parseText.bind(this);

		dayjs.extend(relativeTime)
	}

	deleteMessage() {
		this.props.deleteMessage({ messageId: this.props._id })
	}

	canDeleteIt() {
		return true;
	}

	parseText() {
		const reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
		const textFractions = this.props.message.split
	}


	render() {
		return (
			<div className="card w-100 my-5 post">
				<div className="card-header bg-white pb-0 border-0 d-flex justify-content-between">
					<div>
						<small className="text-muted">{dayjs().from(dayjs(this.props.createdAt))} ago.</small>
					</div>
					<div className="d-flex">
						<div>
							<Link to={'/u/' + this.props.author.username}>{this.props.author.username}</Link>
						</div>
						<div className="post__avatar ml-2">
							<Link to={'/u/' + this.props.author.username}>
								<img src={`http://localhost:3000${this.props.author.profilePic}`} className="img-fluid cursor-pointer rounded-circle" />
							</Link>
						</div>
					</div>
				</div>
				<div className="card-body px-4 py-4">
						<Linkify properties={{target: '_blank'}}>
							<p className="my-0 py-0 ws-pre-line">{this.props.message}</p>
						</Linkify>

					{this.canDeleteIt() &&
						<div onClick={this.deleteMessage} className="d-inline-flex px-3 py-1 rounded-pill post__delete cursor-pointer">
							<span className="text-secondary">
								<i className="fas fa-times"></i>
							</span>
						</div>
					}
				</div>
			</div>
		)
	}
}

const stateToProps = state => ({
	logged: state.app.logged.isLogged,
	session: state.app.logged,
	username: state.app.logged.username
});

const dispatchToProps = dispatch => ({
	deleteMessage: data => dispatch(deleteMessage(data)),
});

export default connect(stateToProps, dispatchToProps)(withRouter(Message));
