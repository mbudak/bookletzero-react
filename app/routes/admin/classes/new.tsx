import { useRef } from "react";
import AddQuestionClass from "~/components/app/QuestionClasses/AddQuestionClass";
import Breadcrumb from "~/components/ui/breadcrumbs/Breadcrumb"
import ErrorModal, { RefErrorModal } from "~/components/ui/modals/ErrorModal";

export default function NewQuestionClassRoute() {
    const errorModal = useRef<RefErrorModal>(null);
    
    return (
        <div>
            <Breadcrumb menu={[{
                title: "Classes",
                routePath: "/admin/classes"
            },
            {
                title: "New"                
            }
            ]}/>
             <div className="bg-white shadow-sm border-b border-gray-300 w-full py-2">
        <div className="mx-auto max-w-5xl xl:max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 space-x-2">
          <h2 className="flex-1 font-bold flex items-center truncate">New Question Class</h2>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6">

        <AddQuestionClass />
      </div>
      <ErrorModal ref={errorModal} />
      
        </div>
    )
}