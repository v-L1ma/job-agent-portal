import { toast } from "sonner";
import { CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

export const showSuccess = (
  message: string,
  description?: string,
) =>
  toast.success(message, {
    description,
    descriptionClassName: "success-description",
    icon: <CheckCircle className="size-4" />,
    style: {
      background: 'green',
      color: '#fff',
      gap: 10,
      border: 'none',
    },
  });

export const showError = (
  message: string,
  description?: string,
) =>
  toast.error(message, {
    description,
    descriptionClassName: "error-description",
    icon: <AlertCircle className="size-6"/>,
    style: {
      background: '#ef4444',
      color: '#fff',
      gap: 10,
      border: 'none',
    },
  });

export const showWarning = (
  message: string,
  description?: string,
) =>
  toast.warning(message, {
    description,
    descriptionClassName: "warning-description",
    icon: <AlertTriangle className="size-4" />,
    style: {
      background: 'orange',
      color: '#451a03',
      gap: 10,
      border: 'none',
    },
  });

export const showInfo = (
  message: string,
  description?: string,
) =>
  toast.info(message, {
    description,
    descriptionClassName: "info-description",
    icon: <Info className="size-4" />,
    style: {
      color: 'black',
      gap: 10,
      border: 'none',
    },
  });
