import { useNavigate, useSubmit, Form } from "@remix-run/react";
import { FormEvent, useRef, useState } from "react";
import Loading from "~/components/ui/loaders/Loading";
import ConfirmModal, { RefConfirmModal } from "~/components/ui/modals/ConfirmModal";
import ErrorModal, { RefErrorModal } from "~/components/ui/modals/ErrorModal";
import SuccessModal, { RefSuccessModal } from "~/components/ui/modals/SuccessModal";


export default function AddQuestionClass() {
    const navigate = useNavigate();
  const submit = useSubmit();

  const errorModal = useRef<RefErrorModal>(null);
  const successModal = useRef<RefSuccessModal>(null);
  const confirmCreate = useRef<RefConfirmModal>(null);
  const inputFirstName = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  
  function save(e: FormEvent) {
    e.preventDefault();
    confirmCreate.current?.show("Are you sure to save?", "Save","Cancel");
  }

  function cancel() {
    navigate("/admin/classes");
  }

  function confirmSave() {
    const form = new FormData();
    console.log('form', form);
    
    submit(form, {
      method: "post",
    });
  }
  function goToProfile() {
    navigate("/app/employees");
  }

    return (
        <div>
      {(() => {
        if (loading) {
          return <Loading />;
        } else {
          return (
            <form onSubmit={save}>
              <div className="bg-white py-6 px-8 shadow-lg border border-gray-200">
                <div className="flex items-center space-x-3 justify-between">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Question Classes</h3>
                  </div>
                </div>

                
                <div className="col-span-3 sm:col-span-2">
                
                  <label htmlFor="title" className="block text-xs font-medium text-gray-700 truncate">
                    Question Class Name
                  </label>
                
                <div className="mt-1">
                  <input
                    autoComplete="off"
                    type="text"
                    name="title"
                    id="title"                    
                    
                    required
                    className="shadow-sm focus:ring-theme-500 focus:border-theme-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>


               
              </div>
              <div className="my-4 flex items-center justify-end space-x-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={cancel}
                    type="button"
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm sm:text-sm font-medium sm:rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center space-x-2 px-3 py-2 border border-transparent shadow-sm sm:text-sm font-medium sm:rounded-md text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </form>
          );
        }
      })()}
      <ConfirmModal ref={confirmCreate} onYes={confirmSave} />
      <SuccessModal ref={successModal} onClosed={goToProfile} />
      <ErrorModal ref={errorModal} />
    </div>

    )
}