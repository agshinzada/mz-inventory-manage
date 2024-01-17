const { default: axios } = require("axios");

export const postLogin = async (username, password) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_URL_API_ROOT}/login?u=${username}&&p=${password}`
    );
    return res.data;
  } catch (error) {
    throw error.response;
  }
};

export const postLoginActivity = async (id) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_URL_API_ROOT}/login/activity?id=${id}`
    );
    return res.data;
  } catch (error) {
    throw error.response;
  }
};

export const postLogout = async (activityId) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_URL_API_ROOT}/logout/activity?id=${activityId}`
    );
    return res;
  } catch (error) {
    throw error.response;
  }
};

export const putPassword = async (username, password) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_URL_API_ROOT}/users?u=${username}&&p=${password}`
    );
    return res;
  } catch (error) {
    throw error.response;
  }
};
