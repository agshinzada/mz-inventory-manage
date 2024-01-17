const { default: axios } = require("axios");

export const getItemsBySearch = async (data) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_URL_API_ROOT}/items/search?q=${data}`
    );
    return res.data;
  } catch (error) {
    throw error.response;
  }
};

export const getItemsByDepartment = async (depId, locId) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_URL_API_ROOT}/items/departments?depId=${depId}&locId=${locId}`
    );
    return res.data;
  } catch (error) {
    throw error.response;
  }
};

export const getNewItems = async (locId) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_URL_API_ROOT}/items/new?locId=${locId}`
    );
    return res.data;
  } catch (error) {
    throw error.response;
  }
};

export const getItemsByDateRange = async (typeId, departmentId) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_URL_API_ROOT}/items/filter?t=${typeId}&d=${departmentId}`
    );
    return res.data;
  } catch (error) {
    throw error.response;
  }
};

export const changeItemStatus = async (id) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_URL_API_ROOT}/items/deactive/${id}`
    );
    return res;
  } catch (error) {
    throw error.response;
  }
};

export const getItemLastCode = async (param) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_URL_API_ROOT}/items/lastcode?status=${param}`
    );

    return res.data;
  } catch (error) {
    throw error.response;
  }
};

export const postNewItem = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_URL_API_ROOT}/items`,
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

export const putItem = async (data) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_URL_API_ROOT}/items`,
      data
    );
    return res;
  } catch (error) {
    throw error.response;
  }
};
