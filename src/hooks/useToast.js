import toast from 'react-hot-toast';

export const useToast = () => {
  const showSuccess = (message) => {
    toast.success(message, {
      duration: 3000,
    });
  };

  const showError = (message) => {
    toast.error(message, {
      duration: 4000,
    });
  };

  const showLoading = (message) => {
    return toast.loading(message);
  };

  const updateToast = (toastId, type, message) => {
    toast.custom((t) => (
      <div
        className={`px-4 py-3 rounded-lg shadow-lg text-white ${
          type === 'success'
            ? 'bg-green-500'
            : type === 'error'
            ? 'bg-red-500'
            : 'bg-blue-500'
        }`}
      >
        {message}
      </div>
    ));
  };

  return { showSuccess, showError, showLoading, updateToast };
};
