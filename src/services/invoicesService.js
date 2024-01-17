const { default: axios } = require("axios");

export const getInvoiceDocCodes = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_URL_API_ROOT}/items/invoices/codes`
    );
    return res.data;
  } catch (error) {
    throw error.response;
  }
};

export const getInvoiceWithNoPrice = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_URL_API_ROOT}/items/invoices/payment?status=0`
    );

    return res.data;
  } catch (error) {
    throw error.response;
  }
};

export const postNewInvoice = async (data) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_URL_API_ROOT}/items/invoices`,
      data
    );

    return res;
  } catch (error) {
    throw error.response;
  }
};

export const removeInvoice = async (id) => {
  try {
    const res = await axios.delete(
      `${process.env.REACT_APP_URL_API_ROOT}/items/invoices/${id}`
    );

    return res;
  } catch (error) {
    throw error.response;
  }
};

export const putInvoice = async (data) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_URL_API_ROOT}/items/invoices`,
      data
    );
    return res;
  } catch (error) {
    throw error.response;
  }
};
