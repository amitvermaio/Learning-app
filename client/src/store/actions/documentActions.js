import { toast } from 'sonner';
import api from '../../config/axiosconfig';
import {
  setdocumentloading,
  setdocuments,
  setcurrentdocument,
  setdocumenterror,
  setcurrentdocumentloading,
} from '../reducers/documentSlice';

const extractdata = (res) => res?.data ?? res;

export const asyncuploaddocument = (payload) => async (dispatch, getState) => {
  try {
    dispatch(setdocumentloading());

    const { data } = await api.post('/documents/upload', payload);
    const res = extractdata(data);

    if (res.statusCode >= 400) {
      throw new Error(res.message || 'Upload failed');
    }

    const doc = res?.document ?? null;
    dispatch(setcurrentdocument(doc));

    if (doc?._id) {
      const { documents } = getState().document;
      const withoutDuplicate = documents.filter((item) => item._id !== doc._id);
      dispatch(setdocuments([doc, ...withoutDuplicate]));
    }

    toast.success('Document uploaded successfully');
    return doc;

  } catch (error) {
    const message = error.response?.data?.message || error.message;
    dispatch(setdocumenterror(message));
    toast.error(message);
    return null;
  }
};

export const asyncgetdocuments = () => async (dispatch) => {
  try {
    dispatch(setdocumentloading());

    const { data } = await api.get('/documents');
    const res = extractdata(data);

    dispatch(setdocuments(res?.documents ?? []));
    return true;

  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch documents';
    dispatch(setdocumenterror(message));
    toast.error(message);
    return false;
  }
};

export const asyncgetdocumentbyid = (id) => async (dispatch) => {
  try {
    dispatch(setcurrentdocumentloading(true));

    const { data } = await api.get(`/documents/${id}`);
    const res = extractdata(data);

    dispatch(setcurrentdocument(res?.document ?? null));

  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch document';
    dispatch(setdocumenterror(message));
    toast.error(message);

  } finally {
    dispatch(setcurrentdocumentloading(false));
  }
};

export const asyncupdatedocument = (id, payload) => async (dispatch) => {
  try {
    dispatch(setdocumentloading());

    const { data } = await api.put(`/documents/${id}`, payload);
    const res = extractdata(data);

    const updatedDoc = res?.document ?? null;
    dispatch(setcurrentdocument(updatedDoc));

    dispatch((dispatch, getState) => {
      const { documents } = getState().document;
      const updatedList = documents.map((doc) =>
        doc._id === updatedDoc._id ? updatedDoc : doc
      );
      dispatch(setdocuments(updatedList));
    });

    toast.success('Document updated successfully');
    return true;

  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update document';
    dispatch(setdocumenterror(message));
    toast.error(message);
    return false;
  }
};

export const asyncdeletedocument = (id) => async (dispatch, getState) => {
  try {
    dispatch(setdocumentloading());

    await api.delete(`/documents/${id}`);

    const { documents } = getState().document;
    const filtered = documents.filter((doc) => doc._id !== id);

    dispatch(setdocuments(filtered));

    toast.success('Document deleted successfully');
    return true;

  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete document';
    dispatch(setdocumenterror(message));
    toast.error(message);
    return false;
  }
};