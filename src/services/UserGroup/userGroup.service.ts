import { useUserGroupStore, IUseUserGroupStore } from "@/store/userGroup";
import Notifier from '@core/utils/Notifier'
import type {IUserGroupDTO} from "@/api/UserGroup/models/types";
import UserGroupClient from "@/api/UserGroup/userGroup.client";
import {IUseAppLayoutStore, useAppLayoutStore} from "@/store/appLayout";
import {IUserGroupClient} from "@/api/UserGroup/models/types";

export default class UserGroupService {
  public readonly client: IUserGroupClient;
  public readonly notifier: Notifier;
  public readonly store: IUseUserGroupStore;
  public readonly appLayout: IUseAppLayoutStore

  constructor() {
    this.client = new UserGroupClient();
    this.notifier = new Notifier();
    this.store = useUserGroupStore();
    this.appLayout = useAppLayoutStore();
  }

  async create(dataBody: IUserGroupDTO) {
    this.appLayout.setLoading(true);
    try {
      const userGroup = await this.client.postUserGroupCreate(dataBody);
      this.store.addUserGroup(userGroup);
      this.notifier.success('User Group created successfully');
    } catch (err: any) {
      throw this.notifier.error(err.message);
    } finally {
      this.appLayout.setLoading(false);
    }
  }

  async findAll(query: IQueryPermissionUserGroup) {
    this.appLayout.setLoading(true);
    try {
      const userGroups = await this.client.getUserGroupFindAll(query);
      this.store.userGroups = userGroups;
    } catch (err: any) {
      throw this.notifier.error(err.message);
    } finally {
      this.appLayout.setLoading(false);
    }
  }

  async findOne(id: number) {
    this.appLayout.setLoading(true);
    try {
      const userGroup = await this.client.getUserGroupFindOneId(id);
      this.store.userGroup = userGroup;
    } catch (err: any) {
      throw this.notifier.error(err.message);
    } finally {
      this.appLayout.setLoading(false);
    }
  }

  async update(id: number, dataBody: IUserGroupDTO) {
    this.appLayout.setLoading(true);
    try {
      const userGroup = await this.client.putUserGroupUpdateId(id, dataBody);
      this.store.userGroup = userGroup;
      this.notifier.success('User Group updated successfully');
    } catch (err: any) {
      throw this.notifier.error(err.message);
    } finally {
      this.appLayout.setLoading(false);
    }
  }

  async delete(id: number) {
    this.appLayout.setLoading(true);
    try {
      await this.client.deleteUserGroupDeleteId(id);
      this.notifier.success('User Group deleted successfully');
    } catch (err: any) {
      throw this.notifier.error(err.message);
    } finally {
      this.appLayout.setLoading(false);
    }
  }
}


