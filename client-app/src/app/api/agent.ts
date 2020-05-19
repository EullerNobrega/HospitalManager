import axios, { AxiosResponse } from "axios";
import { history } from "../..";
import { toast } from "react-toastify";
import { IUser, IUserFormValues } from "../models/user";
import { IPaciente } from "../models/paciente";

axios.defaults.baseURL = "http://localhost:8080/api";
/*
axios.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log(error);

    return Promise.reject(error);
  }
);
*/
axios.interceptors.response.use(undefined, (error) => {
 // console.log(error.response);


  if (error.message === "Network Error" && !error.response) {
    toast.error("Network error - make sure API is running!!!");
  }
  if (error.response.status === 404) {
    history.push("/notfound");
  }
  
  if (error.response.status === 500) {
    toast.error("Server error - check the terminal for more info!");
  }
  throw error.response;
});

const responseBody = (responseBody: AxiosResponse) => responseBody.data;


const requests = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  del: (url: string) => axios.delete(url).then(responseBody),
};


const User = {
  //current: (): Promise<IUser> => requests.get("/user"),
  login: (user: IUserFormValues): Promise<IUser> =>
    requests.post("/auth/signin", user),
  register: (user: IUserFormValues): Promise<IUser> =>
    requests.post("/auth/signup", user),
};

const Paciente = {
  list: (): Promise<IPaciente[]> => requests.get("/pacientes"),
  details: (id: number) => requests.get(`/pacientes/${id}`),
  create: (paciente: IPaciente) => requests.post("/pacientes", paciente),
  update: (paciente: IPaciente) =>
    requests.put(`/pacientes/${paciente.id}`, paciente),
  delete: (id: string) => requests.del(`/pacientes/${id}`),
};

export default {
  User,
  Paciente,
};
