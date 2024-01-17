import toast from "react-hot-toast";

const notifySuccess = (title) => {
  toast.success(title);
};
const notifyError = (title) => {
  toast.error(title);
};

export { notifySuccess, notifyError };
