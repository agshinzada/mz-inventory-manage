const { default: axios } = require("axios");

export const getEmployeesBySearch = async (value, searchMethod) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_URL_API_ROOT}/employees/search?q=${value}&&m=${searchMethod}`
    );
    return res.data;
  } catch (error) {
    throw error.response;
  }
};

export const getNumbersByEmployeeId = async (id) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_URL_API_ROOT}/employees/numbers/${id}`
    );
    return res.data;
  } catch (error) {
    throw error.response;
  }
};

export const removeEmployee = async (id) => {
  try {
    const res = await axios.delete(
      `${process.env.REACT_APP_URL_API_ROOT}/employees/${id}`
    );
    return res;
  } catch (error) {
    throw error.response;
  }
};

export const postNewEmployee = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_URL_API_ROOT}/employees`,
      data
    );
    return res.data;
  } catch (error) {
    throw error.response;
  }
};

export const postNewEmployeeNumber = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_URL_API_ROOT}/employees/numbers`,
      data
    );
    return res;
  } catch (error) {
    throw error.response;
  }
};

export const putEmployee = async (data) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_URL_API_ROOT}/employees`,
      data
    );
    return res;
  } catch (error) {
    throw error.response;
  }
};

export const putEmployeeNumber = async (data) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_URL_API_ROOT}/employees/numbers`,
      data
    );
    return res;
  } catch (error) {
    throw error.response;
  }
};
