import { Minus, Plus } from "lucide-react";

const QuantityStepper = ({
  quantity,
  setQuantity,
  min = 1,
  max,
  disabled = false,
}) => {
  const decrease = () => {
    setQuantity((prev) => Math.max(min, prev - 1));
  };

  const increase = () => {
    setQuantity((prev) => Math.min(max, prev + 1));
  };

  return (
    <div className="flex items-center bg-slate-100 rounded-2xl p-1 border border-slate-200 shrink-0">
      <button
        type="button"
        onClick={decrease}
        disabled={quantity <= min || disabled}
        className="w-10 h-10 rounded-xl bg-white text-slate-700 hover:bg-sky-50 disabled:opacity-40 flex items-center justify-center shadow-sm"
      >
        <Minus className="w-4 h-4" />
      </button>

      <span className="w-12 text-center font-black text-base text-slate-800">
        {quantity}
      </span>

      <button
        type="button"
        onClick={increase}
        disabled={quantity >= max || disabled}
        className="w-10 h-10 rounded-xl bg-white text-slate-700 hover:bg-sky-50 disabled:opacity-40 flex items-center justify-center shadow-sm"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};

export default QuantityStepper;