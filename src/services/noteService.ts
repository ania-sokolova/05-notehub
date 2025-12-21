import { api } from "./api";
import type { Note, NoteTag } from "../types/note";


export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}


export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}


type FetchNotesRaw =
  | { notes: Note[]; totalPages: number }
  | { items: Note[]; totalPages: number }
  | { data: Note[]; totalPages: number }
  | { results: Note[]; totalPages: number }
  | { notes: Note[]; pageCount: number }
  | { items: Note[]; pageCount: number }
  | { data: Note[]; meta?: { totalPages?: number; pageCount?: number } }
  | { notes: Note[]; meta?: { totalPages?: number; pageCount?: number } }
  | any;


export const fetchNotes = async (
  params: FetchNotesParams
): Promise<FetchNotesResponse> => {
  const { data } = await api.get<FetchNotesRaw>("/notes", { params });

  const notes: Note[] =
    data?.notes ?? data?.items ?? data?.data ?? data?.results ?? [];

  const totalPages: number =
    data?.totalPages ??
    data?.pageCount ??
    data?.meta?.totalPages ??
    data?.meta?.pageCount ??
    1;

  return { notes, totalPages };
};


export interface CreateNotePayload {
  title: string;
  content?: string;
  tag: NoteTag;
}


export const createNote = async (payload: CreateNotePayload): Promise<Note> => {
  const { data } = await api.post<Note>("/notes", payload);
  return data;
};


export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};