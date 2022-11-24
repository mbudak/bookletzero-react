import { useEffect, useRef, useState } from "react";
import { Form, useActionData, useNavigate, useSubmit, useTransition } from "@remix-run/react";
import { QuestionWithDetails } from "~/utils/db/questions.db.server"
import ButtonSecondary from "../ui/buttons/ButtonSecondary";
import LoadingButton from "../ui/buttons/LoadingButton";
import InputGroup from "../ui/forms/InputGroup";
import InputText from "../ui/input/InputText";
import Modal from "../ui/modals/Modal";
import clsx from "clsx";
import ButtonTertiary from "../ui/buttons/ButtonTertiary";
import { marked } from "marked";

interface Props {
    questionClassId: Number,
    item?: QuestionWithDetails | null;
    canUpdate?: boolean;
    canDelete?: boolean;
}
export default function ({ questionClassId, item, canUpdate = true, canDelete } : Props)  {

    const transition = useTransition();
    const navigate = useNavigate();
  const [markdown, setMarkdown] = useState("");
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [showUploadImage, setShowUploadImage] = useState(false);
  const loading = transition.state === "submitting";
  const [qBody, setQBody] = useState(item?.qBody ?? ``);

  function preview() {
    setMarkdown(marked(qBody));
    setShowMarkdown(true);
  }

  
    return (
        <Form method="post" className="space-y-1">
            <input type="hidden" readOnly name="action" value={item ? "edit" : "create"} />


        <InputGroup title="Question">
        <div className="grid grid-cols-12 gap-3 bg-white rounded-md">
          <InputText
            disabled={!canUpdate}
            className="col-span-12"
            rows={6}
            editor="monaco"
            editorLanguage="markdown"
            editorTheme="light"
            name="qBody"
            title="Markdown"
            value={qBody}
            setValue={setQBody}
            required
            hint={
              <ButtonTertiary className="text-xs" onClick={preview}>
                Preview
              </ButtonTertiary>
            }
          />
        </div>
      </InputGroup>



            


            <div className="flex justify-between space-x-2">
        <div>
          
        </div>






        <div className="flex items-center space-x-2">
          <ButtonSecondary onClick={() => navigate("/admin/questions/" + questionClassId.toString())} disabled={loading}>
            <div>Cancel</div>
          </ButtonSecondary>
          
          <LoadingButton type="submit" disabled={loading || !canUpdate}>
            Save
          </LoadingButton>
        </div>
      </div>
      
            <Modal className="sm:max-w-2xl" open={showMarkdown} setOpen={setShowMarkdown}>
        <div className="prose p-6">
          <div dangerouslySetInnerHTML={{ __html: markdown ?? "" }} />
        </div>
      </Modal>


        </Form>
    )
}