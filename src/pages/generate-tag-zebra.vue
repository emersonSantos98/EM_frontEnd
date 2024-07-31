<script setup lang="ts">
import AuthService from "@/services/auth/auth.service";
import { useAuthStore } from "@/store/auth";
import GenerateTagZebra from "@/views/apps/generateTagZebra/components/generate-tag-zebra.vue";

const authService = new AuthService();

const testeAuth = () => {
  authService
    .authVerifyToken()
    .then((data) => {
      console.log("data", data);
    })
    .catch((e) => {
      console.log("e", e);
    });
};

const refreshToken = () => {
  authService.AuthRefreshToken();
};

const authUser = () => {
  const authUser = useAuthStore();
  authUser.checkToken();
};
</script>

<template>
  <div>
    <GenerateTagZebra />
  </div>
</template>
