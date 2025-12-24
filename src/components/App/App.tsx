import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useDebounce } from '../../hooks/useDebounce';
import { fetchNotes } from '../../services/noteService';

import  SearchBox  from '../SearchBox/SearchBox';
import { NoteList } from '../NoteList/NoteList';
import  Pagination  from '../Pagination/Pagination';
import { Modal } from '../Modal/Modal';
import { NoteForm } from '../NoteForm/NoteForm';
import { Loader } from "../Loader/Loader";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";


export default function App() {
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);


  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', debouncedQuery, page],
    queryFn: () => fetchNotes({ page, query: debouncedQuery }),
    placeholderData: (prev) => prev,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div>
      <button type="button" onClick={() => setIsModalOpen(true)}>
        Add note
      </button>

      <SearchBox onChange={setQuery} value={query} />

      {isLoading && <Loader />}
{isError && <ErrorMessage />}

      
      {!isLoading && !isError && <NoteList notes={notes} />}

<Pagination
  page={page}
  totalPages={totalPages}
  onPageChange={setPage}
/>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

