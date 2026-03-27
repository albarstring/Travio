import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export default function QuillEditor({ value, onChange, onReady, placeholder = '', height = '420px' }) {
  const containerRef = useRef(null);
  const quillRef = useRef(null);
  const isInitializing = useRef(false);
  const onChangeRef = useRef(onChange);
  const onReadyRef = useRef(onReady);
  const placeholderRef = useRef(placeholder);
  const initialValueRef = useRef(value);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    placeholderRef.current = placeholder;
  }, [placeholder]);

  useEffect(() => {
    if (!containerRef.current || isInitializing.current) return;

    isInitializing.current = true;

    // Initialize Quill instance
    quillRef.current = new Quill(containerRef.current, {
      theme: 'snow',
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'blockquote'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ header: 2 }, { header: 3 }],
          ['link', 'code-block'],
          ['clean'],
        ],
      },
    });

    if (typeof onReadyRef.current === 'function') {
      onReadyRef.current(quillRef.current);
    }

    // Set initial content
    if (initialValueRef.current) {
      quillRef.current.root.innerHTML = initialValueRef.current;
    }

    // Listen to text changes
    const handleChange = () => {
      const html = quillRef.current.root.innerHTML;
      if (typeof onChangeRef.current === 'function') {
        onChangeRef.current(html);
      }
    };

    quillRef.current.on('text-change', handleChange);

    return () => {
      if (quillRef.current) {
        quillRef.current.off('text-change', handleChange);
      }
    };
  }, []);

  // Update content when value prop changes externally (e.g., when loading a post)
  useEffect(() => {
    if (quillRef.current && value !== undefined) {
      const currentContent = quillRef.current.root.innerHTML;
      if (currentContent !== value) {
        quillRef.current.root.innerHTML = value;
      }
    }
  }, [value]);

  return (
    <div
      ref={containerRef}
      style={{
        height: height,
        display: 'flex',
        flexDirection: 'column',
      }}
    />
  );
}
