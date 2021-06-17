import React, { Component } from "react";
import { changeDescription } from "../actions/settings";
import { toggleNavbar, toggleProfilePictureModal } from "../actions/app";
import {ls} from "./../assets/_localStorage";
import {
  fetchProfile,
  restartState,
  toggleSidenav,
  toggleEditingDescription,
} from "../actions/profile";
import {
  fetchUserPosts,
  newPost,
  restartState as restartStatePosts,
} from "../actions/posts";
import { fetchUserMessages } from "../actions/messages";
import BottomScrollListener from "react-bottom-scroll-listener";
import { connect } from "react-redux";
import Post from "../components/Post";
import NewPostForm from "../components/NewPostForm";
import ProfilePictureModal from "../components/ProfilePictureModal";
import Loading from "../components/Loading";
import cogoToast from "cogo-toast";

import { logout } from "../actions/app";
import Auth from "../components/Auth";
import Message from "../components/Message";
import NewMessageForm from "../components/NewMessageForm";

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openDialogsModal: false,
	  notification: false
    };

    this.openProfilePictureModal = this.openProfilePictureModal.bind(this);
    this.updateDescription = this.updateDescription.bind(this);
  }

  clickMessages = (flag) => {
    this.setState({
      openDialogsModal: true,
    });
	this.setState({
		notification: flag,
	  });
	  ls.set("read","read");
  };

  closeDialogsModal = (e) => {
    this.setState({
      openDialogsModal: false,
    });
  };

  componentDidMount() {
    this.initializeProfile();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.location !== prevProps.location) {
      this.props.restartState();
      this.props.restartStatePosts();
      this.initializeProfile();
    }

	if (this.props.messages.length !==0 && this.props.messages !== prevProps.messages && ls.get("read")!=="read") {
		this.setState({
			notification: true
		  });
	  }
  }

  componentWillUnmount() {
    this.props.restartState();
    this.props.restartStatePosts();
  }

  fetchUserPosts() {
    const profileId = this.props.match.params.id;
    this.props.fetchUserPosts(profileId);
  }

  fetchUserMessages() {
    const profileId = this.props.match.params.id;
    this.props.fetchUserMessages(profileId);
  }

  initializeProfile() {
    this.props.fetchProfile(this.props.match.params.id);
    this.fetchUserPosts();
    this.fetchUserMessages();
  }

  openProfilePictureModal() {
    if (this.props.ownsProfile) {
      this.props.toggleProfilePictureModal();
    }
  }

  updateDescription(e) {
    e.preventDefault();
    const description = e.target.description.value;

    if (this.props.profile.description == description) {
      cogoToast.warn(
        <p>
          <strong>Статус не изменён</strong>
        </p>,
        {
          position: "bottom-right",
        }
      );
    } else if (description.length > 150) {
      cogoToast.warn("Максимальное кол-во символов: 150", {
        position: "bottom-right",
      });
    } else {
      Promise.resolve(this.props.changeDescription(description)).then(() =>
        this.props.toggleEditingDescription()
      );
    }
  }

  render() {
    return (
      <div className="d-flex flex-column flex-md-row profile w-100">
        {this.props.profilePicModal && this.props.ownsProfile && (
          <ProfilePictureModal />
        )}
        <div
          className={
            "d-none d-md-flex sidenav flex-column " +
            (!this.props.profile.visibleSidenav ? "sidenav--inactive" : "")
          }
        >
          <div className="sidenav__description">
            <div
              onClick={this.openProfilePictureModal}
              className={
                "sidenav__avatar mx-auto d-block mt-5 mb-2" +
                (this.props.ownsProfile &&
                  " sidenav__avatar--owner cursor-pointer")
              }
            >
              <img
                src={`http://localhost:3000${this.props.ownsProfile ? this.props.logged.profilePic : this.props.profile.profilePic}`}
                className={
                  "sidenav__avatar__image img-fluid rounded-circle mx-auto d-block w-100 h-100"
                }
              />
              <span className="sidenav__avatar--owner__camera">
                <i className="fas fa-camera"></i>
              </span>
            </div>
            <p className="text-center text-white title mt-3">
              {this.props.profile.username}
            </p>
            {this.props.profile.editingDescription ? (
              <div className="px-5 mb-3">
                <form onSubmit={this.updateDescription}>
                  <div className="form-group">
                    <textarea
                      className="form-control"
                      id="description"
                      defaultValue={this.props.profile.description}
                      maxLength={150}
                    ></textarea>
                  </div>
                  <div className="form-group d-flex justify-content-end">
                    <button
                      className="btn btn-brand-secondary text-white mr-2 rounded-pill"
                      type="button"
                      onClick={this.props.toggleEditingDescription}
                    >
                      Отмена
                    </button>
                    <button className="btn btn-brand text-white rounded-pill">
                      Изменить статус
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <p className="text-left text-white text-wrap description px-5 mb-0 fs-5 textDescription">
                {this.props.profile.description ||
                  "У пользователя нет статуса!"}
              </p>
            )}
            {this.props.ownsProfile && !this.props.profile.editingDescription && (
              <a
                className="text-left btn-link text-brand-secondary btn px-5"
                onClick={this.props.toggleEditingDescription}
              >
                Изменить статус <i className="fas fa-pencil-alt"></i>
              </a>
            )}
            <div className="d-flex flex-column justify-content-between h-100">
              <div className="d-flex justify-content-between px-5">
                <div>
                  <p className="text-white mb-0">
                    {this.props.profile.posts} Posts
                  </p>
                </div>
                <div>
                  <p className="text-white mb-0">
                    {this.props.profile.likes} Likes
                  </p>
                </div>
              </div>
              <div className="text" onClick={()=>this.clickMessages(false)}>
                {!this.props.ownsProfile && this.props.logged.username && (
                  <p className="text-white mb-0">Отправить личное сообщение</p>
                )}
                {this.props.ownsProfile && (
                  <p className="text-white mb-0">Полученные сообщения {this.state.notification && <span className="notification">!</span>}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <BottomScrollListener
          onBottom={() => {
            this.setState(() => ({ ...this.state }));
            this.fetchUserPosts();
          }}
        >
          {(scrollRef) => (
            <div
              className="d-flex position-relative profile__body justify-content-center flex-wrap"
              ref={scrollRef}
            >
              <Auth>
                {this.props.profile.openProfile || this.props.ownsProfile ? (
                  <div className="profile__body__textarea w-100 mt-5">
                    <div className="card border-0">
                      <div className="card-body">
                        <NewPostForm profileId={this.props.match.params.id} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="mt-5">
                    <i className="fas fa-lock"></i> Пользователь запретил оставлять посты на своей стене
                  </p>
                )}
              </Auth>
              <div className="profile__body__posts w-100">
                <div className="d-flex flex-column">
                  {this.props.posts.map((post, i) => (
                    <Post {...post} key={post.message + "_" + i} />
                  ))}
                  {this.props.postsLoading && (
                    <div className="d-flex justify-content-center">
                      <Loading classes="my-5" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </BottomScrollListener>
        {this.state.openDialogsModal && (
          <div className="dialogsModal">
            <div onClick={this.closeDialogsModal} className="close">
              &#10006;
            </div>

            {this.props.ownsProfile && (
              <div className="profile__body__posts w-100">
                <div className="d-flex flex-column">
                  {this.props.messages.filter(m=>m.author.username!==this.props.profile.username).map((message, i) => (
                    
                    <Message {...message} key={message.message + "_" + i} />
                  ))}
                  {this.props.messagesLoading && (
                    <div className="d-flex justify-content-center">
                      <Loading classes="my-5" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {!this.props.ownsProfile && (
              <div className="profile__body__textarea w-100 mt-5">
                <div className="card border-0">
                  <div className="card-body">
                    <NewMessageForm profileId={this.props.match.params.id} closeDialogsModal={this.closeDialogsModal} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

const stateToProps = (state) => ({
  logged: state.app.logged,
  ownsProfile: state.profile.ownProfile,
  profilePicModal: state.app.profilePicModal.isVisible,
  profile: state.profile,
  posts: state.posts.items,
  messages: state.messages.items,
  postsLoading: state.posts.loading,
  messagesLoading: state.messages.loading,
});

const dispatchToProps = (dispatch) => ({
  changeDescription: (description) => dispatch(changeDescription(description)),
  toggleNavbar: (value) => dispatch(toggleNavbar(value)),
  toggleProfilePictureModal: () => dispatch(toggleProfilePictureModal()),
  toggleSidenav: () => dispatch(toggleSidenav()),
  fetchProfile: (value) => dispatch(fetchProfile(value)),
  newPost: (value) => dispatch(newPost(value)),
  fetchUserPosts: (value) => dispatch(fetchUserPosts(value)),
  fetchUserMessages: (value) => dispatch(fetchUserMessages(value)),
  restartState: () => dispatch(restartState()),
  toggleEditingDescription: () => dispatch(toggleEditingDescription()),
  restartStatePosts: () => dispatch(restartStatePosts()),
  logout: () => dispatch(logout()),
});

export default connect(stateToProps, dispatchToProps)(Profile);
