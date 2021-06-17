import axios from 'axios';
import cogoToast from 'cogo-toast';
import api from '../api/api';
import {ls} from "./../assets/_localStorage";

const API = new api();

export const
				FETCH_USER_MESSAGES = '[MESSAGE] FETCH_USER_MESSAGES',
				NEW_MESSAGE = '[MESSAGE] NEW_MESSAGE',
				SET_LOADING = '[MESSAGE] SET_LOADING',
				DELETE_MESSAGE = '[MESSAGE] DELETE_MESSAGE';

export const fetchUserMessages = (usernameMessage) => {
	return (dispatch, getState) => {
		const state = getState();
		const { offset, quantity, isThereMore, loading } = state.messages;
		const { username } = state.app.logged;

		if (isThereMore && !loading) {
			dispatch(setLoading(true))

			API.get(`user/${usernameMessage}/messages?offset=${offset}&quantity=${quantity}`)
				.then(res => {
					if (res.code == 200)
						dispatch({
							type: FETCH_USER_MESSAGES,
							payload: res.response.map(message => ({
								...message
							}))
						})
				})
				.catch(e => console.log(e))
				.then(() => dispatch(setLoading(false)));
		} 
	}
}


export const newMessage = (data) => {
	return (dispatch, getState) => {
		const state = getState();
		const { username: profile } = state.profile;
		const { username, message } = data;

		API.post(`user/${username}/new/message`, { ...data })
			.then(res => {
				if(res.code == 200){
					ls.remove("read")
					cogoToast.success(`Сообщение отправлено`, {
					    position: 'bottom-right'
					});

					if(username == profile) {
						dispatch({
							type: NEW_MESSAGE,
							payload: {
								newMessage: res.response
							}
						})
					}
				}
			})
			.catch(e => {
				cogoToast.error(`There were an error submitting your post.`, {
				    position: 'bottom-right'
				});
			});
	}
}


export const deleteMessage = (data) => {
	return dispatch => {
		const { messageId } = data;
		API.delete(`message/${messageId}`)
			.then(res => {
				cogoToast.warn(`Сообщение удалено`, {
				    position: 'bottom-right'
				});
				dispatch({
					type: DELETE_MESSAGE,
					payload: {
						...res
					}
				})
			})
			.catch(e => console.log(e));
	}
}

export const setLoading = loading => {
	return dispatch => dispatch({
		type: SET_LOADING,
		payload: {
			loading
		}
	})
}

