import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, children, title }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div className="bg-white/90 rounded-xl shadow-lg w-full max-w-md mx-4 z-10 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                {title || "Edit Category"}
              </h3>
              <button
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                onClick={onClose}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
