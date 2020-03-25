const decode = require('jwt-decode');

export default {
    // State stores jwtToken in local storeage
    state: {
        authStatus: false,
        token: '',
        user: null,
        api_url: '',
        serverUrl: '',
    },
    mutations: {
        setUrl(state, apiUrl) {
            state.api_url = apiUrl;
        },
        setServerUrl(state, serverUrl) {
            state.serverUrl = serverUrl;
        },
        setToken(state, token) {
            state.token = token;
        },
        setUser(state, user) {
            state.user = user;
        },
        logout(state) {
            state.user = null;
            state.token = null;
        },
    },
    getters: {
        isLoggedIn(state) {
            return !!state.token;
        },
        getToken(state) {
            return state.token;
        },
        apiUrl(state) {
            return state.api_url;
        },
        serverUrl(state) {
            return state.serverUrl;
        },
        getUser(state) {
            return state.user;
        },
    },
    actions: {
        login({ commit, state }, userdata) {
            return new Promise((resolve, reject) => {
                // Store the base URL of the API for future use.
                localStorage.setItem('api', state.api_url);
                localStorage.setItem('server', state.serverUrl);

                this._vm.$axios.defaults.baseURL = state.api_url;

                const apiUrl = new window.URL('/api/auth/login', state.api_url);

                this._vm.$axios({
                    method: 'post',
                    url: apiUrl,
                    data: userdata,
                }).then((res) => {
                    const { data } = res.data;
                    const user = decode(data.token);

                    // Store the token to local storage
                    localStorage.setItem('authToken', data.token);

                    // Set authentication headers for future requests
                    this._vm.$axios.defaults.headers.common.Authorization = `Bearer ${data.token}`;
                    // set states token and user
                    commit('setToken', data.token);
                    commit('setUser', user);
                    resolve();
                }, (error) => {
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        reject(error.response);
                    } else if (error.request) {
                        // The request was made but no response was received
                        reject(error.request);
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        reject(error.message);
                    }
                }).catch((err) => {
                    localStorage.removeItem('authToken');
                    reject(err);
                });
            });
        },
        logout({ commit }) {
            return new Promise((resolve) => {
                commit('logout');
                localStorage.removeItem('authToken');
                localStorage.removeItem('api');
                localStorage.removeItem('server');
                delete this._vm.$axios.defaults.headers.common.Authorization;
                resolve();
            }).catch((err) => {
                return err;
            });
        },
        checkLogin({ getters, dispatch, commit }) {
            /**
             * Check whether user is logged in during each relogin.
             */
            return new Promise((resolve) => {
                const token = getters.getToken || localStorage.getItem('authToken');
                if (token) {
                    const user = decode(token);
                    const expiry = new Date() - new Date(user.exp * 1000);
                    if (expiry <= 0) {
                        this._vm.$axios.defaults.headers.common.Authorization = `Bearer ${token}`;
                        this._vm.$axios.defaults.baseURL = getters.apiUrl;
                        commit('setToken', token);
                        commit('setUser', user);
                        resolve({ status: 'authenticated' });
                    } else {
                        throw new Error('Login Again');
                    }
                } else {
                    throw new Error('Login Again');
                }
            }).catch(() => dispatch('logout'));
        },
        checkExp({ getters, dispatch, commit }) {
            return new Promise((resolve) => {
                const token = getters.getToken;
                const apiUrl = getters.apiUrl || localStorage.getItem('api');
                this._vm.$axios.defaults.baseURL = apiUrl;
                commit('setUrl', apiUrl);
                if (token) {
                    const user = decode(token);
                    const expiry = new Date() - new Date(user.exp * 1000);
                    if (expiry <= 0) {
                        resolve({ status: 'authenticated' });
                    } else {
                        throw new Error('Login Again');
                    }
                }
            }).catch(() => dispatch('logout'));
        },
    },
};
