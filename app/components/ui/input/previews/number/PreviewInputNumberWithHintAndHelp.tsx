import InputNumber from "~/components/ui/input/InputNumber";

export default function PreviewInputNumberWithHintAndHelp() {
  return (
    <div id="input-number-with-hint-and-help">
      <div className="bg-white p-6 border-dashed border-gray-300 border">
        <InputNumber name="name" title="Title" hint={<span className="text-red-500">Hint text</span>} help={"Help text"} />
      </div>
    </div>
  );
}
