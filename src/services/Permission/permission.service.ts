import {usePermissionStore, IUsePermissionStore} from "@/store/permission";
import Notifier from '@core/utils/Notifier'
import type {IPermissionDTO} from "@/api/Permission/models/types";
import PermissionClient from "@/api/Permission/permission.client";
import {IUseAppLayoutStore, useAppLayoutStore} from "@/store/appLayout";
import {IPermissionClient} from "@/api/Permission/models/types";

export default class PermissionService {
  public readonly client: IPermissionClient;
  public readonly notifier: Notifier;
  public readonly store: IUsePermissionStore;
  public readonly appLayout: IUseAppLayoutStore

  constructor() {
    this.client = new PermissionClient();
    this.notifier = new Notifier();
    this.store = usePermissionStore();
    this.appLayout = useAppLayoutStore();
  }

  async create(dataBody: IPermissionDTO) {
    this.store.isLoading = true
    try {
      const userGroup = await this.client.postPermissionCreate(dataBody);
      this.store.addPermission(userGroup);
      this.notifier.success('User Group created successfully');
    } catch (err: any) {
      throw this.notifier.error(err.message);
    } finally {
      this.store.isLoading = false
    }
  }

  async findAll(query: IQueryPermissionPermission = this.store.pagination) {
    this.store.isLoading = true
    try {
      const {data, message, ...pagination} = await this.client.getPermissionFindAll(query);
      this.store.permissions = data;
      this.store.setPagination(pagination);
    } catch (err: any) {
      throw this.notifier.error(err.message);
    } finally {
      this.store.isLoading = false
    }
  }

  async findOne(id: number) {
    this.store.isLoading = true
    try {
      const permission = await this.client.getPermissionFindOneId(id);
      this.store.permission = permission;
    } catch (err: any) {
      throw this.notifier.error(err.message);
    } finally {
      this.store.isLoading = false
    }
  }

  async update(id: number, dataBody: IPermissionDTO= this.store.permission) {
    this.store.isLoading = true
    try {
      const permission = await this.client.putPermissionUpdateId(id, dataBody);
      this.store.permission = permission;
      this.notifier.success('User Group updated successfully');
    } catch (err: any) {
      throw this.notifier.error(err.message);
    } finally {
      this.store.isLoading = false
    }
  }

  async delete(id: number) {
    this.store.isLoading = true
    try {
      const { message } = await this.client.deletePermissionDeleteId(id);
      await this.findAll(this.store.pagination)
      this.notifier.success(message);
    } catch (err: any) {
      throw this.notifier.error(err.message);
    } finally {
      this.store.isLoading = false
    }
  }
}


