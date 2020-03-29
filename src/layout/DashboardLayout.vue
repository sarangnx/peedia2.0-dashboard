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
        <sidebar-dropdown
            title="Items" icon="fa fa-book text-blue"
            :children="[
                { name: 'View Items', path: '/items/view-items' },
                { name: 'Add Item', path: '/items/add-item' },
                { name: 'Add Item From Excel', path: '/items/add-excel' }
            ]"
        />
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
            sidebarBackground: 'vue', //vue|blue|orange|green|red|primary
            usergroups: [
                { id: 'user', name: 'Customers', rank: 0 },
                { id: 'delivery', name: 'Delivery', rank: 1 },
                { id: 'storeowner', name: 'Manager', rank: 2 },
                { id: 'admin', name: 'Admin', rank: 3 },
                { id: 'superadmin', name: 'Super Admin', rank: 4 },
            ],
            usergroup: {},
        };
    },
    computed: {
        currentUser() {
            return this.$store.getters.getUser;
        },
        activeUsergroups() {
            const currentUsergroup = this.currentUser.usergroup;
            const currentGroup = this.usergroups.find((item) => item.id === currentUsergroup );
            return this.usergroups.filter((usergroup) => {
                return usergroup.rank < currentGroup.rank;
            });
        }
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
