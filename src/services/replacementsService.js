const { default: axios } = require("axios");

export const getReplacementsBySearch = async (param) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_URL_API_ROOT}/items/replacements/search?q=${param}`
    );
    return res.data;
  } catch (error) {
    throw error.response;
  }
};

export const getReplacementsByDateRange = async (from, to) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_URL_API_ROOT}/items/replacements/filter?f=${from}&&t=${to}`
    );
    return res.data;
  } catch (error) {
    throw error.response;
  }
};

export const postNewReplacement = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_URL_API_ROOT}/items/replacements`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res;
  } catch (error) {
    throw error.response;
  }
};
export const putReplacement = async (data) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_URL_API_ROOT}/items/replacements`,
      data
    );
    return res;
  } catch (error) {
    throw error.response;
  }
};

export const removeReplacement = async (id) => {
  try {
    const res = await axios.delete(
      `${process.env.REACT_APP_URL_API_ROOT}/items/replacements/${id}`
    );
    return res;
  } catch (error) {
    throw error.response;
  }
};
