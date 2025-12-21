import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import type { NoteTag } from "../../types/note";
import css from "./NoteForm.module.css";

const TAGS: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

interface NoteFormProps {
  onCancel: () => void;
  onSubmit: (values: NoteFormValues) => Promise<void> | void;
  isSubmitting?: boolean;
}

const schema = Yup.object({
  title: Yup.string().min(3).max(50).required("Title is required"),
  content: Yup.string().max(500, "Max length is 500"),
  tag: Yup.mixed<NoteTag>().oneOf(TAGS).required("Tag is required"),
});

export default function NoteForm({ onCancel, onSubmit, isSubmitting }: NoteFormProps) {
  const initialValues: NoteFormValues = {
    title: "",
    content: "",
    tag: "Todo",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={async (values, helpers) => {
        await onSubmit(values);
        helpers.resetForm();
      }}
    >
      {({ isValid, dirty }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" type="text" name="title" className={css.input} />
            <ErrorMessage name="title">
              {(msg) => <span className={css.error}>{msg}</span>}
            </ErrorMessage>
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage name="content">
              {(msg) => <span className={css.error}>{msg}</span>}
            </ErrorMessage>
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              {TAGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Field>
            <ErrorMessage name="tag">
              {(msg) => <span className={css.error}>{msg}</span>}
            </ErrorMessage>
          </div>

          <div className={css.actions}>
            <button type="button" className={css.cancelButton} onClick={onCancel}>
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={!dirty || !isValid || !!isSubmitting}
            >
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
