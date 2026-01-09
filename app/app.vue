<script setup lang="ts">
import { theme } from 'ant-design-vue'

const { darkAlgorithm, defaultAlgorithm } = theme
</script>

<template>
  <a-config-provider
    :theme="{
      algorithm: defaultAlgorithm,
      token: {
        /* Primary Brand Colors - CodeBridge Green */
        colorPrimary: '#10b981',
        colorPrimaryHover: '#059669', 
        colorPrimaryActive: '#047857',
        
        /* Links */
        colorLink: '#10b981',
        colorLinkHover: '#059669',
        
        /* Text */
        colorText: '#111827',
        colorTextSecondary: '#6b7280',
        colorTextDescription: '#9ca3af',
        
        /* Backgrounds */
        colorBgContainer: '#ffffff',
        colorBgElevated: '#f8fafc',
        colorBgLayout: '#f1f5f9',
        
        /* Borders */
        colorBorder: '#e5e7eb',
        colorSplit: '#f3f4f6',
        
        /* Inputs */
        colorInputBg: '#fafbfc',
        
        /* Success */
        colorSuccess: '#10b981',
        colorSuccessHover: '#059669',
        
        /* Border Radius */
        borderRadius: 12,
        borderRadiusLG: 16,
        borderRadiusSM: 8,
        
        /* Shadows (Simplified) */
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        boxShadowSecondary: '0 0 0 1px rgba(0, 0, 0, 0.05)',
      },
      components: {
        Table: {
          headerBg: '#10b981',
          headerColor: '#ffffff',
        },
        Card: {
          colorBorder: 'rgba(16, 185, 129, 0.1)',
        },
        Button: {
          colorPrimaryHover: '#059669',
        }
      }
    }"
  >
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </a-config-provider>
</template>
