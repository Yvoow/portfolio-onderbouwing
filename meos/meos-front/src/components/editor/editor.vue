<script setup lang="ts">
import { ref, onMounted, inject } from 'vue';
import axios, { AxiosStatic } from 'axios'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import StarterKit from '@tiptap/starter-kit'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Blockquote from '@tiptap/extension-blockquote'
import Heading from '@tiptap/extension-heading'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import CodeBlock from '@tiptap/extension-code-block'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'

// New state variables for dropdown menus
const showHeadingMenu = ref(false);
const showMoreOptions = ref(false);

const api: AxiosStatic = inject('axios', axios)
const props = defineProps<{
  modelValue: string;
  readonly?: boolean;
}>();

const { t } = useI18n();
const store = useStore();
// Initialize currentStyle after t is available
const currentStyle = ref(t('Paragraph'));
const emit = defineEmits(['update:modelValue']);

const editor = useEditor({
  content: props.modelValue,
  editable: !props.readonly,
  extensions: [
    StarterKit,
    Document,
    Paragraph,
    Text,
    Blockquote,
    Heading,
    OrderedList,
    ListItem,
    CodeBlock,
    HorizontalRule,
    Table.configure({
      resizable: true,
    }),
    TableRow,
    TableCell,
    TableHeader,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Image.configure({
      inline: true,
      allowBase64: false,
      HTMLAttributes: {
        class: 'rounded overflow-hidden',
        style: 'border: 0.5px solid rgba(9, 30, 66, 0.14);box-shadow:0 0 0 2px var(--ds-border, #091E4224)'
      },
    }),
    Underline,
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl p-2 min-h-20 focus:outline-none',
    },
  },
  injectCSS: false,
  onUpdate({ editor }) {
    emit('update:modelValue', editor.getHTML());
    updateCurrentStyle();
  },
});


// Function to update the current text style display
function updateCurrentStyle() {
  if (!editor.value) return;

  if (editor.value.isActive('heading', { level: 1 })) {
    currentStyle.value = t('Heading 1');
  } else if (editor.value.isActive('heading', { level: 2 })) {
    currentStyle.value = t('Heading 2');
  } else if (editor.value.isActive('heading', { level: 3 })) {
    currentStyle.value = t('Heading 3');
  } else if (editor.value.isActive('heading', { level: 4 })) {
    currentStyle.value = t('Heading 4');
  } else if (editor.value.isActive('paragraph')) {
    currentStyle.value = t('Paragraph');
  }
}

async function imageHandler() {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();

  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;

    try {
      const url = await uploadImageToBlob(file);
      if (url) {
        editor.value.chain().focus().setImage({ src: url }).run();
      }
    } catch (error) {
      console.error(error);
    }
  };
}

async function uploadImageToBlob(file: File): Promise<string> {
  try {
    const response = await api.post('/uploadImage', {
      fileName: file.name,
      fileType: file.type,
    });

    var blob = new Blob([file], { type: file.type });

    await axios.put(response.data.uploadUrl, blob, {
      headers: {
        'Content-Type': file.type,
        'x-amz-acl': 'public-read',
      }
    });

    return response.data.fileUrl;
  } catch (error) {
    store.dispatch('notification/show', {
      type: 'error',
      message: t('Something went wrong while uploading image')
    });
    throw new Error('Failed to upload image');
  }
}

// Close menus when clicking outside
onMounted(() => {
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      showHeadingMenu.value = false;
      showMoreOptions.value = false;
    }
  });

  // Initialize the current style label
  if (editor.value) {
    updateCurrentStyle();

    // Also watch for selection changes to update style text
    editor.value.on('selectionUpdate', () => {
      updateCurrentStyle();
    });
  }
});
</script>

<template>
  <div class="w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700" >
    <div v-if="editor && !props.readonly" class="flex flex-wrap items-center gap-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2">
      <!-- Heading/Paragraph dropdown -->
      <div class="relative">
        <button
          @click="showHeadingMenu = !showHeadingMenu"
          class="flex items-center space-x-1 px-3 py-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <span class="text-base font-medium text-gray-700 dark:text-gray-300">{{ currentStyle }}</span>
          <i class="fas fa-chevron-down ml-1 text-gray-500"></i>
        </button>
        <div
          v-if="showHeadingMenu"
          class="absolute z-20 top-full left-0 mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 w-48"
        >
          <button
            @click="editor.chain().focus().setParagraph().run(); showHeadingMenu = false; currentStyle = t('Paragraph')"
            class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            :class="{ 'bg-primary/10 text-primary dark:bg-primary/20': editor.isActive('paragraph') }"
          >
            {{ t('Paragraph') }}
          </button>
          <button
            @click="editor.chain().focus().toggleHeading({ level: 1 }).run(); showHeadingMenu = false; currentStyle = t('Heading 1')"
            class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            :class="{ 'bg-primary/10 text-primary dark:bg-primary/20': editor.isActive('heading', { level: 1 }) }"
          >
            {{ t('Heading 1') }}
          </button>
          <button
            @click="editor.chain().focus().toggleHeading({ level: 2 }).run(); showHeadingMenu = false; currentStyle = t('Heading 2')"
            class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            :class="{ 'bg-primary/10 text-primary dark:bg-primary/20': editor.isActive('heading', { level: 2 }) }"
          >
            {{ t('Heading 2') }}
          </button>
          <button
            @click="editor.chain().focus().toggleHeading({ level: 3 }).run(); showHeadingMenu = false; currentStyle = t('Heading 3')"
            class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            :class="{ 'bg-primary/10 text-primary dark:bg-primary/20': editor.isActive('heading', { level: 3 }) }"
          >
            {{ t('Heading 3') }}
          </button>
          <button
            @click="editor.chain().focus().toggleHeading({ level: 4 }).run(); showHeadingMenu = false; currentStyle = t('Heading 4')"
            class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            :class="{ 'bg-primary/10 text-primary dark:bg-primary/20': editor.isActive('heading', { level: 4 }) }"
          >
            {{ t('Heading 4') }}
          </button>
        </div>
      </div>

      <div class="h-6 border-l border-gray-300 dark:border-gray-600 mx-1"></div>

      <!-- Text formatting buttons -->
      <div class="flex space-x-1">
        <button
          @click="editor.chain().focus().toggleBold().run()"
          class="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          :class="{ 'bg-primary/10 text-primary dark:bg-primary/20': editor.isActive('bold') }"
          title="Bold"
        >
          <i class="fas fa-bold"></i>
        </button>

        <button
          @click="editor.chain().focus().toggleItalic().run()"
          class="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          :class="{ 'bg-primary/10 text-primary dark:bg-primary/20': editor.isActive('italic') }"
          title="Italic"
        >
          <i class="fas fa-italic"></i>
        </button>

        <button
          @click="editor.chain().focus().toggleUnderline().run()"
          class="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          :class="{ 'bg-primary/10 text-primary dark:bg-primary/20': editor.isActive('underline') }"
          title="Underline"
        >
          <i class="fas fa-underline"></i>
        </button>
      </div>

      <div class="h-6 border-l border-gray-300 dark:border-gray-600 mx-1"></div>

      <!-- Media buttons -->
      <button
        @click="imageHandler()"
        class="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        title="Insert Image"
      >
        <i class="fas fa-image"></i>
      </button>

      <div class="h-6 border-l border-gray-300 dark:border-gray-600 mx-1"></div>

      <!-- Alignment buttons -->
      <div class="flex space-x-1">
        <button
          @click="editor.chain().focus().setTextAlign('left').run()"
          class="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          :class="{ 'bg-primary/10 text-primary dark:bg-primary/20': editor.isActive('textAlign', { left: true }) }"
          title="Align Left"
        >
          <i class="fas fa-align-left"></i>
        </button>

        <button
          @click="editor.chain().focus().setTextAlign('center').run()"
          class="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          :class="{ 'bg-primary/10 text-primary dark:bg-primary/20': editor.isActive('textAlign', { center: true }) }"
          title="Align Center"
        >
          <i class="fas fa-align-center"></i>
        </button>

        <button
          @click="editor.chain().focus().setTextAlign('right').run()"
          class="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          :class="{ 'bg-primary/10 text-primary dark:bg-primary/20': editor.isActive('textAlign', { right: true }) }"
          title="Align Right"
        >
          <i class="fas fa-align-right"></i>
        </button>
      </div>

      <!-- More options in a collapsed group -->
      <div class="relative ml-auto">
        <button
          @click="showMoreOptions = !showMoreOptions"
          class="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title="More Options"
        >
          <i class="fas fa-ellipsis-h"></i>
        </button>
        <div
          v-if="showMoreOptions"
          class="absolute z-20 top-full right-0 mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 p-2 w-56"
        >
          <div class="space-y-1">
            <button
              @click="editor.chain().focus().toggleBlockquote().run(); showMoreOptions = false"
              class="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors"
              :class="{ 'bg-primary/10 text-primary dark:bg-primary/20': editor.isActive('blockquote') }"
            >
              <i class="fas fa-quote-right mr-2"></i> {{ t('Blockquote') }}
            </button>

            <button
              @click="editor.chain().focus().setHorizontalRule().run(); showMoreOptions = false"
              class="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors"
            >
              <i class="fas fa-minus mr-2"></i> {{ t('Horizontal Rule') }}
            </button>

            <button
              @click="editor.chain().focus().toggleCodeBlock().run(); showMoreOptions = false"
              class="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors"
              :class="{ 'bg-primary/10 text-primary dark:bg-primary/20': editor.isActive('codeBlock') }"
            >
              <i class="fas fa-code mr-2"></i> {{ t('Code Block') }}
            </button>

            <div class="border-t border-gray-200 dark:border-gray-700 my-1 pt-1">
              <p class="px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{{ t('Table') }}</p>
              <button
                @click="editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run(); showMoreOptions = false"
                class="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors"
              >
                <i class="fas fa-table mr-2"></i> {{ t('Insert Table') }}
              </button>

              <button
                @click="editor.chain().focus().addColumnAfter().run(); showMoreOptions = false"
                class="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors"
              >
                <i class="fas fa-columns mr-2"></i> {{ t('Add Column') }}
              </button>

              <button
                @click="editor.chain().focus().addRowAfter().run(); showMoreOptions = false"
                class="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors"
              >
                <i class="fas fa-plus mr-2"></i> {{ t('Add Row') }}
              </button>

              <button
                @click="editor.chain().focus().deleteTable().run(); showMoreOptions = false"
                class="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors"
              >
                <i class="fas fa-trash mr-2"></i> {{ t('Delete Table') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-white dark:bg-gray-900 p-4 min-h-[400px]">
      <editor-content :editor="editor" />
    </div>
  </div>
</template>

<style>
h1 {
  font-size: 2em;
  font-weight: 600;
  margin-top: 1em;
  margin-bottom: 0.5em;
  color: #1f2937;
}

h2 {
  font-size: 1.5em;
  font-weight: 600;
  margin-top: 1em;
  margin-bottom: 0.5em;
  color: #1f2937;
}

h3 {
  font-size: 1.25em;
  font-weight: 600;
  margin-top: 1em;
  margin-bottom: 0.5em;
  color: #1f2937;
}

h4 {
  font-size: 1.125em;
  font-weight: 600;
  margin-top: 1em;
  margin-bottom: 0.5em;
  color: #1f2937;
}

p {
  font-size: 1em;
  margin-bottom: 0.75em;
  line-height: 1.5;
}

.dark h1, .dark h2, .dark h3, .dark h4 {
  color: #f3f4f6;
}

.dark p {
  color: #e5e7eb;
}

.tiptap {
  ul,
  ol {
    padding: 0 1rem;
    margin: 1.25rem 1rem 1.25rem 0.4rem;

    li p {
      margin-top: 0.25em;
      margin-bottom: 0.25em;
    }
  }

  blockquote {
    border-left: 3px solid #9ca3af;
    margin: 1.5rem 0;
    padding-left: 1rem;
    color: #4b5563;
  }

  .dark blockquote {
    color: #9ca3af;
  }

  pre {
    background: #1e293b;
    border-radius: 0.5rem;
    color: #e2e8f0;
    font-family: 'JetBrainsMono', monospace;
    margin: 1.5rem 0;
    padding: 0.75rem 1rem;

    code {
      background: none;
      color: inherit;
      font-size: 0.875rem;
      padding: 0;
    }
  }

  table {
    border-collapse: collapse;
    margin: 1.5rem 0;
    overflow: hidden;
    table-layout: fixed;
    width: 100%;
    border-radius: 0.375rem;
    border: 1px solid #e5e7eb;

    td,
    th {
      border: 1px solid #e5e7eb;
      box-sizing: border-box;
      min-width: 1em;
      padding: 0.5rem 0.75rem;
      position: relative;
      vertical-align: top;

      > * {
        margin-bottom: 0;
      }
    }

    th {
      background-color: #f9fafb;
      font-weight: 600;
      text-align: left;
      color: #111827;
    }

    .dark & {
      border-color: #374151;

      td, th {
        border-color: #374151;
      }

      th {
        background-color: #1f2937;
        color: #f9fafb;
      }
    }

    .selectedCell:after {
      background: rgba(59, 130, 246, 0.2);
      content: "";
      left: 0; right: 0; top: 0; bottom: 0;
      pointer-events: none;
      position: absolute;
      z-index: 2;
    }

    .column-resize-handle {
      background-color: #3b82f6;
      bottom: -2px;
      pointer-events: none;
      position: absolute;
      right: -2px;
      top: 0;
      width: 4px;
    }
  }

  .tableWrapper {
    overflow-x: auto;
  }

  &.resize-cursor {
    cursor: col-resize;
  }

  mark {
    background-color: rgba(59, 130, 246, 0.2);
    border-radius: 0.25rem;
    box-decoration-break: clone;
    padding: 0.1rem 0.3rem;
  }

  img {
    display: block;
    height: auto;
    margin: 1.5rem 0;
    max-width: 100%;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;

    &.ProseMirror-selectednode {
      outline: 2px solid #3b82f6;
    }
  }

  .dark img {
    border-color: #374151;
  }
}
</style>
