<script setup lang="ts">
import AuthService from "@/services/auth/auth.service";
import { useAuthStore } from "@/store/auth";
import GenerateTagShein from "@/views/apps/generateTagShein/components/generate-tag-shein.vue";

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
    <GenerateTagShein />
  </div>
</template>
