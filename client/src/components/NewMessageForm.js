import React, { Component } from 'react';
import { connect } from 'react-redux';
import { newPost } from '../actions/posts';
import { newMessage } from '../actions/messages';


class NewMessageForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
			youtubeInput: false,
			randomPhrasesTextarea: [
				"Какие у тебя мысли?",
				"Сегодня прекрасный день не правда ли",
				"Расскажи нам историю",
				"Я все еще скучаю по старым добрым временам"
			],
      selectedPlaceholderPhrase: null
		};

    this.handleNewMessage = this.handleNewMessage.bind(this);
  }

  componentWillUnmount() {}

  componentDidMount() {

  }

	handleNewMessage(e) {
		e.preventDefault();

		this.props.newMessage({
			username: this.props.profileId,
			message: e.target.message.value,
			extra: {
				value: e.target.extra.value,
				extraType: 'youtube'
			}
		});
    this.props.closeDialogsModal();
    window.location.reload();
		e.target.message.value = '';
		e.target.extra.value = '';
	}

  render() {
    return (
      <div className="d-flex">
      <div className="mr-4 d-none d-md-block">
        <img src={`http://localhost:3000${this.props.logged.profilePic}`} className="d-block mx-auto rounded-circle border" style={{width: '75px'}}/>
      </div>
      <div className="mt-2 w-100">
        <form onSubmit={this.handleNewMessage}>
          <div className="form-group">
            <textarea
              id="message"
              name="message"
              className="form-control border-top-0 border-left-0 border-right-0 border-brand rounded-0 profile__body__textarea__input"
              required
              placeholder={"Введите сообщение"}>
            </textarea>
          </div>
          <div className="form-group">
            <input name="extra" id="extra" className={"form-control mt-2 " + (this.state.youtubeInput ? 'd-flex' : 'd-none')} placeholder="https://www.youtube.com/watch?v=dO368WjwyFs"/>
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-brand rounded-pill float-right text-white">
              <i className="fas fa-paper-plane"></i> Отправить сообщение
            </button>

          </div>
        </form>
      </div>
      </div>
    );
  }
}
const stateToProps = state => ({
	logged: state.app.logged,
	profile: state.profile
});

const dispatchToProps = dispatch => ({
	newPost: value => dispatch(newPost(value)),
  newMessage: value => dispatch(newMessage(value)),
})

export default connect(stateToProps, dispatchToProps)(NewMessageForm);
