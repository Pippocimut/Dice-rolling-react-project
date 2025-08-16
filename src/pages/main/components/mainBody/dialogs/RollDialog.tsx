const RollDialog = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-auto flex items-center justify-center">
      <div className=" rounded-lg p-8 bg-background border-2 border-borders max-w-md w-full mx-4 shadow-xl">
        <div className="flex flex-row w-full justify-end items-center mb-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700  text-right"
          >
            ✕
          </button>
        </div>
        <div className="dialog-content">{children}</div>
      </div>
    </div>
  );
};

export default RollDialog;
