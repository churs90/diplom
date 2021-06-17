import axios from "axios";
import cogoToast from "cogo-toast";
import api from "../api/api";

const API = new api();

export const DISCOVER_USERS = "DISCOVER_USERS",
  RESTART_STATE = "RESTART_STATE",
  SET_LOADING = "SET_LOADING",
  DELETE_USER = "DELETE_USER",
  FILTER_USERS = "FILTER_USERS";

export const discoverUsers = (username) => {
  return (dispatch, getState) => {
    const state = getState();

    dispatch(setLoading(true));

    API.get("discover/users")
      .then((res) => {
        if (res.code == 200)
          dispatch({
            type: DISCOVER_USERS,
            payload: res.response,
          });

        dispatch(setLoading(false));
      })
      .catch((e) => console.log(e));
  };
};

export const filterUsers = (searchText) => {
  return {
      type: FILTER_USERS,
      searchText
  }
};

export const deleteUser = (userId) => {
  return (dispatch, getState) => {
    const state = getState();
    dispatch(setLoading(true));

    API.delete(`user/${userId}`).then((res) => {
      dispatch(setLoading(false));
      cogoToast.warn(`Пользователь удалён`, {
        position: "bottom-right",
      });
      dispatch({
        type: DELETE_USER,
        payload: {
          ...res,
        },
      });
    });
  };
};

export const setLoading = (loading) => {
  return (dispatch) =>
    dispatch({
      type: SET_LOADING,
      payload: {
        loading,
      },
    });
};

export const restartState = (data) => {
  return (dispatch) =>
    dispatch({
      type: RESTART_STATE,
    });
};
