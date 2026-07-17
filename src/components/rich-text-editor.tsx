"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useCallback } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        allowBase64: true,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const addImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file || !editor) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        editor.chain().focus().setImage({ src: base64 }).run();
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="rounded-lg border border-border bg-surface overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border-b border-border bg-surface-2 p-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive("bold")
              ? "bg-accent text-accent-fg"
              : "hover:bg-surface text-fg-2 hover:text-fg"
          }`}
        >
          <strong>B</strong>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive("italic")
              ? "bg-accent text-accent-fg"
              : "hover:bg-surface text-fg-2 hover:text-fg"
          }`}
        >
          <em>I</em>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive("strike")
              ? "bg-accent text-accent-fg"
              : "hover:bg-surface text-fg-2 hover:text-fg"
          }`}
        >
          <s>S</s>
        </button>

        <div className="w-px bg-border" />

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive("heading", { level: 1 })
              ? "bg-accent text-accent-fg"
              : "hover:bg-surface text-fg-2 hover:text-fg"
          }`}
        >
          H1
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive("heading", { level: 2 })
              ? "bg-accent text-accent-fg"
              : "hover:bg-surface text-fg-2 hover:text-fg"
          }`}
        >
          H2
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive("bulletList")
              ? "bg-accent text-accent-fg"
              : "hover:bg-surface text-fg-2 hover:text-fg"
          }`}
        >
          • List
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive("orderedList")
              ? "bg-accent text-accent-fg"
              : "hover:bg-surface text-fg-2 hover:text-fg"
          }`}
        >
          1. List
        </button>

        <div className="w-px bg-border" />

        <button
          onClick={addImage}
          className="px-2 py-1 rounded text-sm font-medium hover:bg-surface text-fg-2 hover:text-fg transition-colors"
          title="Ajouter une image"
        >
          🖼️ Image
        </button>

        <button
          onClick={() => editor.chain().focus().clearNodes().run()}
          className="px-2 py-1 rounded text-sm font-medium hover:bg-surface text-fg-2 hover:text-fg transition-colors ml-auto"
        >
          Clear
        </button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="prose prose-invert max-w-none p-4 min-h-64 focus:outline-none [&_.ProseMirror]:focus:outline-none"
      />

      {/* Info */}
      <div className="border-t border-border bg-surface-2 px-4 py-2 text-xs text-muted">
        Formatage supporté : gras, italique, titres, listes, images en base64
      </div>
    </div>
  );
}
