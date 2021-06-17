import React, { Component } from "react";
import { connect } from "react-redux";
import BottomScrollListener from "react-bottom-scroll-listener";

import {
  restartState as restartStatePosts,
} from "../actions/posts";
import {
  discoverUsers,
  deleteUser,
  restartState as restartStateUsers,
} from "../actions/users";
import UserCard from "../components/UserCard";
import Loading from "../components/Loading";
import SearchContainer from "../components/SearchContainer";


class Explore extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: "",
      userId: null,
      showPopup: false,
      searchValue: this.props.searchValue,
    };
  }

  setShowFilterUsers = (flag) => {
    this.props.setShowFilterUsers(flag)
  };

  setuserId = (userName, userId) => {
    this.setState({
      userName,
      userId,
    });
  };

  setPopapViev = (popapViev) => {
    this.setState({
      showPopup: popapViev,
    });
  };

  deleteUser = () => {
    this.props.deleteUser(this.state.userId);
    this.setPopapViev(false);
  };

  componentDidMount() {
    this.props.discoverUsers();
  }

  componentWillUnmount() {
    this.props.restartState();
  }

  render() {
    return (
      <BottomScrollListener
        onBottom={() => {
          this.setState(() => ({ ...this.state }));
          alert("aaaaa");
        }}
      >
        {(scrollRef) => (
          <div className="usersWrapper" ref={scrollRef}>
            <h2 className="montserrat">Пользователи соц сети</h2>
            <SearchContainer setShowFilterUsers={this.setShowFilterUsers}/>
            <div className="users">
              {this.props.usersLoading && (
                <div className="d-flex justify-content-center m-auto">
                  <Loading />
                </div>
              )}
              {/* {!this.props.showFilterUsers &&
                this.props.users
                  .filter((u) => {
                    u.username === this.state.searchValue;
                  })
                  .map((user) => (
                    <div
                      className={"mx-3 mx-md-5 px-md-5 animated fadeIn"}
                      key={user._id}
                    >
                      <UserCard
                        {...user}
                        setuserId={this.setuserId}
                        setPopapViev={this.setPopapViev}
                      />
                    </div>
                  ))} */}

              {
                this.props.filterUsers.map((user) => (
                  <div
                    className={"mx-3 mx-md-5 px-md-5 animated fadeIn"}
                    key={user._id}
                  >
                    <UserCard
                      {...user}
                      setuserId={this.setuserId}
                      setPopapViev={this.setPopapViev}
                    />
                  </div>
                ))}
            </div>

            {this.state.showPopup && <div className="bg"></div>}

            {this.state.showPopup && (
              <div className="popup">
                <div
                  onClick={() => this.setPopapViev(false)}
                  className="closePopap"
                >
                  &#10006;
                </div>
                <p>Удалить пользователя {this.state.userName} ?</p>
                <div className="flexWrapper">
                  <button onClick={this.deleteUser}>Удалить</button>
                  <button onClick={() => this.setPopapViev(false)}>
                    Отмена
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </BottomScrollListener>
    );
  }
}

const stateToProps = (state) => ({
  users: state.users.items,
  filterUsers: state.users.filterItems,
  usersLoading: state.users.loading
});

const dispatchToProps = (dispatch) => ({
  discoverUsers: () => dispatch(discoverUsers()),
  restartState: () => {
    dispatch(restartStatePosts());
    dispatch(restartStateUsers());
  },
  deleteUser: (userId) => dispatch(deleteUser(userId)),
});

export default connect(stateToProps, dispatchToProps)(Explore);
