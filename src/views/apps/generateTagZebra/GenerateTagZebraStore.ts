import { defineStore } from "pinia";
import type { GenerateTagZebraParams } from "@/views/apps/generateTagZebra/types";
import {
  findAll,
  findOne,
  update,
  generateTagZebra,
} from "@/api/GenerateTagZebra/generateTagZebra.client";
import Notifier from "@core/utils/Notifier";
import { useAppLayoutStore } from "@/store/appLayout";

const notifier = new Notifier();
const appLayout = useAppLayoutStore();

export const useGenerateTagZebraStore = defineStore("GenerateTagZebraStore", {
  state: () => ({
    loading: false,
  }),

  actions: {
    async findAll(params: GenerateTagZebraParams) {
      try {
        this.loading = true;
        appLayout.setLoading(true);

        const response = await findAll(params);

        this.loading = false;

        appLayout.setLoading(false);

        return response;
      } catch (err) {
        throw new Error(err.message);
      }
    },

    async update(data: GenerateTagZebraParams) {
      try {
        this.loading = true;

        const response = await update(data);

        if (response.status === 200) {
          notifier.success("Profile updated successfully");
          this.loading = false;
        } else {
          notifier.error("Something went wrong");
        }
      } catch (err) {
        // Notifier.error(`Erro ao atualizar o perfil ${err.message}`)
      }
    },

    async findOne() {
      try {
        this.loading = true;
        appLayout.setLoading(true);

        const response = await findOne();

        this.loading = false;
        appLayout.setLoading(false);

        return response.data;
      } catch (err) {
        throw new Error(err.message);
      }
    },

    async generateTagZebra(data: GenerateTagZebraParams) {
      try {
        this.loading = true;
        appLayout.setLoading(true);
        const response = await generateTagZebra(data);
        this.loading = false;
        appLayout.setLoading(false);
        console.log(response, "response");
        return  response.data.data;
      } catch (err) {
        throw new Error(err.message);
      }
    },
  },
});
