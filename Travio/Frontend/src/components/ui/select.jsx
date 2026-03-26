import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';

function Select({ ...props }) {
  return <SelectPrimitive.Root {...props} />;
}

function SelectGroup({ ...props }) {
  return <SelectPrimitive.Group {...props} />;
}

function SelectValue({ ...props }) {
  return <SelectPrimitive.Value {...props} />;
}

function SelectTrigger({ className = '', children, ...props }) {
  return (
    <SelectPrimitive.Trigger
      className={`flex h-10 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-offset-white placeholder:text-gray-400 focus:ring-2 focus:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon className="text-gray-500">▼</SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({ className = '', children, position = 'popper', ...props }) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={`relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-lg border border-gray-200 bg-white text-gray-700 shadow-md ${className}`}
        position={position}
        {...props}
      >
        <SelectPrimitive.Viewport className="p-1">
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({ className = '', ...props }) {
  return (
    <SelectPrimitive.Label
      className={`px-2 py-1.5 text-xs font-semibold text-gray-500 ${className}`}
      {...props}
    />
  );
}

function SelectItem({ className = '', children, ...props }) {
  return (
    <SelectPrimitive.Item
      className={`relative flex w-full cursor-pointer select-none items-center rounded-md py-2 pl-8 pr-2 text-sm text-gray-700 outline-none focus:bg-gray-100 data-[state=checked]:bg-gray-100 ${className}`}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center text-xs text-gray-700">
        <SelectPrimitive.ItemIndicator>✓</SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
};
