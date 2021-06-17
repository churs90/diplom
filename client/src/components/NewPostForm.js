import React, { Component } from 'react';
import { connect } from 'react-redux';
import { newPost } from '../actions/posts';
import { newMessage } from '../actions/messages';


class NewPostForm extends Component {
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

    this.handleNewPost = this.handleNewPost.bind(this);
		this.getRandomQuote = this.getRandomQuote.bind(this);
  }

  componentWillUnmount() {}

  componentDidMount() {
    this.getRandomQuote();
  }

	getRandomQuote() {
		const rand = Math.floor(Math.random() * this.state.randomPhrasesTextarea.length);
    this.setState(({
      selectedPlaceholderPhrase: this.state.randomPhrasesTextarea[rand]
    }))
	}

	handleNewPost(e) {
		e.preventDefault();

		this.props.newPost({
			username: this.props.profileId,
			message: e.target.message.value,
			extra: {
				value: e.target.extra.value,
				extraType: 'youtube'
			}
		});

		e.target.message.value = '';
		e.target.extra.value = '';
	}

  render() {
    return (
      <div className="d-flex">
      <div className="mr-4 d-none d-md-block">
        <img src={`http://localhost:3000${this.props.ownsProfile ? this.props.logged.profilePic : this.props.profile.profilePic}`} className="d-block mx-auto rounded-circle border" style={{width: '75px'}}/>
      </div>
      <div className="mt-2 w-100">
        <form onSubmit={this.handleNewPost}>
          <div className="form-group">
            <textarea
              id="message"
              name="message"
              className="form-control border-top-0 border-left-0 border-right-0 border-brand rounded-0 profile__body__textarea__input"
              required
              placeholder={"Введите текст"}>
            </textarea>
          </div>
          <div className="form-group">
            <input name="extra" id="extra" className={"form-control mt-2 " + (this.state.youtubeInput ? 'd-flex' : 'd-none')} placeholder="https://www.youtube.com/watch?v=dO368WjwyFs"/>
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-brand rounded-pill float-right text-white">
              <i className="fas fa-paper-plane"></i> Добавить пост
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
	profile: state.profile,
  ownsProfile: state.profile.ownProfile
});

const dispatchToProps = dispatch => ({
	newPost: value => dispatch(newPost(value)),
  newMessage: value => dispatch(newMessage(value)),
})

export default connect(stateToProps, dispatchToProps)(NewPostForm);
