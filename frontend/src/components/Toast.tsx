import { Check, Loader2, X } from "lucide-react";
import { ToastBar, Toaster } from "react-hot-toast";

export const transactionToast = {
  loading: "Waiting for the transaction to be executed",
  success: "Your transaction has been executed",
  error: "Your transaction has failed",
};

export default function Toast() {
  return (
    <Toaster
      toastOptions={{
        style: {
          backgroundColor: "#DEDEDE",
          borderRadius: 4,
          padding: "8px 20px",
        },
        loading: {
          icon: <Loader2 size={32} className="animate-spin" />,
        },
        success: {
          duration: 4000,
          icon: <Check size={32} />,
        },
        error: {
          duration: 4000,
          icon: <X size={32} />,
        },
      }}
    >
      {(t) => (
        <ToastBar toast={t} style={{ maxWidth: 500 }}>
          {({ icon, message }) => (
            <div className="flex flex-row items-center gap-2">
              {icon}
              <span className="font-sans text-base text-gray-900">
                {message}
              </span>
            </div>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
}
