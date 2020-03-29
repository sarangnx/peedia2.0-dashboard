<template>
    <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
        <side-bar
        :background-color="sidebarBackground"
        >
            <template slot="links">
                <template v-for="(item, index) in activeSidebarItems">
                    <sidebar-item
                        :key="index" v-if="item.type === 'sidebaritem'"
                        :link="item"
                    />
                    <sidebar-dropdown
                        :key="index" v-if="item.type === 'sidebardropdown'"
                        :title="item.name"
                        :icon="item.icon"
                        :children="item.children"
                    />
                </template>
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
            sidebarItems: [
                { name: 'Dashboard', icon: 'fa fa-desktop text-primary', path: '/dashboard', type: 'sidebaritem', minrank: 1, maxrank: 2 },
                { name: 'Orders', icon: 'fa fa-shopping-basket text-blue', path: '/orders', type: 'sidebaritem', minrank: 1, maxrank: 2 },
                { name: 'Category', icon: 'fa fa-th text-blue', path: '/category', type: 'sidebaritem', minrank: 2, maxrank: 2 },
                { name: 'Items', icon:'fa fa-book text-blue', type: 'sidebardropdown',
                    children: [
                        { name: 'View Items', path: '/items/view-items' },
                        { name: 'Add Item', path: '/items/add-item' },
                        { name: 'Add Item From Excel', path: '/items/add-excel' }
                    ],
                    minrank: 2,
                    maxrank: 2
                },
                { name: 'Notifications', icon: 'fa fa-bell text-blue', path: '/notifications', type: 'sidebaritem', minrank: 2, maxrank: 4 },
                { name: 'Users', icon: 'fa fa-user text-blue', path: '/users', type: 'sidebaritem', minrank: 2, maxrank: 4 }
            ]
        };
    },
    computed: {
        currentUser() {
            return this.$store.getters.getUser;
        },
        usergroup() {
            const currentUsergroup = this.currentUser.usergroup;
            return this.usergroups.find((item) => item.id === currentUsergroup );
        },
        activeSidebarItems() {
            const currentUsergroup = this.usergroup;
            return this.sidebarItems.filter((sidebar) => {
                return currentUsergroup.rank >= sidebar.minrank && currentUsergroup.rank <= sidebar.maxrank;
            });
        }
    },
    methods: {
        toggleSidebar() {
            if (this.$sidebar.showSidebar) {
            this.$sidebar.displaySidebar(false);
            }
        },
    },
};
</script>
<style lang="scss">
</style>
