function Table({ className = '', ...props }) {
  return (
    <div className="relative w-full overflow-auto rounded-xl border border-gray-200 shadow-sm">
      <table className={`w-full caption-bottom text-sm ${className}`} {...props} />
    </div>
  );
}

function TableHeader({ className = '', ...props }) {
  return <thead className={`text-gray-500 uppercase text-[11px] tracking-wide ${className}`} {...props} />;
}

function TableBody({ className = '', ...props }) {
  return <tbody className={`divide-y divide-gray-100 ${className}`} {...props} />;
}

function TableFooter({ className = '', ...props }) {
  return <tfoot className={`border-t border-gray-100 font-medium ${className}`} {...props} />;
}

function TableRow({ className = '', ...props }) {
  return <tr className={`transition-shadow hover:shadow-[inset_0_0_0_1px_rgba(168,223,52,0.6)] ${className}`} {...props} />;
}

function TableHead({ className = '', ...props }) {
  return <th className={`h-12 px-6 py-3 text-left font-semibold ${className}`} {...props} />;
}

function TableCell({ className = '', ...props }) {
  return <td className={`px-6 py-3.5 align-middle text-[13px] leading-relaxed ${className}`} {...props} />;
}

function TableCaption({ className = '', ...props }) {
  return <caption className={`mt-4 text-sm text-gray-500 ${className}`} {...props} />;
}

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};
