<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <side-bar
      :background-color="sidebarBackground"
    >
      <template slot="links">
        <sidebar-item
          :link="{
            name: 'Dashboard',
            icon: 'fa fa-desktop text-primary',
            path: '/dashboard'
          }"
        />

        <sidebar-item :link="{name: 'Orders', icon: 'fa fa-shopping-basket text-blue', path: '/orders'}"/>
        <sidebar-item :link="{name: 'Category', icon: 'fa fa-th text-blue', path: '/category'}"/>
        <sidebar-item :link="{name: 'Items', icon: 'fa fa-book text-blue', path: '/items'}"/>
        <sidebar-item :link="{name: 'View Items', icon: 'fa fa-th-list text-blue', path: '/viewitems'}"/>
        <!-- <sidebar-item :link="{name: 'Stocks', icon: 'fa fa-database text-blue', path: '/stocks'}"/> -->
        <!-- <sidebar-item :link="{name: 'Offers', icon: 'fa fa-percent text-blue', path: '/offers'}"/> -->
        <!-- <sidebar-item :link="{name: 'Banners', icon: 'fa fa-images text-blue', path: '/banner'}"/> -->
        <sidebar-item :link="{name: 'Notifications', icon: 'fa fa-bell text-blue', path: '/notifications'}"/>
        <sidebar-item :link="{name: 'Users', icon: 'fa fa-user text-blue', path: '/users'}"/>

      </template>
    </side-bar>
    <div class="main-content" :data="sidebarBackground">
      <dashboard-navbar></dashboard-navbar>

      <div @click="toggleSidebar">
        <fade-transition :duration="200" origin="center top" mode="out-in">
          <!-- your content here -->
          <router-view></router-view>
        </fade-transition>
        <content-footer v-if="!$route.meta.hideFooter"></content-footer>
      </div>
    </div>
  </div>
</template>
<script>
  import DashboardNavbar from './DashboardNavbar.vue';
  import ContentFooter from './ContentFooter.vue';
  import { FadeTransition } from 'vue2-transitions';

  export default {
    components: {
      DashboardNavbar,
      ContentFooter,
      FadeTransition
    },
    data() {
      return {
        sidebarBackground: 'vue' //vue|blue|orange|green|red|primary
      };
    },
    methods: {
      toggleSidebar() {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false);
        }
      }
    }
  };
</script>
<style lang="scss">
</style>
