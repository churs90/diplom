import {
  DISCOVER_USERS,
  SET_LOADING,
  RESTART_STATE,
  DELETE_USER,
  FILTER_USERS
} from "../actions/users";
const defaultState = {
  loading: false,
  items: [],
  filterItems: []
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case DISCOVER_USERS:
      return {
        ...state,
        items: action.payload.map((user) => ({
          ...user,
          profilePic: user.profilePic,
        })),
        filterItems: action.payload.map((user) => ({
          ...user,
          profilePic: user.profilePic,
        }))
      };
    case FILTER_USERS:
      if (!action.searchText) {
        return {
          ...state,
          filterItems: state.items.map((user) => ({
            ...user,
            profilePic: user.profilePic,
          }))
        };
      }
      return {
        ...state,
        filterItems: state.items.filter(
          (u) =>
            u.username === action.searchText
        ).map((user) => ({
          ...user,
          profilePic: user.profilePic,
        }))
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload.loading,
      };
    case DELETE_USER:
      return {
        ...state,
        items: state.items.filter(
          (user) => user._id != action.payload.deletedUser._id
        ),
        filterItems: state.filterItems.filter(
          (user) => user._id != action.payload.deletedUser._id
        ),
      };
    case RESTART_STATE:
      return defaultState;
    default:
      return state;
  }
};
