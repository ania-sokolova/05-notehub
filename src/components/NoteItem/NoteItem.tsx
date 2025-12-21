import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../services/noteService";
import type { Note } from "../../types/note";

interface NoteItemProps {
  note: Note;
}

const NoteItem = ({ note }: NoteItemProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return (
    <li>
      <h2>{note.title}</h2>
      <p>{note.content}</p>
      <span>{note.tag}</span>
      <button onClick={() => mutation.mutate(note.id)}>
        Delete
      </button>
    </li>
  );
};

export default NoteItem;