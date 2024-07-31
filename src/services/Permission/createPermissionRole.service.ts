import {usePermissionStore, IUsePermissionStore} from "@/store/permission";
import Notifier from '@core/utils/Notifier'
import PermissionClient from "@/api/Permission/permission.client";
import PermissionService from "@/services/Permission/permission.service";
import {IUseAppLayoutStore, useAppLayoutStore} from "@/store/appLayout";
import {IPermissionClient} from "@/api/Permission/models/types";
import {IPermissionRole} from "@/services/Permission/intefaces";
import {ICreatePermissionGroup} from "@types/types";

export default class CreatePermissionRoleService {
    public readonly client: IPermissionClient;
    public readonly notifier: Notifier;
    public readonly store: IUsePermissionStore;
    public readonly appLayout: IUseAppLayoutStore
    public readonly permissionService: PermissionService

    constructor() {
        this.client = new PermissionClient();
        this.permissionService = new PermissionService();
        this.notifier = new Notifier();
        this.store = usePermissionStore();
        this.appLayout = useAppLayoutStore();
    }

    async createPermissionRole(permission: string=this.store.permission.subjects) {
        this.store.isLoading = true
        try {
            await this.client.postPermissionCreatePermissionRole(permission);
            this.notifier.success('Permissões criadas com sucesso');
        } catch (err: any) {
            throw this.notifier.error(err.message);
        } finally {
            this.store.isLoading = false
        }
    }
}


