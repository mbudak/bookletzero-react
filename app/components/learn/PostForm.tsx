import { useEffect, useRef, useState } from "react";
import { Form, useActionData, useNavigate, useSubmit, useTransition } from "@remix-run/react";
import InputText, { RefInputText } from "../ui/input/InputText";
import { useTranslation } from "react-i18next";
import InputDate from "../ui/input/InputDate";
import InputSelector from "../ui/input/InputSelector";
import { LearnAuthor, LearnCategory, LearnTag } from "@prisma/client";
import UrlUtils from "~/utils/app/UrlUtils";
import LoadingButton from "../ui/buttons/LoadingButton";
import ConfirmModal, { RefConfirmModal } from "../ui/modals/ConfirmModal";
import ButtonSecondary from "../ui/buttons/ButtonSecondary";
import ButtonTertiary from "../ui/buttons/ButtonTertiary";
import Modal from "../ui/modals/Modal";
import { LearnPostActionData } from "~/routes/admin/learn.new";
import UploadDocument from "../ui/uploaders/UploadDocument";
import ErrorModal, { RefErrorModal } from "../ui/modals/ErrorModal";
import InputCheckbox from "../ui/input/InputCheckbox";
import InputGroup from "../ui/forms/InputGroup";
import { marked } from "marked";
import { LearnPostWithDetails } from "~/utils/db/learn.db.server";

interface Props {
  item?: LearnPostWithDetails | null;
  authors: LearnAuthor[];
  categories: LearnCategory[];
  tags: LearnTag[];
  canUpdate?: boolean;
  canDelete?: boolean;
}
export default function PostForm({ item, authors, categories, tags, canUpdate = true, canDelete }: Props) {
  const { t } = useTranslation();
  const transition = useTransition();
  const loading = transition.state === "submitting";
  const navigate = useNavigate();
  const submit = useSubmit();
  const actionData = useActionData<LearnPostActionData>();

  const inputTitle = useRef<RefInputText>(null);
  const confirmRemove = useRef<RefConfirmModal>(null);
  const errorModal = useRef<RefErrorModal>(null);

  const [markdown, setMarkdown] = useState("");
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [showUploadImage, setShowUploadImage] = useState(false);

  const [title, setTitle] = useState(item?.title ?? "");
  const [slug, setSlug] = useState(item?.slug ?? "");
  const [author, setAuthor] = useState<string | number | undefined>("");
  const [category, setCategory] = useState<string | number | undefined>("");
  const [postTags, setPostTags] = useState("");
  const [date, setDate] = useState<Date | undefined>(item?.date ?? new Date());
  const [description, setDescription] = useState(item?.description ?? "");
  const [readingTime, setReadingTime] = useState(item?.readingTime ?? "");
  const [published, setPublished] = useState(item?.published ?? false);
  const [image, setImage] = useState(item?.image ?? "");
  const [content, setContent] = useState(item?.content ?? ``);

  useEffect(() => {
    setTimeout(() => {
      inputTitle.current?.input.current?.focus();
    }, 100);

    if (!item) {
      if (authors.length === 1) {
        setAuthor(authors[0].id);
      }
      if (categories.length === 1) {
        setCategory(categories[0].id);
      }
    } else {
      setAuthor(item.authorId);
      setCategory(item.categoryId);
      setPostTags(item?.tags.map((postTag) => postTag.tag.name).join(",") ?? "");
    }

    if (actionData?.error) {
      errorModal.current?.show(t("shared.error"), actionData.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData]);

  useEffect(() => {
    if (!item) {
      const slug = UrlUtils.slugify(title, 100);
      setSlug(slug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  function changedTags(e: string) {
    setPostTags(e.replace(" ", "").replace("#", ""));
  }

  function remove() {
    confirmRemove.current?.show(t("shared.confirmDelete"), t("shared.delete"), t("shared.cancel"), t("shared.warningCannotUndo"));
  }

  function yesRemove() {
    const form = new FormData();
    form.set("action", "delete");
    submit(form, {
      method: "post",
    });
  }

  function preview() {
    setMarkdown(marked(content));
    setShowMarkdown(true);
  }

  // function create() {
  //   if (!title || !slug || !description || !author || !category || !content) {
  //     errorModal.current?.show(t("shared.error"), t("shared.missingFields"));
  //     return;
  //   }
  //   const form = new FormData();
  //   form.set("action", !item ? "create" : "edit");
  //   form.set("title", title);
  //   form.set("slug", slug);
  //   form.set("author", author ?? "");
  //   form.set("category", category ?? "");
  //   form.set("tags", postTags);
  //   form.set("date", date);
  //   form.set("description", description);
  //   form.set("reading-time", readingTime);
  //   form.set("image", image);
  //   form.set("content", content);
  //   submit(form, {
  //     method: "post",
  //   });
  // }

  return (
    <Form method="post" className="space-y-6">
      <input type="hidden" readOnly name="action" value={item ? "edit" : "create"} />
      <InputGroup title="SEO">
        <div className="grid grid-cols-12 gap-3">
          <InputText
            disabled={!canUpdate}
            ref={inputTitle}
            className="col-span-12"
            name="title"
            title={t("models.post.title")}
            value={title}
            setValue={setTitle}
            required
          />

          <InputText disabled={!canUpdate} className="col-span-12" name="slug" title={t("models.post.slug")} value={slug} setValue={setSlug} required />

          <InputText
            disabled={!canUpdate}
            className="col-span-12"
            rows={2}
            name="description"
            title={t("models.post.description")}
            value={description}
            setValue={setDescription}
            maxLength={160}
            required
          />

          {!image.startsWith("data:image") && (
            <>
              <InputText
                disabled={!canUpdate}
                className="col-span-12"
                name="image"
                title={t("models.post.image")}
                value={image}
                setValue={setImage}
                button={
                  <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 ">
                    <kbd className="bg-white inline-flex items-center border border-gray-200 rounded px-2 text-sm font-sans font-medium text-gray-500">
                      <button onClick={() => setShowUploadImage(true)}>Upload image</button>
                    </kbd>
                  </div>
                }
              />
            </>
          )}

          {showUploadImage && (
            <UploadDocument
              disabled={!canUpdate}
              className="col-span-12"
              accept="image/png, image/jpg, image/jpeg"
              description={t("models.post.image")}
              onDropped={(e) => setImage(e)}
            />
          )}

          {image && (
            <div className="col-span-12">
              <img className="xl:border-b xl:border-gray-200 rounded-lg shadow-xl overflow-hidden" src={image} alt={t("models.post.image")} />
              <ButtonTertiary disabled={!canUpdate} onClick={() => setImage("")}>
                {t("shared.delete")}
              </ButtonTertiary>
            </div>
          )}
        </div>
      </InputGroup>

      <InputGroup title="Details">
        <div className="grid grid-cols-12 gap-3 bg-white rounded-md">
          <InputSelector
            disabled={!canUpdate}
            className="col-span-6 md:col-span-4"
            name="author"
            title={t("models.post.author")}
            options={authors.map((author) => {
              return {
                value: author.id,
                name: author.firstName + " " + author.lastName,
              };
            })}
            value={author}
            setValue={setAuthor}
            required
          />
          <InputSelector
            disabled={!canUpdate}
            className="col-span-6 md:col-span-4"
            name="category"
            title={t("models.post.category")}
            value={category}
            setValue={setCategory}
            options={categories.map((category) => {
              return {
                value: category.id,
                name: category.name,
              };
            })}
            required
          />
          <InputText
            disabled={!canUpdate}
            className="col-span-6 md:col-span-4"
            name="tags"
            title={t("models.post.tags")}
            value={postTags}
            setValue={(e) => changedTags(e.toString())}
            hint={<div className="text-xs italic text-gray-400 font-light">Separated by comma</div>}
          />
          <InputDate
            disabled={!canUpdate}
            className="col-span-6 md:col-span-4"
            name="date"
            title={t("models.post.date")}
            value={date}
            onChange={setDate}
            required
          />

          <InputText
            disabled={!canUpdate}
            className="col-span-6 md:col-span-4"
            name="reading-time"
            title={t("models.post.readingTime")}
            value={readingTime}
            setValue={setReadingTime}
            maxLength={10}
          />
          <InputCheckbox
            disabled={!canUpdate}
            className="col-span-6 md:col-span-4"
            name="published"
            title={t("models.post.published")}
            value={published}
            setValue={setPublished}
          />
        </div>
      </InputGroup>

      <InputGroup title="Content">
        <div className="grid grid-cols-12 gap-3 bg-white rounded-md">
          <InputText
            disabled={!canUpdate}
            className="col-span-12"
            rows={6}
            editor="monaco"
            editorLanguage="markdown"
            editorTheme="light"
            name="content"
            title={t("models.post.markdown")}
            value={content}
            setValue={setContent}
            required
            hint={
              <ButtonTertiary className="text-xs" onClick={preview}>
                {t("shared.preview")}
              </ButtonTertiary>
            }
          />
        </div>
      </InputGroup>
      <div className="flex justify-between space-x-2">
        <div>
          {item && (
            <ButtonSecondary destructive={true} disabled={loading || !canDelete} onClick={remove}>
              <div>{t("shared.delete")}</div>
            </ButtonSecondary>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <ButtonSecondary onClick={() => navigate("/admin/learn")} disabled={loading}>
            <div>{t("shared.cancel")}</div>
          </ButtonSecondary>
          {/* <ButtonSecondary onClick={preview} disabled={loading}>
            {t("shared.preview")}
          </ButtonSecondary> */}
          <LoadingButton type="submit" disabled={loading || !canUpdate}>
            {t("shared.save")}
          </LoadingButton>
        </div>
      </div>

      <Modal className="sm:max-w-2xl" open={showMarkdown} setOpen={setShowMarkdown}>
        <div className="prose p-6">
          <div dangerouslySetInnerHTML={{ __html: markdown ?? "" }} />
        </div>
      </Modal>

      <ConfirmModal ref={confirmRemove} onYes={yesRemove} />
      <ErrorModal ref={errorModal} />
    </Form>
  );
}
