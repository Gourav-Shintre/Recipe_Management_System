import React from "react";
import "./ConfirmationDialog.css";
import { MdDelete } from "react-icons/md";
interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirmation-dialog">
      <div className="dialog-content">
        <div style={{ justifyContent: "center" }}>
          <MdDelete size={100} color="red" />
        </div>
        <p>Are you sure to delete this recipe?</p>
        <button onClick={onConfirm} className="button-yes">
          Yes
        </button>
        <button onClick={onClose} className="button-no">
          No
        </button>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
