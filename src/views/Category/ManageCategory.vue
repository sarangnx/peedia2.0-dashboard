<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12" v-for="(item, index) in categories" :key="item.category_id">
                <div class="p-2">
                    <font-awesome-icon icon="caret-right" :transform="{ rotate: item.rotate || 0 }"/>
                    <span class="pl-1 pointer" @click="toggle(index);">
                        {{ item.category_name }}
                    </span>
                </div>
                <div class="pl-4">
                    <div v-for="item2 in item.sub_category" :key="item2.name">
                        <button class="btn btn-link">
                            {{ item2.category_name }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'manage-category',
    data: () => ({
        categories: [],
    }),
    methods: {
        getCategories() {
            // Get list of all categories and sub categories
            this.$axios({
                method: 'get',
                url: '/inventory/categories/all',
            }).then((response) => {
                // assign to this.categories.
                this.categories = response.data.data.categories;
            });
        },
        toggle(index) {
            if(this.categories[index].rotate) {
                this.$set(this.categories[index], 'rotate', 0);
            } else {
                this.$set(this.categories[index], 'rotate', 90);
            }
        },
    },
    mounted() {
        this.getCategories();
    },
}
</script>
<style scoped>
.pointer {
    color: #5e72e4;
    font-weight: bold;
}

.pointer:hover {
    color: #233dd2;
    cursor: pointer;
}
</style>
