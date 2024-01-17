const { default: axios } = require("axios");

export const postNewType = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_URL_API_ROOT}/items/types`,
      data
    );
    return res;
  } catch (error) {
    throw error.response;
  }
};

export const putType = async (data) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_URL_API_ROOT}/items/types`,
      data
    );
    return res;
  } catch (error) {
    throw error.response;
  }
};
