function Table({ className = '', ...props }) {
  return (
    <div className="relative w-full overflow-auto">
      <table className={`w-full caption-bottom text-sm ${className}`} {...props} />
    </div>
  );
}

function TableHeader({ className = '', ...props }) {
  return <thead className={`bg-gray-50/60 text-gray-500 uppercase text-xs ${className}`} {...props} />;
}

function TableBody({ className = '', ...props }) {
  return <tbody className={`divide-y divide-gray-100 ${className}`} {...props} />;
}

function TableFooter({ className = '', ...props }) {
  return <tfoot className={`border-t border-gray-100 bg-gray-50 font-medium ${className}`} {...props} />;
}

function TableRow({ className = '', ...props }) {
  return <tr className={`transition hover:bg-gray-50 ${className}`} {...props} />;
}

function TableHead({ className = '', ...props }) {
  return <th className={`h-10 px-6 py-3 text-left font-semibold ${className}`} {...props} />;
}

function TableCell({ className = '', ...props }) {
  return <td className={`px-6 py-3 align-middle ${className}`} {...props} />;
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
