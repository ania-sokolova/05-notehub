import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { NoteTag } from "../../types/note";
import { createNote, type CreateNotePayload } from "../../services/noteService";

import styles from "./NoteForm.module.css";

interface NoteFormProps {
  onClose: () => void;
}

interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

const TAG_OPTIONS: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

const validationSchema = Yup.object({
  title: Yup.string().trim().min(2, "Too short").max(50, "Too long").required("Required"),
  content: Yup.string().trim().min(2, "Too short").max(500, "Too long").required("Required"),
  tag: Yup.mixed<NoteTag>().oneOf(TAG_OPTIONS).required("Required"),
});

export const NoteForm = ({ onClose }: NoteFormProps) => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: CreateNotePayload) => createNote(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      onClose();
    },
  });

  const initialValues: NoteFormValues = {
    title: "",
    content: "",
    tag: "Todo",
  };

  const handleSubmit = async (values: NoteFormValues, helpers: FormikHelpers<NoteFormValues>) => {
    try {
      await mutateAsync(values);
      helpers.resetForm();
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Form className={styles.form}>
          <label className={styles.formGroup} htmlFor="title">
            Title
            <Field id="title" name="title" type="text" className={styles.input} />
            <ErrorMessage name="title" component="div" className={styles.error} />
          </label>

          <label className={styles.formGroup} htmlFor="content">
            Content
            <Field id="content" name="content" as="textarea" className={styles.textarea} />
            <ErrorMessage name="content" component="div" className={styles.error} />
          </label>

          <label className={styles.formGroup} htmlFor="tag">
            Tag
            <Field id="tag" name="tag" as="select" className={styles.select}>
              {TAG_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Field>
            <ErrorMessage name="tag" component="div" className={styles.error} />
          </label>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting || isPending}
            >
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};