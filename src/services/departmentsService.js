const { default: axios } = require("axios");

export const postNewDepartment = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_URL_API_ROOT}/departments`,
      data
    );
    return res;
  } catch (error) {
    throw error.response;
  }
};

export const putDepartment = async (data) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_URL_API_ROOT}/departments`,
      data
    );
    return res;
  } catch (error) {
    throw error.response;
  }
};
