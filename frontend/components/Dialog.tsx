"use client";

type Props = {
    open: boolean;
    onClose: () => void; //whoever uses this component must pass a prop called onclose, and it has to be a function that takes zero arguments and returns nothing
    title: string;
    message: string;
}

function Dialog({ open, onClose, title, message }: Props) {
    if (!open) return null;
    
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
            <div className="bg-white p-6 rounded-md shadow-lg">
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-gray-600">{message}</p>
            </div>
        </div>
    );
}

export default Dialog;