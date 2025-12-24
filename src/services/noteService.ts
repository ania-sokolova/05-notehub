import { api } from "./api";
import type { Note, NoteTag } from "../types/note";

export interface FetchNotesParams {
  page: number;
  query: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

const PER_PAGE = 10;

export const fetchNotes = async ({ page, query }: FetchNotesParams): Promise<FetchNotesResponse> => {
  const trimmed = query.trim();

  const params: Record<string, string | number> = {
    page,
    perPage: PER_PAGE,           
    ...(trimmed ? { search: trimmed } : {}), 
  };

  const { data } = await api.get<FetchNotesResponse>("/notes", { params });
  return data;
};

export const createNote = async (payload: CreateNotePayload): Promise<Note> => {
  const { data } = await api.post<Note>("/notes", payload);
  return data;
};

export const deleteNote = async (id: string): Promise<void> => {
  await api.delete(`/notes/${id}`);
};