import { observable, computed, action, runInAction } from "mobx";
import { IUser, IUserFormValues } from "../models/user";
import agent from "../api/agent";
import { RootStore } from "./rootStore";
import { history } from "../..";

export default class UserStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable user: IUser | null = null;
  @observable username: string | null = null;

  @computed get isLoggedIn() {
    return !!this.user;
  }

  @action login = async (values: IUserFormValues) => {
    try {
      const user = await agent.User.login(values);
      runInAction(() => {
        this.user = user;
      });
      console.log(user);
      this.rootStore.commonStore.setToken(user.token);
      this.rootStore.commonStore.setUsername(user.username);
      this.rootStore.modalStore.closeModal();
      history.push("/dashboard");
    } catch (error) {
      throw error;
    }
  };

  @action register = async (values: IUserFormValues) => {
    try {
      values.roles = ["ROLE_USER"];
      const user = await agent.User.register(values);
      //perguntar
      this.rootStore.commonStore.setToken(user.token);

      this.rootStore.modalStore.closeModal();
      history.push("/dashboard");
    } catch (error) {
      throw error;
    }
  };

  @action getUsername = async () => {
    this.username = window.localStorage.getItem("username");
  };

  @action logout = () => {
    this.rootStore.commonStore.setToken(null);
    this.rootStore.commonStore.setUsername(null);
    this.username = null;
    this.user = null;
    history.push("/");
  };
}
