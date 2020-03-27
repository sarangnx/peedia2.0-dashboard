<template>
    <li class="nav-item drop__down"
        @click="toggleDropDown"
        v-click-outside="closeDropDown"
    >
        <a class="nav-link">
            <i :class="icon"></i>
            <span>{{ title }}</span>
        </a>
        <ul class="dropdown___menu"
            v-show="isOpen"
        >
            <router-link
                v-for="child in children"
                :key="child.name"
                :to="child.path"
                @click.native="linkClick"
                class="nav-link"
                :target="child.target"
                :href="child.path"
            >
                <template>
                    <span class="nav-link-text">{{ child.name }}</span>
                </template>
            </router-link>
        </ul>
    </li>
</template>
<script>
export default {
    name: "sidebar-dropdown",
    props: {
        icon: {
            type: String,
            default: '',
        },
        title: {
            type: String,
            default: '',
        },
        children: {
            type: Array,
            default: [],
        }
    },
    inject: {
        autoClose: {
            default: true
        }
    },
    data() {
        return {
            isOpen: false,
        };
    },
    methods: {
        linkClick() {
            if (
                this.autoClose &&
                this.$sidebar &&
                this.$sidebar.showSidebar === true
            ) {
                this.$sidebar.displaySidebar(false);
            }
        },
        toggleDropDown() {
            this.isOpen = !this.isOpen;
            this.$emit("change", this.isOpen);
        },
        closeDropDown() {
            this.isOpen = false;
            this.$emit("change", this.isOpen);
        }
    }
};
</script>
<style scoped>
.drop__down {
    cursor: pointer;
    user-select: none;
}
.dropdown___menu{
    list-style-type: none;
}
</style>
