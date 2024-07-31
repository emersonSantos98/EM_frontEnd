import { usePermissionUserGroupStore } from "@/store/permissionusergroup";
import SecurityClient from '@/api/Security/security.client'
import Notifier from '@core/utils/Notifier'
import { IFormChangePasswordDTO,IFormForgotPasswordDTO} from "@/store/SecurityStore";
import type {IPermissionUserGroupClient} from "@/api/PermissionUserGroup/models/types";
import {IUsePermissionUserGroupStore} from "@/store/permissionusergroup";
import PermissionUserGroupClient from "@/api/PermissionUserGroup/permissionUserGroup.client";
import {IUseAppLayoutStore, useAppLayoutStore} from "@/store/appLayout";
import {IQueryPermissionUserGroup} from "@/api/PermissionUserGroup/models/types";

export default class PermissionusergroupService {
  public readonly client: IPermissionUserGroupClient;
  public readonly notifier: Notifier;
  public readonly store: IUsePermissionUserGroupStore;
  public readonly appLayout: IUseAppLayoutStore

  constructor() {
    this.client = new PermissionUserGroupClient();
    this.notifier = new Notifier();
    this.store = usePermissionUserGroupStore();
    this.appLayout = useAppLayoutStore();
  }

  async findAll(query: IQueryPermissionUserGroup) {
    this.appLayout.setLoading(true);
    try {
      const permissionsGroups = await this.client.getPermissionUserGroupFindAll(query);
      this.store.permissionUserGroups = permissionsGroups;
    } catch (err: any) {
      throw this.notifier.error(err.message);
    } finally {
      this.appLayout.setLoading(false);
    }
  }

  async findOne(id: number) {
    this.appLayout.setLoading(true);
    try {
      const permissionsGroup = await this.client.getPermissionUserGroupFindOneId(id);
      this.store.permissionUserGroup = permissionsGroup;
    } catch (err: any) {
      throw this.notifier.error(err.message);
    } finally {
      this.appLayout.setLoading(false);
    }
  }
}


