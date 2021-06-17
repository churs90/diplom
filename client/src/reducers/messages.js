import {
  DELETE_MESSAGE,
  NEW_MESSAGE,
  SET_LOADING,
  FETCH_USER_MESSAGES

} from "../actions/messages";
import store from "../store";

const defaultState = {
  loading: false,
  isThereMore: true,
  offset: 0,
  quantity: 5,
  items: [],
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_USER_MESSAGES:
      return {
        ...state,
        isThereMore: !!action.payload.length,
        offset: state.offset + state.quantity,
        items: [
          ...state.items,
          ...action.payload.map((message) => ({
            ...message,
            author: {
              ...message.author,
            },
          })),
        ],
      };
    case NEW_MESSAGE:
      return {
        ...state,
        items: [
          {
            ...action.payload.newMessage,
            author: {
              ...action.payload.newMessage.author,
            },
          },
          ...state.items,
        ],
      };
    case DELETE_MESSAGE:
      return {
        ...state,
        items: state.items.filter(
          (message) => message._id != action.payload.deletedMessage._id
        ),
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload.loading,
      };
    default:
      return state;
  }
};
