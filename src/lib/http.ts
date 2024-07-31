import axios from 'axios';

const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const http = async (dto: {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: any;
}): Promise<{
  data: any;
  error: any;
  response_status: number;
}> => {
  const { url, method = 'GET', body, headers } = dto;
  const _url = import.meta.env.VITE_API_URL + url;

  const sid = localStorage.getItem('sid');

  const response = await axiosInstance({
    method,
    url: _url,
    data: body,
    headers: {
      ...headers,
      Authorization: `${sid}`,
    },
  });

  return {
    ...response.data,
  };
};
