import { defineStore } from "pinia";
import type { GenerateTagSheinParams } from "@/views/apps/generateTagShein/types";
import {
  findAll,
  findOne,
  update, 
  generateTagShein, 
} from "@/api/GenerateTagZebra/generateTagZebra.client";
import Notifier from "@core/utils/Notifier";
import { PDFDocument } from 'pdf-lib';

import { useAppLayoutStore } from "@/store/appLayout"; 

const notifier = new Notifier();
const appLayout = useAppLayoutStore();

export const useGenerateTagSheinStore = defineStore("GenerateTagSheinStore", {
  state: () => ({
    loading: false,
    generatedLabelUrl: null as string | null,
    countPages: 0,
    countpagesEconomic: 0,
  }),

  actions: {
    async findAll(params: GenerateTagSheinParams) {
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

    async update(data: GenerateTagSheinParams) {
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

    async generateTagShein(data: FormData) {
      try { 
 



        // console.log(data, "total de paginas no file");
        this.loading = true;
        appLayout.setLoading(true);
        const response = await generateTagShein(data);
 
        const uint8Array = await response.data.arrayBuffer();
        const pdfDoc = await PDFDocument.load(uint8Array);
    
        // Obter a contagem de páginas
        this.countpagesEconomic = pdfDoc.getPageCount();


        

        const url = URL.createObjectURL( response.data);
        this.generatedLabelUrl = url;
        this.loading = false;
        appLayout.setLoading(false); 
        return  response;

      } catch (error) {  if (error.response) {
        // Erro na resposta da requisição (com código de status diferente de 2xx)
        console.error("Request failed with status code:", error.response.status);
        // Exibir mensagem de erro ao usuário, por exemplo:
        alert("Falha na requisição: " + error.message);
      } else if (error.request) {
        // Requisição foi feita, mas não recebeu resposta (sem conexão, timeout, etc.)
        console.error("Request made but no response received:", error.request);
        alert("Erro de conexão: " + error.message);
      } else {
        // Erro durante a configuração da requisição
        console.error("Error setting up the request:", error);
        alert("Erro na requisição: " + error);
      }
        throw new Error(error);
      }
    },

    async countPages(file: File): Promise<number> {
      try {
        
        if (!file || file.type !== 'application/pdf') {
          throw new Error('Arquivo inválido ou não encontrado no FormData');
        }

        // Carregar o arquivo PDF como ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        // Carregar o documento PDF
        const pdfDoc = await PDFDocument.load(uint8Array);

        // Retornar a contagem de páginas
        return pdfDoc.getPageCount();
      } catch (error) {
        console.error('Erro ao contar páginas do PDF:', error);
        return 0; // Ou outro tratamento de erro conforme necessário
      }
    },

    
  },
});
