import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import css from "./App.module.css";

import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import NoteList from "../NoteList/NoteList";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";

import {
  fetchNotes,
  createNote,
  deleteNote,
  type CreateNotePayload,
} from "../../services/noteService";

const PER_PAGE = 12;

export default function App() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch] = useDebounce(search, 400);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search: debouncedSearch.trim() ? debouncedSearch : undefined,
      }),
    placeholderData: (prev) => prev, 
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  const createMutation = useMutation({
    mutationFn: (payload: CreateNotePayload) => createNote(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
      setPage(1);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleCreate = async (values: CreateNotePayload) => {
    await createMutation.mutateAsync(values);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />

      
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading...</p>}

      {isError && (
        <p>
          Error loading notes:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      )}

      {!isLoading && !isError && notes.length > 0 && (
        <NoteList
          notes={notes}
          onDelete={handleDelete}
          deletingId={deleteMutation.variables ?? null}
        />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NoteForm
          onCancel={() => setIsModalOpen(false)}
          isSubmitting={createMutation.isPending}
          onSubmit={handleCreate}
        />
      </Modal>
    </div>
  );
}