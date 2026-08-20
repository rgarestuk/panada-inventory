import { AxiosError } from 'axios';
import { ApiErrorResponse } from '../types/api';

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    if (data?.message) {
      // If there are validation field errors, append the first one
      if (data.errors && Object.keys(data.errors).length > 0) {
        const firstField = Object.keys(data.errors)[0];
        const firstMsg = data.errors[firstField][0];
        return `${data.message}: ${firstMsg}`;
      }
      return data.message;
    }
    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Terjadi kesalahan sistem yang tidak terduga.';
}
