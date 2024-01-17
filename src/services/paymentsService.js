const { default: axios } = require("axios");

export const getFichesByMonth = async (id) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_URL_API_ROOT}/items/payments/fiches/monthly?locId=${id}`
    );
    return res.data;
  } catch (error) {
    throw error.response;
  }
};

export const getTotalAmountByMonth = async (month, locId) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_URL_API_ROOT}/items/payments/fiches/amount?month=${month}&locId=${locId}`
    );
    return res.data;
  } catch (error) {
    throw error.response;
  }
};

export const getLastFicheCode = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_URL_API_ROOT}/items/payments/fiches/code/last`
    );
    return res.data;
  } catch (error) {
    throw error.response;
  }
};

export const getFichesByStatus = async (param) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_URL_API_ROOT}/items/payments/fiches/status?q=${param}`
    );
    return res.data;
  } catch (error) {
    throw error.response;
  }
};

export const getPaymentsBySearch = async (value) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_URL_API_ROOT}/items/payments/search?q=${value}`
    );
    return res.data;
  } catch (error) {
    throw error.response;
  }
};

export const getFichesBySearch = async (value) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_URL_API_ROOT}/items/payments/fiches/search?q=${value}`
    );
    return res.data;
  } catch (error) {
    throw error.response;
  }
};

export const postNewPayment = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_URL_API_ROOT}/items/payments`,
      data
    );
    return res;
  } catch (error) {
    throw error.response;
  }
};

export const getPaymentsByDateRange = async (from, to) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_URL_API_ROOT}/items/payments/filter?f=${from}&&t=${to}`
    );
    return res.data;
  } catch (error) {
    throw error.response;
  }
};

export const getFichesByDateRange = async (from, to) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_URL_API_ROOT}/items/payments/fiches/filter?f=${from}&&t=${to}`
    );
    return res.data;
  } catch (error) {
    throw error.response;
  }
};

export const getPaymentsByFicheId = async (id) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_URL_API_ROOT}/items/payments/fiches/${id}`
    );
    return res.data;
  } catch (error) {
    throw error.response;
  }
};

export const removeFiche = async (id) => {
  try {
    const res = await axios.delete(
      `${process.env.REACT_APP_URL_API_ROOT}/items/payments/fiches/${id}`
    );
    return res;
  } catch (error) {
    throw error.response;
  }
};

export const removePayment = async (id) => {
  try {
    const res = await axios.delete(
      `${process.env.REACT_APP_URL_API_ROOT}/items/payments/${id}`
    );
    return res;
  } catch (error) {
    throw error.response;
  }
};

export const changeFicheLockStatus = async (param, ficheId) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_URL_API_ROOT}/items/payments/fiches/lock?status=${param}&ficheId=${ficheId}`
    );
    return res;
  } catch (error) {
    throw error.response;
  }
};

export const changePaymentLockStatus = async (param, ficheId) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_URL_API_ROOT}/items/payments/lock?status=${param}&paymentId=${ficheId}`
    );
    return res;
  } catch (error) {
    throw error.response;
  }
};

export const postNewFiche = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_URL_API_ROOT}/items/payments/fiches`,
      data
    );
    return res.data;
  } catch (error) {
    throw error.response;
  }
};

export const postPaymentsBulk = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_URL_API_ROOT}/items/payments/bulk`,
      data
    );
    return res;
  } catch (error) {
    throw error.response;
  }
};

export const putPaymentsBulk = async (data) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_URL_API_ROOT}/items/payments/bulk`,
      data
    );
    return res;
  } catch (error) {
    throw error.response;
  }
};

export const putFicheStatus = async (data) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_URL_API_ROOT}/items/payments/fiches/status`,
      data
    );
    return res;
  } catch (error) {
    throw error.response;
  }
};
