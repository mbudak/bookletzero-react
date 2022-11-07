import { marked } from "marked";
import { useState } from "react";
import InputText from "~/components/ui/input/InputText";

export default function PreviewInputTextWithMonacoEditor() {
  const [markdownValue, setMarkdownValue] = useState(`
  # Markdown Editor
  
  ## Title 1

  Lorem ipsum dolor sit amet, consectetur adipiscing elit.

  _Image_:

  ![BookletZERO](https://bookletzero.com/img/cover.png)
  `);
  return (
    <div id="input-text">
      <div className="bg-white p-6 border-dashed border-gray-300 border">
        <div className="sm:grid sm:grid-cols-2 sm:gap-2">
          <InputText
            className="h-64"
            name="editor"
            title="Editor"
            editor="monaco"
            editorLanguage="markdown"
            editorHideLineNumbers={true}
            value={markdownValue}
            setValue={setMarkdownValue}
          />

          <div className="overflow-auto h-64 space-y-1">
            <label className="text-xs font-medium text-gray-600">Preview</label>
            <div className="prose p-6 rounded-md border-2 border-dashed border-gray-300">
              <div dangerouslySetInnerHTML={{ __html: marked(markdownValue) ?? "" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
