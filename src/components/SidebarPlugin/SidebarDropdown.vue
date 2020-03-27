<template>
    <li class="nav-item drop__down">
        <a class="nav-link" @click="toggleDropDown">
            <i :class="icon"></i>
            <span>{{ title }}</span>
        </a>
        <collapse-transition>
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
                    exact-active-class="active__link"
                >
                    <template>
                        <span class="nav-link-text">{{ child.name }}</span>
                    </template>
                </router-link>
            </ul>
        </collapse-transition>
    </li>
</template>
<script>
import { CollapseTransition } from 'vue2-transitions';

export default {
    name: "sidebar-dropdown",
    components: {
        CollapseTransition,
    },
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
            this.$emit('change', this.isOpen);
        },
        closeDropDown() {
            this.isOpen = false;
            this.$emit('change', this.isOpen);
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
    padding: 0px;
    background: #ececec;
}
.active__link {
    border-left: 2px solid #5d72e4;
}
</style>
